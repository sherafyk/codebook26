# Sherafy Codebook

A carefully organized reference of your most-used server-side, DevOps, and GitHub SSH commands. Everything is grouped into intuitive sections (H2), sub-sections (H3), and every copy-ready command begins with an H4 heading, a fenced code block, and a concise quoted explanation.

---

## Table of Contents

*(click to jump)*

* [ssh and remote access](#ssh-and-remote-access)

  * [connecting](#connecting)
  * [privilege escalation](#privilege-escalation)
* [system administration](#system-administration)

  * [system updates](#system-updates)
  * [reboot and power](#reboot-and-power)
  * [resource monitoring](#resource-monitoring)
  * [cleanup](#cleanup)
* [web servers apache](#web-servers-apache)

  * [installation](#installation)
  * [service control](#service-control)
  * [configuration checks](#configuration-checks)
* [docker](#docker)

  * [installation and service](#installation-and-service)
  * [images](#images)
  * [containers](#containers)
  * [docker compose](#docker-compose)
* [nodejs and pm2](#nodejs-and-pm2)

  * [installation](#installation-1)
  * [runtime and process control](#runtime-and-process-control)
* [file transfer and backups](#file-transfer-and-backups)
* [package management apt](#package-management-apt)
* [monitoring and logs](#monitoring-and-logs)
* [firewall ufw and networking](#firewall-ufw-and-networking)
* [service management systemd](#service-management-systemd)
* [file permissions and ownership](#file-permissions-and-ownership)
* [process management](#process-management)
* [database utilities](#database-utilities)
* [cron jobs](#cron-jobs)
* [ispconfig shortcuts](#ispconfig-shortcuts)
* [wordpress cli](#wordpress-cli)
* [git and github](#git-and-github)
* [miscellaneous tools](#miscellaneous-tools)

---

## ssh and remote access

### connecting

#### connect to vps server

```bash
ssh username@your-server-ip
```

> Opens an SSH session to the target host. Replace *username* and *IP* accordingly.

#### use ssh key instead of password

```bash
ssh -i /path/to/private_key username@your-server-ip
```

> Authenticates with an SSH key for stronger, passwordless logins. Keep private keys secure and permissions at `600`.

### privilege escalation

#### switch to root

```bash
sudo -i
```

> Starts a root shell so you don’t need to prepend each command with `sudo`. Use sparingly on production servers.

---

## system administration

### system updates

#### update and upgrade packages

```bash
sudo apt update && sudo apt upgrade -y
```

> Refreshes package lists and installs available updates.

#### full distribution upgrade

```bash
sudo apt full-upgrade -y
```

> Performs a more aggressive upgrade (can include kernel / dependency changes).

#### upgrade to next release (advanced)

```bash
sudo do-release-upgrade
```

> Moves Ubuntu/Debian to the next release. Backup and test first.

#### fix broken dependencies

```bash
sudo apt --fix-broken install
```

> Attempts to resolve incomplete or conflicting package installs.

### reboot and power

#### reboot server

```bash
sudo reboot
```

> Gracefully restarts the machine.

#### shutdown server

```bash
sudo poweroff
```

> Powers down the system cleanly.

### resource monitoring

#### check uptime

```bash
uptime
```

> Shows how long the system has been running and current load averages.

#### top-style monitor (htop)

```bash
htop
```

> Interactive process viewer (install with `sudo apt install htop`).

### cleanup

#### remove unused packages

```bash
sudo apt autoremove -y
```

> Deletes orphaned dependencies.

#### clean apt cache

```bash
sudo apt clean
```

> Clears cached `.deb` packages to free disk space.

---

## web servers apache

### installation

#### install apache

```bash
sudo apt install apache2 -y
```

> Installs the Apache HTTP server on Debian/Ubuntu.

### service control

#### start apache

```bash
sudo systemctl start apache2
```

> Launches the web server immediately.

#### stop apache

```bash
sudo systemctl stop apache2
```

> Halts the service.

#### restart apache

```bash
sudo systemctl restart apache2
```

> Stops and starts Apache—use after config changes.

#### reload apache config

```bash
sudo systemctl reload apache2
```

> Applies config changes without dropping live connections.

#### enable apache on boot

```bash
sudo systemctl enable apache2
```

> Ensures Apache starts automatically after reboot.

#### disable apache on boot

```bash
sudo systemctl disable apache2
```

> Removes Apache from the startup sequence.

### configuration checks

#### apache config test

```bash
sudo apache2ctl configtest
```

> Validates syntax before a reload/restart.

---

## docker

### installation and service

#### install docker engine

```bash
sudo apt install docker.io -y
```

> Installs Docker from the distro repo.

#### start docker daemon

```bash
sudo systemctl start docker
```

> Begins the Docker service.

#### enable docker on boot

```bash
sudo systemctl enable docker
```

> Auto-starts Docker after reboot.

#### check docker version

```bash
docker --version
```

> Verifies the client/daemon version.

### images

#### pull image from hub

```bash
docker pull nginx
```

> Downloads the latest Nginx image.

#### list downloaded images

```bash
docker images
```

> Local image inventory.

### containers

#### run container (detached)

```bash
docker run -d --name mynginx nginx
```

> Spins up *mynginx* in the background.

#### list running containers

```bash
docker ps
```

> Shows active containers.

#### list all containers

```bash
docker ps -a
```

> Includes stopped containers.

#### stop container

```bash
docker stop mynginx
```

> Gracefully stops the container.

#### restart container

```bash
docker restart mynginx
```

> Stops then starts the container.

#### remove container

```bash
docker rm mynginx
```

> Deletes a stopped container.

#### remove image

```bash
docker rmi nginx
```

> Frees disk space by deleting the image.

#### exec into container

```bash
docker exec -it mynginx bash
```

> Opens an interactive shell inside the container.

#### build image from dockerfile

```bash
docker build -t myapp .
```

> Creates the *myapp* image from the current directory context.

### docker compose

#### start compose stack

```bash
docker-compose up -d
```

> Builds (if needed) and runs services in detached mode.

#### stop and remove stack

```bash
docker-compose down
```

> Brings containers down and removes default networks/volumes.

---

## nodejs and pm2

### installation

#### install node via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install node
```

> Installs NVM then the latest LTS Node.js.

#### check node version

```bash
node -v
```

> Prints Node version.

#### check npm version

```bash
npm -v
```

> Prints npm version.

### runtime and process control

#### install pm2 globally

```bash
sudo npm install -g pm2
```

> Production-grade process manager.

#### start app with pm2

```bash
pm2 start app.js
```

> Launches *app.js* under pm2 supervision.

#### list pm2 processes

```bash
pm2 list
```

> Overview of managed apps.

#### restart pm2 app

```bash
pm2 restart app
```

> Zero-downtime restart.

#### stop pm2 app

```bash
pm2 stop app
```

> Gracefully stops the app.

#### view live logs

```bash
pm2 logs app
```

> Streams log output.

#### save pm2 process list

```bash
pm2 save
```

> Persists process list for reboot-survival.

#### enable pm2 on boot

```bash
pm2 startup
```

> Generates and installs init script.

---

## file transfer and backups

#### copy file to server

```bash
scp /local/path/file username@your-server-ip:/remote/path
```

> Secure copy from local → remote.

#### copy file from server

```bash
scp username@your-server-ip:/remote/path/file /local/path
```

> Remote → local.

#### recursive directory copy

```bash
scp -r /local/dir username@your-server-ip:/remote/dir
```

> Copies entire folders.

#### mysql dump database

```bash
mysqldump -u username -p database_name > backup.sql
```

> Creates SQL backup.

#### restore mysql database

```bash
mysql -u username -p database_name < backup.sql
```

> Imports backup into DB.

#### tar and compress directory

```bash
tar -czvf backup.tar.gz /path/to/directory
```

> Creates compressed archive.

#### extract compressed archive

```bash
tar -xzvf backup.tar.gz
```

> Unpacks the archive into the current directory.

---

## package management apt

#### search for package

```bash
apt search packagename
```

> Finds candidate packages.

#### install package

```bash
sudo apt install package-name
```

> Installs desired software.

#### reinstall package

```bash
sudo apt install --reinstall package-name
```

> Repairs broken installs.

#### remove package

```bash
sudo apt remove package-name
```

> Uninstalls but keeps config.

#### purge package

```bash
sudo apt purge package-name
```

> Removes package and configs.

#### list installed packages

```bash
dpkg --get-selections
```

> Useful for audits & migrations.

#### show package info

```bash
apt show package-name
```

> Displays description, dependencies, etc.

---

## monitoring and logs

#### view system journal

```bash
sudo journalctl -xe
```

> Shows recent system-wide logs with errors highlighted.

#### follow apache error log

```bash
sudo tail -f /var/log/apache2/error.log
```

> Live-streams web-server errors.

#### follow syslog

```bash
sudo tail -f /var/log/syslog
```

> Distribution-agnostic system messages.

#### view listening ports

```bash
sudo netstat -tuln | grep LISTEN
```

> Confirms which services are accepting connections.

---

## firewall ufw and networking

#### allow port (example 2501)

```bash
sudo ufw allow 2501/tcp
```

> Opens port 2501 for TCP traffic.

#### reload ufw

```bash
sudo ufw reload
```

> Applies rule changes.

#### check firewall status

```bash
sudo ufw status
```

> Lists active rules.

#### check port reachability (localhost)

```bash
curl -I http://127.0.0.1:2501
```

> Quick HTTP response check.

---

## service management systemd

#### restart apache (web)

```bash
sudo systemctl restart apache2
```

> Common after editing vhosts.

#### restart php-fpm

```bash
sudo systemctl restart php8.2-fpm
```

> Swap version as needed.

#### restart ispconfig daemon

```bash
sudo systemctl restart ispconfig_server
```

> Reloads panel backend services.

---

## file permissions and ownership

#### change ownership (recursive)

```bash
sudo chown -R web16:client0 /var/www/clients/client0/web16/web
```

> Typical ISPConfig ownership pattern.

#### change permissions (directories 755)

```bash
sudo chmod -R 755 /path/to/directory
```

> Grants execute to owner/group/world for directories.

#### add immutable attribute

```bash
sudo chattr +i /var/www/clients/client0/web17
```

> Protects files from modification—even by root.

#### remove immutable attribute

```bash
sudo chattr -i /var/www/clients/client0/web17
```

> Allows edits again.

---

## process management

#### monitor processes (top)

```bash
top
```

> Quick real-time CPU / memory view.

#### kill process by pid

```bash
kill -9 PID
```

> Force-terminates the given PID.

#### find process by port

```bash
sudo lsof -i :PORT
```

> Useful when a service refuses to bind.

---

## database utilities

*See file transfer and backups section for dump/restore commands.*

---

## cron jobs

#### edit crontab

```bash
crontab -e
```

> Opens the current user’s job list in `$EDITOR`.

#### list cron jobs

```bash
crontab -l
```

> Shows scheduled tasks.

---

## ispconfig shortcuts

#### update ispconfig

```bash
cd /tmp && wget -O ispconfig_update.sh https://get.ispconfig.org && sudo bash ispconfig_update.sh
```

> Official update method; backup first.

#### restart core services

```bash
sudo systemctl restart apache2 postfix dovecot pure-ftpd-mysql
```

> Web, mail, and FTP stack reload.

#### backup ispconfig database

```bash
mysqldump -u root -p dbispconfig > dbispconfig_backup.sql
```

> Always dump before upgrades.

---

## wordpress cli

#### update all plugins

```bash
wp plugin update --all
```

> Keeps plugins patched.

#### flush wp cache

```bash
wp cache flush
```

> Clears transients/object cache.

#### search and replace db strings

```bash
wp search-replace 'oldurl.com' 'newurl.com'
```

> Essential after domain migrations.

---

## git and github

#### clone repository

```bash
git clone https://github.com/yourusername/repo.git
```

> Creates a local working copy.

#### pull latest changes

```bash
git pull origin main
```

> Syncs local *main* with remote.

#### quick add / commit / push

```bash
git add .
git commit -m "Update notes"
git push origin main
```

> Fast-path workflow for small updates.

---

## miscellaneous tools

#### generate uuid

```bash
uuidgen
```

> Handy for unique filenames or API keys.

#### show public ip

```bash
curl ifconfig.me
```

> Confirms external address.
