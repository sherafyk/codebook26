# WordPress Plugin Development Workflow Guide
## Docker + Local Dev + Codex + GitHub + ISPConfig 3 Deployment

This guide is for future WordPress plugin projects using the same general workflow:

- local development with Docker
- code generation/iteration with Codex
- source control in GitHub
- deployment to a live ISPConfig 3 WordPress server
- plugin-first development rather than theme-first development

This is written as a practical operating manual, not a theory document.

---

## 1. Core workflow at a glance

The full loop is:

1. Start local WordPress in Docker.
2. Mount the plugin repo directly into `wp-content/plugins`.
3. Edit and test locally.
4. Use Codex in small chunks, not giant one-shot prompts.
5. Commit changes locally.
6. Push to GitHub.
7. SSH into the live server.
8. `git pull` the plugin repo on the server.
9. Verify in WordPress admin.
10. Only use ZIP upload for emergency/manual fallback or packaged releases.

The most important mindset change is this:

**Do not develop by repeatedly downloading ZIPs and re-uploading plugins.**
That is a fallback, not the primary workflow.

---

## 2. Recommended architecture for future WordPress plugin work

Use this default stack unless there is a strong reason not to:

- **Editor:** VS Code
- **AI coding assistant:** Codex
- **Local environment:** Docker Compose
- **WordPress runtime:** official WordPress Docker image
- **Database:** MySQL via Docker
- **CLI:** WP-CLI in Docker
- **Source control:** Git + GitHub
- **Server:** ISPConfig 3-hosted WordPress instance
- **Deployment:** `git pull` on the server
- **Fallback deployment:** upload ZIP through WordPress admin

This keeps local dev, version control, and deployment all cleanly separated.

---

## 3. Project layout pattern

Keep a reusable local structure like this:

```text
your-dev-root/
  wp-local/
    docker-compose.yml
    wp/
  plugins/
    your-plugin-repo/
```

General intent:

- `wp-local/` contains the Dockerized WordPress environment
- `plugins/your-plugin-repo/` contains the actual Git repo
- the plugin repo is bind-mounted into the Docker WordPress install

Do not put plugin code inside random ZIP folders or temporary directories if you can avoid it.

---

## 4. Local Docker WordPress setup

### 4.1 Create the local WordPress environment folder

Create a folder for the Dockerized site, for example:

```text
wp-local/
```

Inside it, create:

- `docker-compose.yml`
- a `wp/` folder will be created automatically on first boot

### 4.2 Use Docker Compose with three services

The standard local setup is:

- `db` → MySQL
- `wordpress` → WordPress + Apache + PHP
- `wpcli` → WordPress CLI container

### 4.3 Base `docker-compose.yml` template

Use this as the standard starter:

```yaml
version: '3.9'

services:
  db:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_RANDOM_ROOT_PASSWORD: "1"
    volumes:
      - db_data:/var/lib/mysql

  wordpress:
    image: wordpress:php8.3-apache
    restart: always
    depends_on:
      - db
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./wp:/var/www/html
      - /absolute/path/to/your/plugin-repo:/var/www/html/wp-content/plugins/your-plugin-slug

  wpcli:
    image: wordpress:cli
    depends_on:
      - db
      - wordpress
    user: "33:33"
    working_dir: /var/www/html
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./wp:/var/www/html
      - /absolute/path/to/your/plugin-repo:/var/www/html/wp-content/plugins/your-plugin-slug

volumes:
  db_data:
```

### 4.4 Windows path note

On Windows, Docker mount paths should usually use forward slashes:

```text
C:/path/to/plugin-repo
```

not backslashes.

### 4.5 Start the environment

From inside `wp-local/`:

```bash
docker compose up -d
```

Open:

```text
http://localhost:8080
```

Complete the WordPress installation in the browser.

### 4.6 Activate the plugin

Use WP-CLI:

```bash
docker compose run --rm wpcli wp plugin activate your-plugin-slug
```

Check installed plugins:

```bash
docker compose run --rm wpcli wp plugin list
```

---

## 5. Daily local development workflow

This is the normal loop:

1. Open the plugin repo in VS Code.
2. Ask Codex for a specific change.
3. Review the diff.
4. Refresh local WordPress in the browser.
5. Test.
6. Repeat until the feature works.
7. Commit only after the feature is confirmed locally.

This should feel similar to web app development:

- edit code
- refresh
- test

No ZIP rebuild step should be part of the normal loop.

---

## 6. How to work with Codex effectively

### 6.1 Do not give one giant prompt for a large feature

For WordPress plugin changes, use **small, bounded chunks**.

Best default pattern:

- **Prompt 1:** inspect only
- **Prompt 2:** backend/core logic
- **Prompt 3:** admin/config UI
- **Prompt 4:** runner UX / integration
- **Prompt 5:** tests / cleanup / verification

For medium features, 3 chunks is usually enough:

- Chunk 1: backend contracts and apply logic
- Chunk 2: admin configuration
- Chunk 3: frontend/runner integration and cleanup

