# Loading Docker Package on Apache VPS - ISPConfig 3 panel

> \[!TIP]
> Replace brackets (`<…>`) with values for **your** environment; keep placeholder paths if you’re just testing.

---

## 0. High-Level Flow

```
GitHub repo  ──╮
               │  1. git clone / pull
VPS filesystem ─┤
               │  2. docker compose build (or pull) ➜ image
Docker daemon  ─╯
               │  3. container listens on 8080 **inside**
Apache vhost   ──► localhost:<host_port>  (e.g. 18080)
               │      4. Apache HTTPS proxy
Internet user  ──► https://svg.example.org/…
```

---

## 1. Prerequisites

| What                         | Min. version      | Notes                                             |
| ---------------------------- | ----------------- | ------------------------------------------------- |
| Debian/Ubuntu server         | 20.04 LTS+        | Any distro works if you translate the `apt` bits  |
| Docker Engine                | **20.10.x**       | `sudo apt-get install docker.io` or official repo |
| Docker Compose v2            | **v2.30+**        | Stand-alone binary is simplest (see § 6.1)        |
| Apache 2.4 + ISPConfig       | latest            | ISPConfig typically runs its panel on **:8080**   |
| A spare sub-domain           | `sub.example.com` | DNS must point to your VPS                        |
| SSH access as root (or sudo) | —                 |                                                   |

---

## 2. Directory Layout (example)

```text
/var/www/clients/client<X>/web<Y>/
└─ <repository-name>/          # <project-folder>
   ├─ app/                     # your FastAPI (or other) code
   ├─ docker-compose.yml
   ├─ Dockerfile
   └─ README.md
```

> **Tip:**
> If you already created an outer folder and then cloned the repo *inside* it, you’ll get *nested* `<repository-name>/<repository-name>`.
> Fix with:
>
> ```bash
> rsync -av <repository-name>/ ./ && rm -rf <repository-name>
> ```

---

## 3. Clone (or Update) the Repository

```bash
cd /var/www/clients/client<X>/web<Y>/
git clone https://github.com/<you>/<repository-name>
# --- later, to fetch updates ---
cd /var/www/clients/client<X>/web<Y>/<repository-name>
git pull origin main
```

---

## 4. Build or Pull Your Image

### 4.1 Build locally (default)

```bash
cd /var/www/clients/client<X>/web<Y>/<repository-name>
docker compose down                # stop old containers if any
docker compose up -d --build       # build & start detached
```

### 4.2 Pull a pre-built image (if you publish to GHCR/Docker Hub)

```yaml
# docker-compose.yml (excerpt)
services:
  app:
    image: ghcr.io/<you>/<repository-name>:latest
    ports:
      - "18080:8080"   # left = host port, right = in-container port
```

```bash
docker compose down
docker compose pull
docker compose up -d
```

#### Private image?

Add a Personal Access Token (**PAT**) with `read:packages` scope:

```bash
echo "$GHCR_PAT" | docker login ghcr.io -u <github_user> --password-stdin
```

---

## 5. Choosing a Host Port

* ISPConfig already binds **8080** ➜ use something else (e.g. **18080**).
* Edit `docker-compose.yml`:

```yaml
ports:
  - "18080:8080"
```

* Re-create the service:

```bash
docker compose up -d --build
```

Check:

```bash
curl http://localhost:18080/healthz    # → {"status":"ok"}
```

---

## 6. Docker & Docker Compose Quick-Fixes

### 6.1 Install / upgrade Compose v2 (stand-alone)

```bash
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest \
                  | grep tag_name | cut -d '"' -f 4)
curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
     -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose   # compatibility
docker-compose --version      # should show v2.x
```

### 6.2 Port already in use

```bash
sudo lsof -i :8080          # find culprit
# or change host port in compose file as shown above
```

### 6.3 Immutable ISPConfig directories

```bash
sudo chattr -i /var/www/clients/client<X>/web<Y>
# ... make changes ...
sudo chattr +i /var/www/clients/client<X>/web<Y>
```

---

## 7. Apache + ISPConfig Reverse-Proxy

1. **Create site** in ISPConfig → *Sites › Add new website*

   * Domain: `svg.example.org`
   * Document Root: keep default (`/var/www/clients/client<X>/web<Y>/web`) – ignored for proxying.

2. **Enable proxy modules** (once):

```bash
sudo a2enmod proxy proxy_http
sudo systemctl reload apache2
```

3. **Custom Apache Directives** (inside the site in ISPConfig):

```apache
# Forward everything to the Docker app
ProxyPreserveHost On
ProxyPass        / http://127.0.0.1:18080/
ProxyPassReverse / http://127.0.0.1:18080/
```

4. **SSL**
   *ISPConfig › SSL* → check **Let’s Encrypt** → Save.
   Apache will now terminate HTTPS and still proxy **HTTP** to `localhost:18080`.

---

## 8. Common FastAPI Container Pitfalls

| Symptom (docker logs)                           | Cause                                       | Fix                                               |                                                                    |
| ----------------------------------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| `bind: address already in use`                  | Host port collides (e.g. ISPConfig on 8080) | Change left-side port in `ports:`                 |                                                                    |
| `FastAPIError: Invalid args for response field` | Return type annotated \`-> Response         | JSONResponse\`                                    | Remove the annotation **or** `@app.post(..., response_model=None)` |
| `curl: (7) Failed to connect`                   | App crashed during start                    | Run `docker compose logs -f` and fix Python error |                                                                    |

---

## 9. Updating the Running Service

```bash
cd /var/www/clients/client<X>/web<Y>/<repository-name>
git pull origin main
docker compose down
docker compose up -d --build
```

---

## 10. House-Keeping & Security

* **API auth**: read a token from `API_TOKEN` env var and require `Authorization: Bearer <token>`.
* **Make GHCR image public** if you never want to store PATs on the server.
* **Docker credentials**: after `docker login`, creds sit in `/root/.docker/config.json`.
  Remove with `docker logout ghcr.io` if you later open-source the image.
* **Logs**:
  `docker compose logs -f` (app) or `journalctl -u apache2` (proxy).

---

## 11. Bonus Enhancements

| Feature                    | How                                                                       |
| -------------------------- | ------------------------------------------------------------------------- |
| Rotate SVG jobs off-thread | Celery + Redis and return `202 Accepted`                                  |
| Rate-limit abuse           | `mod_ratelimit` (Apache) or `slowapi` (FastAPI)                           |
| Automatic CVE updates      | `unattended-upgrades` on Debian, `docker image prune --filter until=168h` |
| Systemd instead of Compose | Generate a unit with `docker compose convert`                             |