### 6.2 Good Codex prompt rules

Always tell Codex to:

- read `AGENTS.md` first if the repo has one
- preserve existing architecture and naming conventions
- avoid unrelated refactors
- stop after the requested chunk
- summarize changed files
- preserve backward compatibility unless there is a strong reason not to

### 6.3 Prompt structure that works well

A strong Codex prompt usually includes:

- the exact bug/feature
- the scope boundaries
- files/patterns to inspect
- implementation constraints
- definition of done
- requested output format

---

## 7. Recommended local testing workflow

For plugin testing, use a dedicated local WordPress site with safe throwaway data.

### 7.1 Seed useful test content

Create:

- several posts
- several drafts
- several media items
- at least one admin user
- optionally one lower-permission user

This helps test:

- generation
- apply/update flows
- permissions
- media metadata
- post excerpt/title/content updates

### 7.2 Test in this order

For any feature:

1. Save admin config successfully
2. Run the AI tool successfully
3. Apply/update the selected target successfully
4. Re-open the target in WordPress and confirm persisted data
5. Confirm unrelated plugin behavior still works

### 7.3 Use explicit smoke tests

For example, if testing excerpt updates:

- select a known draft
- generate excerpt
- apply excerpt
- open the post editor
- confirm excerpt is saved

Do not rely only on success toasts. Always verify persisted state in WordPress itself.

---

## 8. Logging and debugging workflow

When something fails, debug in this order.

### 8.1 Browser DevTools

Open:

- Console
- Network tab

Look for:

- failed AJAX requests
- failed REST requests
- request payloads
- response bodies
- JavaScript errors

This is often the fastest way to catch:
- wrong payload shape
- missing field mapping
- failed nonce/auth
- 400 validation errors

### 8.2 Docker logs

From the local WordPress folder:

```bash
docker compose logs -f wordpress
```

This shows PHP and Apache-side issues.

### 8.3 Enable WordPress debug logging

In `wp-config.php`, set:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
@ini_set('display_errors', 0);
```

Then inspect:

```text
wp/wp-content/debug.log
```

### 8.4 Add temporary plugin-side logs

For targeted debugging, add `error_log()` statements around:

- route entry
- permission checks
- field mapping logic
- `wp_update_post()`
- `update_post_meta()`
- final response payload

Use a clear prefix like:

```php
error_log('PLUGIN APPLY: ...');
```

Then remove or reduce noisy logs after the fix is confirmed.

### 8.5 Common failure pattern to remember

If:
- generation works
- apply fails with 400
- there is no fatal PHP error

then the issue is often:
- payload mismatch
- unsupported field mapping
- backend validation mismatch
- missing apply contract

Not a WordPress core failure.

---

## 9. WordPress REST and Docker self-request caveat

A common Site Health warning in Docker is:

- WordPress tries to make a server-side request to `http://localhost:8080`
- inside the container, `localhost` refers to the container itself
- Apache inside the container listens on port `80`, not `8080`
- so server-to-self HTTP calls to `localhost:8080` may fail

This can produce Site Health warnings like:

- REST API self-test failures
- cURL error 7
- failed loopback requests

Important takeaway:

- browser-to-WordPress requests can still work fine
- this is often a local Docker loopback issue
- do not assume it is the root cause of a plugin bug unless the plugin itself uses server-side HTTP calls back to the site

Prefer direct WordPress function calls over `wp_remote_get()` / `wp_remote_post()` back into your own site where possible.

---

## 10. Git workflow

### 10.1 Initialize the plugin repo

Inside the plugin repo:

```bash
git init
git add .
git commit -m "Initial commit"
```

Add GitHub remote:

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

### 10.2 Normal working loop

For each tested local change:

```bash
git add .
git commit -m "Describe the change"
git push
```

Use small, meaningful commits. Do not wait until the plugin is massively changed.

### 10.3 Good commit message style

Examples:

- `fix excerpt apply mapping`
- `add attachment metadata apply route`
- `validate canonical apply fields`
- `improve runner error handling`

Keep them specific and readable.

---

## 11. Live server deployment with ISPConfig 3

### 11.1 Recommended deployment approach

For ISPConfig 3-hosted WordPress, the recommended long-term workflow is:

- plugin code lives in a Git repo
- the live plugin folder on the server is a Git clone
- updates are deployed with `git pull`

This is much better than repeatedly uploading ZIP files.

### 11.2 One-time server setup

SSH into the server:

```bash
ssh your-user@your-server
```

Go to the WordPress plugin directory for that site.

The exact path will vary by site, but in ISPConfig 3 it often looks like:

```text
/var/www/clients/clientX/webY/web/...
```

The exact plugin path will depend on your site layout.

If the plugin was previously uploaded manually, remove or archive the old folder first.

Clone the GitHub repo into the plugin directory:

```bash
git clone <your-github-repo-url> your-plugin-slug
```

Then verify the plugin appears in WordPress admin.

### 11.3 Normal deployment after setup

After local testing and pushing to GitHub:

```bash
ssh your-user@your-server
cd /path/to/live/plugin/folder
git pull
```

That is the standard deploy.

### 11.4 Recommended server-side checks after pull

After deployment:

- refresh WordPress admin
- verify plugin loads
- test the changed feature
- review PHP error logs if needed
- reactivate plugin only if required

### 11.5 File permissions

If server file ownership causes trouble after pull, fix ownership or group permissions according to the server’s web user.

Do not casually run broad permission changes without knowing the host setup.

---

## 12. When to use ZIP upload anyway

ZIP upload still has a place, but it should not be the default workflow.

Use ZIP upload for:

- emergency manual installs
- client delivery packages
- one-off installs on servers without Git access
- release artifacts
- backup fallback if server Git workflow is unavailable

Do not use it for ordinary iteration if you control the server.

---

## 13. Optional but useful upgrades

### 13.1 WP-CLI shortcuts

Create shell aliases or helper scripts so you do not keep typing long commands.

Examples:

```bash
alias wpup='docker compose up -d'
alias wpdown='docker compose down'
alias wplogs='docker compose logs -f wordpress'
alias wpcli='docker compose run --rm wpcli wp'
```

Then use:

```bash
wpcli plugin list
wpcli plugin activate your-plugin-slug
```

### 13.2 Xdebug

If future plugin work gets more complex, add Xdebug to local Docker.

Use it when:
- you need step debugging
- stack traces are not enough
- debugging PHP execution flow becomes painful

### 13.3 Seed scripts

For plugin-heavy workflows, it is worth adding simple seed scripts for:

- test posts
- test drafts
- test media
- test users

That makes repeated testing much easier.

### 13.4 CI/CD later

Once the workflow stabilizes, you can automate deployment using:

- GitHub Actions
- deploy over SSH
- or server-side hooks

But do not overcomplicate this too early. Start with:
- local Docker
- GitHub
- `git pull`

That is a very good baseline.

---

## 14. How to think about plugin architecture changes

When planning a feature, always ask:

- does this belong in admin configuration?
- does this belong in runtime execution?
- does this belong in an explicit apply/update path?
- should this use direct WordPress functions instead of self-HTTP?
- what is the smallest implementation that fits the current plugin structure?

Good plugin development usually means:

- minimal moving parts
- explicit flows
- strong validation
- clear separation between generation and persistence

---

## 15. Practical “golden workflow” for future projects

This is the workflow to follow by default.

### New plugin project
1. Create plugin repo.
2. Create local Docker WordPress environment.
3. Mount plugin repo into `wp-content/plugins`.
4. Start Docker.
5. Activate plugin with WP-CLI.
6. Commit initial scaffold.
7. Push to GitHub.
8. Clone repo into live server plugin directory.
9. Deploy future updates with `git pull`.

### New feature
1. Write or update `AGENTS.md`.
2. Ask Codex to inspect only.
3. Implement in 2–4 bounded chunks.
4. Test locally after each chunk.
5. Commit and push.
6. Deploy via `git pull`.
7. Verify in live admin.

### New bug
1. Reproduce locally first.
2. Check browser Network + Console.
3. Check Docker logs.
4. Check `debug.log`.
5. Add temporary targeted logging.
6. Fix locally.
7. Commit.
8. Push.
9. Deploy.
10. Verify again on live.

---

## 16. Common mistakes to avoid

Avoid these:

- developing by repeated ZIP upload
- changing too much in one Codex prompt
- skipping local testing before pushing
- relying only on success messages instead of verifying persisted data
- letting frontend field names, output keys, and backend target fields drift apart
- using server-to-self HTTP when direct WordPress functions would work
- editing the live server directly instead of through Git

---

## 17. Personal checklist before declaring a feature done

Before pushing/deploying, verify:

- local WordPress environment runs
- plugin activates cleanly
- no fatal PHP errors
- browser Network requests look correct
- target data is actually persisted
- debug logging is cleaned up or reduced
- Git status is clean
- commit message is meaningful
- live deploy path is ready

---

## 18. Fast reference commands

### Docker
```bash
docker compose up -d
docker compose down
docker compose logs -f wordpress
docker compose run --rm wpcli wp plugin list
docker compose run --rm wpcli wp plugin activate your-plugin-slug
```

### Git
```bash
git status
git add .
git commit -m "your message"
git push
git pull
```

### Server deploy
```bash
ssh your-user@your-server
cd /path/to/live/plugin/folder
git pull
```

---

## 19. Final operating principle

For future WordPress plugin projects, the winning system is:

- **Codex for scoped implementation**
- **Docker for safe local WordPress dev**
- **WP-CLI for operational speed**
- **GitHub for source control**
- **`git pull` on ISPConfig for deployment**

If a workflow step feels repetitive, manual, or fragile, it should probably be replaced with a cleaner local dev or Git-based approach.

That is the standard to keep.
