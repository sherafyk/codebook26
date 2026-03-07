# Linux VPS Hardening & Operations Guide
## Debian 12 + ISPConfig 3 + Apache + PHP-FPM + WordPress Fleet

---

# Table of Contents

1. [Introduction & Conventions](#1-introduction--conventions)
2. [Quick Health Assessment](#2-quick-health-assessment)
3. [System Resource Monitoring](#3-system-resource-monitoring)
4. [ISPConfig Filesystem Structure](#4-ispconfig-filesystem-structure)
5. [Diagnosing High Load & CPU Spikes](#5-diagnosing-high-load--cpu-spikes)
6. [Disk Space Management](#6-disk-space-management)
7. [Log Management & Rotation](#7-log-management--rotation)
8. [Bot Mitigation & Attack Prevention](#8-bot-mitigation--attack-prevention)
9. [Fail2Ban Configuration](#9-fail2ban-configuration)
10. [Cloudflare Integration](#10-cloudflare-integration)
11. [Apache Hardening](#11-apache-hardening)
12. [PHP-FPM Tuning & Containment](#12-php-fpm-tuning--containment)
13. [WordPress Security Hardening](#13-wordpress-security-hardening)
14. [Database Monitoring & Optimization](#14-database-monitoring--optimization)
15. [SSH & Access Hardening](#15-ssh--access-hardening)
16. [Firewall Configuration](#16-firewall-configuration)
17. [Automatic Security Updates](#17-automatic-security-updates)
18. [Backup Strategy](#18-backup-strategy)
19. [Malware Detection & Response](#19-malware-detection--response)
20. [Performance Optimization](#20-performance-optimization)
21. [Monitoring & Alerting](#21-monitoring--alerting)
22. [Maintenance Procedures](#22-maintenance-procedures)
23. [Troubleshooting Decision Trees](#23-troubleshooting-decision-trees)
24. [Quick Reference Commands](#24-quick-reference-commands)
25. [New Server Build Checklist](#25-new-server-build-checklist)
26. [Safety Rules & Best Practices](#26-safety-rules--best-practices)

---

# 1. Introduction & Conventions

## Purpose

This guide provides comprehensive documentation for hardening, monitoring, and troubleshooting a Linux VPS running Debian 12 with ISPConfig 3. It is designed as a reference for system administrators managing multi-site WordPress hosting environments.

## Environment Assumptions

| Component | Details |
|-----------|---------|
| Operating System | Debian 12 (Bookworm) |
| Control Panel | ISPConfig 3 |
| Web Server | Apache 2.4 |
| PHP Handler | PHP-FPM (pools per site) |
| Database | MariaDB / MySQL |
| Reverse Proxy | Cloudflare (optional) |
| CMS | WordPress (primarily) |

## Naming Conventions Used

| Term | Description |
|------|-------------|
| `$SITE_USER` | ISPConfig site user (e.g., `web1`, `web2`, etc.) |
| `$CLIENT` | ISPConfig client directory (e.g., `client0`, `client1`) |
| `$SITE_ROOT` | Full path to site container: `/var/www/clients/$CLIENT/$SITE_USER/` |
| `$DOCROOT` | Document root: `/var/www/clients/$CLIENT/$SITE_USER/web/` |
| `$ACCESS_LOG` | Site access log: `/var/www/clients/$CLIENT/$SITE_USER/log/access.log` |
| `$ERROR_LOG` | Site error log: `/var/www/clients/$CLIENT/$SITE_USER/log/error.log` |

## Understanding ISPConfig Site Users

ISPConfig creates a unique Linux system user for each website. These users follow the pattern `web1`, `web2`, `web3`, etc. Each user:

- Has a dedicated home directory under `/var/www/clients/`
- Runs its own PHP-FPM pool
- Has isolated permissions from other sites
- Appears in process listings when that site is active

**Important:** The number in the user name (e.g., `web13`) does not indicate any ranking or priority—it is simply a sequential identifier assigned when the site was created.

---

# 2. Quick Health Assessment

## 2.1 The 60-Second Triage

When something feels wrong, run these commands first to get an immediate picture of system health.

### System Load & Uptime

```bash
uptime
```

**Output interpretation:**

| Load Average | Meaning (for 2-core VPS) |
|--------------|--------------------------|
| < 2.0 | Normal operation |
| 2.0 - 4.0 | Elevated, investigate |
| 4.0 - 6.0 | High load, likely performance impact |
| > 6.0 | Critical, immediate attention needed |

**Note:** Load average should be evaluated relative to CPU core count. A load of 2.0 on a 2-core system means full utilization.

### Memory Status

```bash
free -h
```

**Key values to monitor:**

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Available Memory | > 40% of total | 20-40% | < 20% |
| Swap Used | < 10% of swap | 10-50% | > 50% |

### Disk Usage

```bash
df -hT
```

**Thresholds:**

| Usage | Status | Action |
|-------|--------|--------|
| < 70% | Healthy | Monitor normally |
| 70-85% | Warning | Plan cleanup |
| 85-90% | Critical | Immediate cleanup required |
| > 90% | Emergency | Services may fail |

## 2.2 Service Health Check

```bash
# Check for failed services
systemctl --no-pager --failed

# Check critical services
systemctl status apache2 --no-pager
systemctl status mariadb --no-pager
systemctl status php*-fpm --no-pager
systemctl status fail2ban --no-pager
systemctl status ssh --no-pager
```

## 2.3 Active Swap Pressure Test

```bash
vmstat 1 5
```

**Interpreting output:**

| Column | Meaning | Healthy Value |
|--------|---------|---------------|
| `si` | Swap in (KB/s) | 0 or near 0 |
| `so` | Swap out (KB/s) | 0 or near 0 |
| `wa` | I/O wait % | < 5% |

**If `si` and `so` are repeatedly non-zero:** The system is actively swapping, which causes severe performance degradation.

---

# 3. System Resource Monitoring

## 3.1 Real-Time CPU and Memory Consumers

### Top CPU Consumers

```bash
ps -eo user,pid,pcpu,pmem,cmd --sort=-pcpu | head -20
```

### Top Memory Consumers

```bash
ps -eo user,pid,pcpu,pmem,cmd --sort=-pmem | head -20
```

### Combined One-Liner

```bash
echo "=== TOP CPU ===" && ps -eo user,pcpu,cmd --sort=-pcpu | head -10 && \
echo "=== TOP RAM ===" && ps -eo user,pmem,cmd --sort=-pmem | head -10
```

## 3.2 Historical Averages with Sysstat

Sysstat provides historical data collection—essential for understanding patterns over time rather than just snapshots.

### Installation

```bash
apt update
apt install -y sysstat
```

### Enable Data Collection

```bash
# Enable sysstat
sed -i 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat

# Start and enable the service
systemctl enable --now sysstat
```

**Note:** Sysstat collects data every 10 minutes by default. Historical data becomes available after collection begins.

### Viewing Historical Data

```bash
# CPU averages for today
sar -u

# Memory averages for today
sar -r

# Specific day (replace XX with day of month)
sar -u -f /var/log/sysstat/saXX
sar -r -f /var/log/sysstat/saXX

# I/O statistics
sar -b
```

### Interpreting SAR Output

**CPU (`sar -u`):**

| Field | Description | Healthy Range |
|-------|-------------|---------------|
| `%user` | User-space CPU | Varies |
| `%system` | Kernel CPU | < 20% |
| `%iowait` | Waiting for I/O | < 10% |
| `%idle` | Idle CPU | > 20% |

**Calculate actual CPU usage:** `100 - %idle = CPU usage`

**Memory (`sar -r`):**

| Field | Description |
|-------|-------------|
| `kbmemused` | Memory used (KB) |
| `%memused` | Percentage of memory used |
| `kbswpused` | Swap used (KB) |

## 3.3 Real-Time Rolling Averages

When you need averages without waiting for sysstat history:

### CPU Average Over 60 Seconds

```bash
mpstat 1 60 | awk '/Average/ {print "CPU Used:", 100-$NF "%"}'
```

### Memory Snapshots Over 60 Seconds

```bash
free -m -s 1 -c 60
```

### Quick Current Status One-Liner

```bash
echo "CPU:" $(top -bn1 | grep "Cpu(s)" | awk '{print 100-$8"%"}') \
     "RAM:" $(free | awk '/Mem/ {printf "%.2f%%", $3/$2*100}')
```

## 3.4 I/O Monitoring

### Install iotop

```bash
apt install -y iotop
```

### View I/O by Process

```bash
# Accumulated I/O, only show active processes
iotop -oPa
```

**Press `q` to exit after observing for 10-15 seconds.**

### Disk I/O Statistics

```bash
iostat -x 1 5
```

**Key columns:**

| Column | Description | Warning Threshold |
|--------|-------------|-------------------|
| `%util` | Device utilization | > 80% sustained |
| `await` | Average wait time (ms) | > 20ms |
| `r/s`, `w/s` | Reads/writes per second | Context-dependent |

## 3.5 Long-Term Resource Logging

For ongoing monitoring and trend analysis:

### Using dstat

```bash
apt install -y dstat

# Log CPU, disk, network, memory every 60 seconds
dstat -cdnm --output /var/log/resource-stats.csv 60 &
```

### Review Later

```bash
cat /var/log/resource-stats.csv
```

---

# 4. ISPConfig Filesystem Structure

## 4.1 Directory Layout

Understanding the ISPConfig directory structure is essential for troubleshooting and maintenance.

```
/var/www/
└── clients/
    └── client0/                    # Client container
        ├── web1/                   # Site 1 container
        │   ├── web/                # Document root
        │   │   ├── wp-config.php
        │   │   ├── wp-content/
        │   │   └── ...
        │   ├── log/                # Site logs
        │   │   ├── access.log
        │   │   └── error.log
        │   ├── ssl/                # SSL certificates
        │   ├── tmp/                # Temporary files
        │   └── cgi-bin/            # CGI scripts
        ├── web2/                   # Site 2 container
        └── ...
```

## 4.2 Key Paths Reference

| Purpose | Path Pattern |
|---------|--------------|
| All clients | `/var/www/clients/` |
| Specific client | `/var/www/clients/$CLIENT/` |
| Site container | `/var/www/clients/$CLIENT/$SITE_USER/` |
| Document root | `/var/www/clients/$CLIENT/$SITE_USER/web/` |
| Access log | `/var/www/clients/$CLIENT/$SITE_USER/log/access.log` |
| Error log | `/var/www/clients/$CLIENT/$SITE_USER/log/error.log` |
| WordPress config | `/var/www/clients/$CLIENT/$SITE_USER/web/wp-config.php` |
| Uploads | `/var/www/clients/$CLIENT/$SITE_USER/web/wp-content/uploads/` |
| Plugins | `/var/www/clients/$CLIENT/$SITE_USER/web/wp-content/plugins/` |
| Themes | `/var/www/clients/$CLIENT/$SITE_USER/web/wp-content/themes/` |

## 4.3 Mapping Processes to Sites

When you see a process consuming resources:

```
web5  12345  25.0  3.2  php-fpm: pool web5
```

### Find the Site Container

```bash
getent passwd web5
```

**Output example:**
```
web5:x:5005:5005::/var/www/clients/client0/web5:/bin/false
```

The home directory shows the site container path.

### List All Site Users and Paths

```bash
# List all webX users and their home directories
getent passwd | grep "^web[0-9]" | cut -d: -f1,6
```

### Find Which Sites Exist

```bash
# List all site containers
ls -la /var/www/clients/*/

# More detailed view
for site in /var/www/clients/*/web*/; do
    echo "$site"
done
```

## 4.4 ISPConfig Database Mapping

For more detailed site information, query the ISPConfig database:

```bash
mysql -u root -p dbispconfig -e "SELECT domain_id, domain, system_user, document_root FROM web_domain WHERE type='vhost';"
```

---

# 5. Diagnosing High Load & CPU Spikes

## 5.1 Systematic Diagnosis Workflow

When load is elevated, follow this systematic approach:

### Step 1: Identify the Consumer Type

```bash
ps -eo user,pid,pcpu,pmem,cmd --sort=-pcpu | head -15
```

**Common patterns:**

| Process Type | Likely Cause |
|--------------|--------------|
| `php-fpm: pool webX` | Website traffic, bot attacks, plugin issues |
| `mysqld` / `mariadbd` | Database queries, slow queries, table locks |
| `apache2` | Connection handling, keepalive issues |
| `clamd` | Antivirus scanning |
| `rspamd` | Email spam filtering |

### Step 2: If PHP-FPM Is the Culprit

Identify which site user's pool is consuming resources:

```bash
# Show PHP-FPM pools sorted by CPU
ps -eo user,pcpu,pmem,cmd --sort=-pcpu | grep "php-fpm" | head -20
```

### Step 3: Map User to Site

```bash
# Replace $SITE_USER with the user from Step 2
getent passwd $SITE_USER
```

### Step 4: Identify Hot Endpoints

Once you know the site, check what URLs are being hit:

```bash
# Replace path with actual site log path
awk '{print $7}' /var/www/clients/$CLIENT/$SITE_USER/log/access.log | \
    sort | uniq -c | sort -nr | head -30
```

**Common attack indicators:**

| Endpoint | Indicates |
|----------|-----------|
| `/xmlrpc.php` | XML-RPC attack (brute force, DDoS amplification) |
| `/wp-login.php` | Login brute force |
| `/wp-admin/admin-ajax.php` | Plugin abuse or bot activity |
| `/.env` | Environment file probing |
| `/wp-config.php` | Configuration file probing |
| Random plugin/theme paths | Vulnerability scanning |

## 5.2 Fleet-Wide Endpoint Analysis

Scan all sites at once to find attack patterns:

```bash
for d in /var/www/clients/*/*/log; do
    [ -f "$d/access.log" ] || continue
    echo "==== $d ===="
    awk '{print $7}' "$d/access.log" 2>/dev/null | sort | uniq -c | sort -nr | head
done
```

## 5.3 Real-Time Request Monitoring

Watch requests as they come in:

```bash
# For a specific site
tail -f /var/www/clients/$CLIENT/$SITE_USER/log/access.log

# For Apache global (if configured)
tail -f /var/log/apache2/access.log
```

## 5.4 Identify Attack Patterns

### Count Specific Attack Endpoints

```bash
# Count xmlrpc hits
grep -c "xmlrpc.php" /var/www/clients/$CLIENT/$SITE_USER/log/access.log

# Count login attempts
grep -c "wp-login.php" /var/www/clients/$CLIENT/$SITE_USER/log/access.log

# Count admin-ajax hits
grep -c "admin-ajax.php" /var/www/clients/$CLIENT/$SITE_USER/log/access.log
```

### Find Top Attacking IPs

```bash
# Top IPs hitting xmlrpc
grep "xmlrpc.php" /var/www/clients/$CLIENT/$SITE_USER/log/access.log | \
    awk '{print $1}' | sort | uniq -c | sort -nr | head -20

# Top IPs overall
awk '{print $1}' /var/www/clients/$CLIENT/$SITE_USER/log/access.log | \
    sort | uniq -c | sort -nr | head -20
```

## 5.5 Understanding Load Average

Load average represents the average number of processes waiting to run.

### Interpretation Guide

| Cores | Load 1.0 | Load 2.0 | Load 4.0 |
|-------|----------|----------|----------|
| 1 | 100% utilized | 100% + 1 waiting | 100% + 3 waiting |
| 2 | 50% utilized | 100% utilized | 100% + 2 waiting |
| 4 | 25% utilized | 50% utilized | 100% utilized |

### Check Core Count

```bash
nproc
# or
grep -c ^processor /proc/cpuinfo
```

---

# 6. Disk Space Management

## 6.1 Quick Disk Assessment

### Overall Usage

```bash
df -hT
```

### Inode Usage (Can Fill Even with Space Available)

```bash
df -i
```

## 6.2 Finding Space Hogs

### Top-Level Overview

```bash
du -h / --max-depth=1 2>/dev/null | sort -h
```

### Common Large Directories

```bash
# Check /var (logs, databases, websites)
du -h /var --max-depth=2 2>/dev/null | sort -h

# Check website storage specifically
du -h /var/www/clients --max-depth=3 2>/dev/null | sort -h

# Check logs
du -sh /var/log/*  | sort -h
```

### Find Largest Files System-Wide

```bash
find / -type f -printf '%s %p\n' 2>/dev/null | sort -nr | head -40
```

### Find Large Files in Specific Areas

```bash
# Large files in /var
find /var -type f -size +100M -exec ls -lh {} \; 2>/dev/null | sort -k5 -h

# Large files in website directories
find /var/www -type f -size +100M -exec ls -lh {} \; 2>/dev/null | sort -k5 -h
```

## 6.3 Interactive Disk Usage Tool

The `ncdu` tool provides an interactive, navigable view of disk usage.

### Installation

```bash
apt install -y ncdu
```

### Usage

```bash
# Scan entire system
ncdu /

# Scan specific directory
ncdu /var/www/clients
```

**Navigation:**
- Arrow keys: Navigate
- Enter: Drill into directory
- `d`: Delete selected item (careful!)
- `q`: Quit

## 6.4 Common Disk Space Culprits

### In Website Directories

| Location | Common Issue |
|----------|--------------|
| `wp-content/uploads/` | Media bloat |
| `wp-content/cache/` | Runaway cache |
| `wp-content/ai1wm-backups/` | Old backup plugin files |
| `wp-content/updraft/` | Backup plugin storage |
| Custom `debug.log` files | Unrotated debug logs |
| `tmp/` directories | Temporary file accumulation |

### In System Directories

| Location | Common Issue |
|----------|--------------|
| `/var/log/` | Unrotated logs |
| `/var/log/journal/` | Systemd journal accumulation |
| `/var/lib/mysql/` | Database growth |
| `/var/mail/` | Undelivered email queue |
| `/tmp/` | Temporary files |

## 6.5 Safe Cleanup Procedures

### Rotated Logs (Safe to Remove)

```bash
# View what would be cleaned
ls -lh /var/log/*.gz
ls -lh /var/log/*/*.gz

# Remove old rotated logs
find /var/log -name "*.gz" -mtime +30 -delete
```

### Systemd Journal

```bash
# Check journal size
journalctl --disk-usage

# Retain only last 7 days
journalctl --vacuum-time=7d

# Or limit to specific size
journalctl --vacuum-size=500M
```

### APT Cache

```bash
# View cache size
du -sh /var/cache/apt/archives

# Clean downloaded packages
apt clean
apt autoclean
apt autoremove
```

### WordPress Cache Directories

```bash
# Check cache sizes (run from site docroot)
du -sh wp-content/cache/
du -sh wp-content/*/cache/

# Safe to clear most cache directories
# (plugins will regenerate cache)
```

## 6.6 Emergency Space Recovery

When disk is critically full and services are failing:

### Truncate Large Log Files

```bash
# Find the largest files
find /var -type f -size +500M -exec ls -lh {} \; 2>/dev/null

# Truncate (safer than delete - process can continue writing)
truncate -s 0 /path/to/huge-log-file.log

# Verify space recovered
df -h /
```

### Why Truncate Instead of Delete?

When a process has a file open for writing:
- **Delete:** Process keeps writing to the "deleted" file; space not freed until process restarts
- **Truncate:** File is emptied but remains; process continues normally; space freed immediately

---

# 7. Log Management & Rotation

## 7.1 Default Log Locations

### System Logs

| Log | Location | Contents |
|-----|----------|----------|
| Syslog | `/var/log/syslog` | General system messages |
| Auth log | `/var/log/auth.log` | Authentication attempts |
| Kernel | `/var/log/kern.log` | Kernel messages |
| Mail | `/var/log/mail.log` | Email server logs |
| Fail2Ban | `/var/log/fail2ban.log` | Fail2Ban actions |

### ISPConfig Site Logs

| Log | Path Pattern |
|-----|--------------|
| Access | `/var/www/clients/$CLIENT/$SITE_USER/log/access.log` |
| Error | `/var/www/clients/$CLIENT/$SITE_USER/log/error.log` |

### Service Logs

| Service | Log Location |
|---------|--------------|
| Apache | `/var/log/apache2/error.log`, `/var/log/apache2/access.log` |
| MariaDB | `/var/log/mysql/error.log` |
| PHP-FPM | `/var/log/php*-fpm.log` or via journal |

## 7.2 Viewing Logs

### Tail (Watch Live)

```bash
# Follow a log in real-time
tail -f /var/log/syslog

# Follow multiple logs
tail -f /var/log/apache2/error.log /var/log/php*-fpm.log

# Last N lines
tail -n 100 /var/log/auth.log
```

### Using journalctl

```bash
# Recent entries
journalctl -xe

# Specific service
journalctl -u apache2 --no-pager

# Since boot
journalctl -b

# Time range
journalctl --since "1 hour ago"
journalctl --since "2024-01-01" --until "2024-01-02"
```

### Searching Logs

```bash
# Search for patterns
grep "error" /var/log/syslog | tail -50
grep -i "failed" /var/log/auth.log | tail -50

# Search with context
grep -B2 -A2 "pattern" /var/log/syslog
```

## 7.3 Logrotate Configuration

Logrotate prevents logs from consuming all disk space by rotating, compressing, and removing old log files.

### Global Configuration

```bash
cat /etc/logrotate.conf
```

### Service-Specific Configurations

```bash
ls -la /etc/logrotate.d/
```

### Creating Custom Logrotate Rules

For application-specific logs that aren't covered:

**Example:** WordPress debug log

Create `/etc/logrotate.d/wordpress-debug`:

```
/var/www/clients/*/*/web/wp-content/debug.log {
    size 50M
    rotate 5
    compress
    missingok
    notifempty
    copytruncate
}
```

**Example:** Custom application log

Create `/etc/logrotate.d/custom-app`:

```
/var/www/clients/*/*/web/*/debug.log
/var/www/clients/*/*/web/**/debug.log {
    size 50M
    rotate 10
    compress
    missingok
    notifempty
    copytruncate
    dateext
    dateformat -%Y%m%d
}
```

### Logrotate Options Explained

| Option | Description |
|--------|-------------|
| `size 50M` | Rotate when file exceeds 50MB |
| `daily/weekly/monthly` | Rotation frequency |
| `rotate 5` | Keep 5 rotated files |
| `compress` | Gzip old files |
| `missingok` | Don't error if log missing |
| `notifempty` | Don't rotate empty files |
| `copytruncate` | Truncate original file (for apps that don't handle rotation) |
| `create 640 user group` | Create new file with permissions |
| `dateext` | Add date to rotated filename |

### Test Logrotate Configuration

```bash
# Dry run (shows what would happen)
logrotate -d /etc/logrotate.d/custom-app

# Force rotation
logrotate -f /etc/logrotate.d/custom-app
```

---

# 8. Bot Mitigation & Attack Prevention

## 8.1 Understanding Common WordPress Attacks

### Attack Types and Targets

| Attack Type | Target | Impact |
|-------------|--------|--------|
| XML-RPC Brute Force | `/xmlrpc.php` | High CPU, potential compromise |
| Login Brute Force | `/wp-login.php` | High CPU, potential compromise |
| Pingback DDoS | `/xmlrpc.php` | Amplification attacks |
| REST API Abuse | `/wp-json/` | Information disclosure, spam |
| Plugin Probing | Various plugin paths | Vulnerability exploitation |
| Credential Stuffing | `/wp-login.php` | Account takeover |

### Why These Attacks Hurt Performance

Each request to a PHP endpoint:

1. Apache receives and processes the request
2. PHP-FPM spawns or wakes a worker
3. WordPress bootstraps (loads all plugins, themes, config)
4. Database queries execute
5. Response generates

**Even failed login attempts** consume full application resources.

## 8.2 Defense Layers

Best practice is layered defense:

```
┌─────────────────────────────────────┐
│         CDN/Edge (Cloudflare)       │  ← Block/challenge before reaching origin
├─────────────────────────────────────┤
│         Firewall (iptables/ufw)     │  ← Block known bad IPs
├─────────────────────────────────────┤
│         Fail2Ban                    │  ← Ban repeat offenders
├─────────────────────────────────────┤
│         Web Server (Apache)         │  ← Deny at server level (no PHP)
├─────────────────────────────────────┤
│         Application (WordPress)     │  ← Plugin-level protection
└─────────────────────────────────────┘
```

## 8.3 Apache-Level Blocking

Block known attack endpoints before PHP processes them.

### Block XML-RPC Globally

Create `/etc/apache2/conf-available/block-xmlrpc.conf`:

```apache
<FilesMatch "xmlrpc\.php$">
    Require all denied
</FilesMatch>
```

Enable and reload:

```bash
a2enconf block-xmlrpc
systemctl reload apache2
```

### Block Common Probes

Create `/etc/apache2/conf-available/block-probes.conf`:

```apache
# Block access to sensitive files
<FilesMatch "(^\.env|\.git|\.htaccess|wp-config\.php|readme\.html|license\.txt)$">
    Require all denied
</FilesMatch>

# Block common exploit paths
<DirectoryMatch "/(\.git|\.svn|\.hg|node_modules)/">
    Require all denied
</DirectoryMatch>

# Block installer leftovers
<FilesMatch "(installer\.php|installer-backup\.php|dup-installer)">
    Require all denied
</FilesMatch>
```

Enable:

```bash
a2enconf block-probes
systemctl reload apache2
```

### Verify Blocks Work

```bash
# Test from command line
curl -I https://yourdomain.com/xmlrpc.php
# Should return 403 Forbidden
```

## 8.4 Rate Limiting with mod_evasive

### Installation

```bash
apt install -y libapache2-mod-evasive
```

### Configuration

Create `/etc/apache2/mods-available/evasive.conf`:

```apache
<IfModule mod_evasive20.c>
    DOSHashTableSize    3097
    DOSPageCount        5
    DOSSiteCount        50
    DOSPageInterval     1
    DOSSiteInterval     1
    DOSBlockingPeriod   60
    DOSEmailNotify      admin@yourdomain.com
    DOSLogDir           /var/log/apache2/evasive
</IfModule>
```

Create log directory and enable:

```bash
mkdir -p /var/log/apache2/evasive
chown www-data:www-data /var/log/apache2/evasive
a2enmod evasive
systemctl reload apache2
```

---

# 9. Fail2Ban Configuration

## 9.1 Overview

Fail2Ban monitors log files for patterns indicating malicious activity and temporarily bans offending IP addresses using firewall rules.

## 9.2 Installation and Basic Setup

```bash
apt install -y fail2ban

# Enable and start
systemctl enable --now fail2ban

# Verify running
systemctl status fail2ban
fail2ban-client ping
```

## 9.3 Understanding Fail2Ban Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Filters | `/etc/fail2ban/filter.d/` | Regex patterns to match |
| Jails | `/etc/fail2ban/jail.d/` | Combine filters with actions |
| Actions | `/etc/fail2ban/action.d/` | What to do when triggered |
| Local config | `/etc/fail2ban/jail.local` | Your customizations |

## 9.4 Creating WordPress Filters

### XML-RPC Filter

Create `/etc/fail2ban/filter.d/wordpress-xmlrpc.conf`:

```ini
[Definition]
failregex = ^<HOST> .* "(GET|POST) .*xmlrpc\.php
            ^<HOST> .* "(GET|POST) .*//xmlrpc\.php
ignoreregex =
```

### Login Filter

Create `/etc/fail2ban/filter.d/wordpress-login.conf`:

```ini
[Definition]
failregex = ^<HOST> .* "(GET|POST) .*wp-login\.php
            ^<HOST> .* "(GET|POST) .*//wp-login\.php
ignoreregex =
```

### Admin-Ajax Filter (Optional, Use Carefully)

Create `/etc/fail2ban/filter.d/wordpress-ajax.conf`:

```ini
[Definition]
failregex = ^<HOST> .* "(GET|POST) .*/wp-admin/admin-ajax\.php
ignoreregex =
```

**Warning:** admin-ajax.php is used legitimately by WordPress. Only enable this if you're seeing clear abuse.

## 9.5 Creating WordPress Jails

Create `/etc/fail2ban/jail.d/wordpress.conf`:

```ini
[wordpress-xmlrpc]
enabled   = true
filter    = wordpress-xmlrpc
port      = http,https
logpath   = /var/www/clients/*/*/log/access.log
maxretry  = 5
findtime  = 600
bantime   = 86400

[wordpress-login]
enabled   = true
filter    = wordpress-login
port      = http,https
logpath   = /var/www/clients/*/*/log/access.log
maxretry  = 10
findtime  = 600
bantime   = 21600
```

### Jail Parameters Explained

| Parameter | Description |
|-----------|-------------|
| `enabled` | Activate this jail |
| `filter` | Name of filter file (without .conf) |
| `port` | Ports to block |
| `logpath` | Log file(s) to monitor (glob patterns work) |
| `maxretry` | Failures before ban |
| `findtime` | Time window for counting failures (seconds) |
| `bantime` | How long to ban (seconds). -1 = permanent |

### Recommended Values

| Attack Type | maxretry | findtime | bantime |
|-------------|----------|----------|---------|
| XML-RPC (heavy abuse) | 5 | 600 | 86400 (24h) |
| Login (brute force) | 10 | 600 | 21600 (6h) |
| Probing (reconnaissance) | 3 | 300 | 3600 (1h) |

## 9.6 Applying Configuration

```bash
# Reload Fail2Ban
fail2ban-client reload

# Check active jails
fail2ban-client status

# Check specific jail
fail2ban-client status wordpress-xmlrpc
fail2ban-client status wordpress-login
```

## 9.7 Testing Filters

Before relying on a filter, verify it matches your log format:

```bash
# Test XML-RPC filter against an actual log
fail2ban-regex /var/www/clients/client0/web1/log/access.log \
    /etc/fail2ban/filter.d/wordpress-xmlrpc.conf

# Test login filter
fail2ban-regex /var/www/clients/client0/web1/log/access.log \
    /etc/fail2ban/filter.d/wordpress-login.conf
```

**Output should show matches.** If zero matches, adjust the regex.

## 9.8 Managing Bans

### View Banned IPs

```bash
fail2ban-client status wordpress-xmlrpc
```

### Unban an IP

```bash
fail2ban-client set wordpress-xmlrpc unbanip 192.168.1.100
```

### Unban All

```bash
fail2ban-client unban --all
```

### View All Bans Across Jails

```bash
fail2ban-client banned
```

## 9.9 Whitelist IPs

In `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 YOUR.STATIC.IP.ADDRESS
```

---

# 10. Cloudflare Integration

## 10.1 The Problem: Cloudflare Proxy Masking

When Cloudflare proxies your site, your server sees Cloudflare's IP addresses instead of real visitor IPs. This breaks:

- Fail2Ban (bans Cloudflare instead of attackers)
- Access logs (can't identify real visitors)
- Rate limiting
- Geographic restrictions

## 10.2 Solution: Apache RemoteIP Module

The RemoteIP module extracts the real client IP from Cloudflare's `CF-Connecting-IP` header.

### Installation

```bash
apt install -y libapache2-mod-remoteip
a2enmod remoteip
```

### Configuration

Create `/etc/apache2/conf-available/cloudflare-remoteip.conf`:

```apache
RemoteIPHeader CF-Connecting-IP

# Cloudflare IPv4 Ranges
RemoteIPTrustedProxy 173.245.48.0/20
RemoteIPTrustedProxy 103.21.244.0/22
RemoteIPTrustedProxy 103.22.200.0/22
RemoteIPTrustedProxy 103.31.4.0/22
RemoteIPTrustedProxy 141.101.64.0/18
RemoteIPTrustedProxy 108.162.192.0/18
RemoteIPTrustedProxy 190.93.240.0/20
RemoteIPTrustedProxy 188.114.96.0/20
RemoteIPTrustedProxy 197.234.240.0/22
RemoteIPTrustedProxy 198.41.128.0/17
RemoteIPTrustedProxy 162.158.0.0/15
RemoteIPTrustedProxy 104.16.0.0/13
RemoteIPTrustedProxy 104.24.0.0/14
RemoteIPTrustedProxy 172.64.0.0/13
RemoteIPTrustedProxy 131.0.72.0/22

# Cloudflare IPv6 Ranges
RemoteIPTrustedProxy 2400:cb00::/32
RemoteIPTrustedProxy 2606:4700::/32
RemoteIPTrustedProxy 2803:f800::/32
RemoteIPTrustedProxy 2405:b500::/32
RemoteIPTrustedProxy 2405:8100::/32
RemoteIPTrustedProxy 2a06:98c0::/29
RemoteIPTrustedProxy 2c0f:f248::/32
```

### Enable and Reload

```bash
a2enconf cloudflare-remoteip
systemctl reload apache2
```

### Keep IP Ranges Updated

Cloudflare publishes their IP ranges. Create a script to update:

Create `/usr/local/bin/update-cloudflare-ips.sh`:

```bash
#!/bin/bash
# Update Cloudflare IP ranges for Apache RemoteIP

CONFIG="/etc/apache2/conf-available/cloudflare-remoteip.conf"
TEMP=$(mktemp)

{
    echo "RemoteIPHeader CF-Connecting-IP"
    echo ""
    echo "# Cloudflare IPs - Updated: $(date -u +%Y-%m-%d)"
    echo "# Source: https://www.cloudflare.com/ips/"
    echo ""
    echo "# IPv4"
    curl -s https://www.cloudflare.com/ips-v4 | while read ip; do
        echo "RemoteIPTrustedProxy $ip"
    done
    echo ""
    echo "# IPv6"
    curl -s https://www.cloudflare.com/ips-v6 | while read ip; do
        echo "RemoteIPTrustedProxy $ip"
    done
} > "$TEMP"

if [ -s "$TEMP" ]; then
    mv "$TEMP" "$CONFIG"
    systemctl reload apache2
    echo "Cloudflare IPs updated successfully"
else
    rm "$TEMP"
    echo "Error: Failed to fetch Cloudflare IPs"
    exit 1
fi
```

Make executable and run monthly:

```bash
chmod +x /usr/local/bin/update-cloudflare-ips.sh

# Add to crontab (monthly update)
echo "0 3 1 * * root /usr/local/bin/update-cloudflare-ips.sh" >> /etc/cron.d/cloudflare-ips
```

## 10.3 Verify Real IPs Are Logged

After enabling RemoteIP:

```bash
# Check recent log entries
tail -5 /var/www/clients/client0/web1/log/access.log
```

**You should see real visitor IPs, not Cloudflare IPs (172.64.x.x, 104.16.x.x, etc.)**

If still seeing Cloudflare IPs, check the Apache LogFormat.

## 10.4 Apache LogFormat Adjustment

The log format must use `%a` (client IP after RemoteIP processing) instead of `%h` (raw connection IP).

### Find Current LogFormat

```bash
grep -rn "LogFormat" /etc/apache2/ | grep -v ".dpkg"
```

### Modify if Needed

In your Apache config or ISPConfig vhost template, ensure:

```apache
LogFormat "%a %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
```

**Note:** ISPConfig manages vhost configurations. Check ISPConfig templates if logs aren't showing real IPs.

## 10.5 Cloudflare Firewall Rules (Edge Protection)

Block attacks at Cloudflare before they reach your server:

### Recommended WAF Rules

| Rule | Action | URI/Field |
|------|--------|-----------|
| Block XML-RPC | Block | URI Path equals `/xmlrpc.php` |
| Rate Limit Login | Challenge | URI Path contains `/wp-login.php` |
| Block .env | Block | URI Path contains `.env` |
| Block Installers | Block | URI Path contains `installer` |

### Rate Limiting (Cloudflare Dashboard)

- **Path:** `/wp-login.php`
- **Requests:** 5 per 10 seconds per IP
- **Action:** Challenge or Block

## 10.6 Restore Visitor IPs in Logs (Alternative: mod_cloudflare)

An alternative to RemoteIP is Cloudflare's own module (deprecated but still works):

```bash
# Not recommended - use RemoteIP instead
# Cloudflare module is deprecated
```

**Recommendation:** Use RemoteIP as shown above.

---

# 11. Apache Hardening

## 11.1 Hide Server Information

Edit `/etc/apache2/conf-available/security.conf`:

```apache
# Don't reveal Apache version
ServerTokens Prod
ServerSignature Off

# Disable TRACE method
TraceEnable Off
```

Enable:

```bash
a2enconf security
systemctl reload apache2
```

## 11.2 Disable Directory Listing

In `/etc/apache2/apache2.conf` or per-vhost:

```apache
<Directory /var/www/>
    Options -Indexes +FollowSymLinks
</Directory>
```

## 11.3 Security Headers

Create `/etc/apache2/conf-available/security-headers.conf`:

```apache
<IfModule mod_headers.c>
    # Prevent clickjacking
    Header always set X-Frame-Options "SAMEORIGIN"
    
    # Prevent MIME-type sniffing
    Header always set X-Content-Type-Options "nosniff"
    
    # Enable XSS filter
    Header always set X-XSS-Protection "1; mode=block"
    
    # Referrer policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Permissions policy
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

Enable:

```bash
a2enmod headers
a2enconf security-headers
systemctl reload apache2
```

## 11.4 SSL/TLS Hardening

For sites with SSL (strongly recommended):

Create `/etc/apache2/conf-available/ssl-hardening.conf`:

```apache
<IfModule mod_ssl.c>
    # Modern SSL configuration
    SSLProtocol             all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384
    SSLHonorCipherOrder     off
    SSLSessionTickets       off
    
    # HSTS (be careful - commits you to HTTPS)
    Header always set Strict-Transport-Security "max-age=63072000"
</IfModule>
```

Enable:

```bash
a2enconf ssl-hardening
systemctl reload apache2
```

## 11.5 Limit Request Size

Prevent denial-of-service via large requests:

```apache
# In apache2.conf or vhost
LimitRequestBody 10485760
LimitRequestFields 50
LimitRequestFieldSize 8190
LimitRequestLine 8190
```

## 11.6 Connection and Timeout Tuning

```apache
# Prevent slowloris attacks
Timeout 60
KeepAliveTimeout 5
MaxKeepAliveRequests 100
```

## 11.7 Disable Unnecessary Modules

List enabled modules:

```bash
apache2ctl -M
```

Disable what you don't need:

```bash
# Examples - evaluate each for your environment
a2dismod autoindex    # Directory listings
a2dismod status       # Server status page (or restrict it)
```

---

# 12. PHP-FPM Tuning & Containment

## 12.1 Why PHP-FPM Tuning Matters

Without proper limits, a single attacked or misbehaving site can:

- Spawn unlimited PHP workers
- Exhaust system RAM
- Trigger swap thrashing
- Slow or crash all other sites

## 12.2 Understanding PHP-FPM Pool Configuration

Each ISPConfig site has its own PHP-FPM pool configuration.

### Locate Pool Configs

```bash
# List all pool configs
ls -la /etc/php/*/fpm/pool.d/

# Find config for specific site user
grep -rl "^\[web5\]" /etc/php/*/fpm/pool.d/
```

### Pool Config Structure

Example `/etc/php/8.2/fpm/pool.d/web5.conf`:

```ini
[web5]
user = web5
group = client0

listen = /var/lib/php/sessions/web5.sock
listen.owner = web5
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = 10
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 5
pm.max_requests = 500

request_terminate_timeout = 300

php_admin_value[open_basedir] = /var/www/clients/client0/web5/...
```

## 12.3 Key Settings to Tune

### Process Manager (pm) Types

| Type | Description | Use Case |
|------|-------------|----------|
| `static` | Fixed number of workers | Predictable load |
| `dynamic` | Workers scale between min/max | Most sites (default) |
| `ondemand` | Workers spawn only on request | Low-traffic sites |

### Critical Parameters

| Parameter | Description | Guidance |
|-----------|-------------|----------|
| `pm.max_children` | Maximum concurrent workers | Limit based on RAM |
| `pm.start_servers` | Workers at startup | 2-4 for most sites |
| `pm.min_spare_servers` | Minimum idle workers | 1-2 |
| `pm.max_spare_servers` | Maximum idle workers | 3-5 |
| `pm.max_requests` | Requests before worker recycles | 500 prevents memory leaks |
| `request_terminate_timeout` | Max script runtime | 300s (adjust for long operations) |

### Memory Calculation

Estimate workers based on available RAM:

```
Available RAM / Average PHP worker memory = Max workers across all pools
```

**Example:**
- 4GB RAM, 2GB for system/DB = 2GB for PHP
- Average worker: ~50MB
- Total workers: 2048MB / 50MB = ~40 workers

Distribute across pools based on site priority.

## 12.4 Recommended Pool Settings

### Low-Traffic Site

```ini
pm = ondemand
pm.max_children = 5
pm.process_idle_timeout = 10s
pm.max_requests = 500
request_terminate_timeout = 120
```

### Medium-Traffic Site

```ini
pm = dynamic
pm.max_children = 10
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 5
pm.max_requests = 500
request_terminate_timeout = 300
```

### High-Traffic Site

```ini
pm = dynamic
pm.max_children = 20
pm.start_servers = 5
pm.min_spare_servers = 3
pm.max_spare_servers = 10
pm.max_requests = 1000
request_terminate_timeout = 300
```

## 12.5 Applying Changes

After modifying pool configurations:

```bash
# Test configuration
php-fpm8.2 -t

# Restart PHP-FPM
systemctl restart php8.2-fpm

# Or restart all PHP-FPM versions
systemctl restart php*-fpm
```

## 12.6 Monitoring PHP-FPM

### Check Pool Status

Enable status page in pool config:

```ini
pm.status_path = /status
```

Then in Apache vhost:

```apache
<LocationMatch "/status">
    Require ip 127.0.0.1
    ProxyPass "unix:/var/lib/php/sessions/web5.sock|fcgi://localhost/status"
</LocationMatch>
```

### View Active Workers

```bash
# All PHP-FPM processes
ps aux | grep php-fpm

# By pool
ps -eo user,pid,pcpu,pmem,cmd | grep "php-fpm: pool"

# Count by pool
ps aux | grep "php-fpm" | grep "pool " | awk '{print $NF}' | sort | uniq -c
```

## 12.7 Slow Log for Diagnostics

Enable slow logging to identify problematic scripts:

In pool config:

```ini
slowlog = /var/log/php/$pool.slow.log
request_slowlog_timeout = 5s
```

Create log directory:

```bash
mkdir -p /var/log/php
chown www-data:www-data /var/log/php
```

Review slow scripts:

```bash
tail -f /var/log/php/*.slow.log
```

---

# 13. WordPress Security Hardening

## 13.1 wp-config.php Security Settings

Add these to each site's `wp-config.php`:

```php
// Disable file editing in admin
define('DISALLOW_FILE_EDIT', true);

// Disable plugin/theme installation
// define('DISALLOW_FILE_MODS', true);  // Uncomment if desired

// Disable debug logging in production
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// Security keys (generate unique keys at: https://api.wordpress.org/secret-key/1.1/salt/)
// ... keys here ...

// Force SSL admin
define('FORCE_SSL_ADMIN', true);

// Limit revisions
define('WP_POST_REVISIONS', 5);

// Empty trash more frequently
define('EMPTY_TRASH_DAYS', 7);

// Disable WordPress auto-updates (manage manually)
// define('WP_AUTO_UPDATE_CORE', false);
```

## 13.2 File Permissions

### Recommended Permissions

```bash
# Navigate to site docroot
cd /var/www/clients/$CLIENT/$SITE_USER/web/

# Directories: 755
find . -type d -exec chmod 755 {} \;

# Files: 644
find . -type f -exec chmod 644 {} \;

# wp-config.php: More restrictive
chmod 640 wp-config.php

# Make wp-content/uploads writable
chmod 775 wp-content/uploads
```

### Ownership

Files should be owned by the site user:

```bash
chown -R $SITE_USER:$CLIENT /var/www/clients/$CLIENT/$SITE_USER/web/
```

## 13.3 .htaccess Hardening

Add to document root `.htaccess`:

```apache
# Protect wp-config.php
<files wp-config.php>
    order allow,deny
    deny from all
</files>

# Protect .htaccess
<files .htaccess>
    order allow,deny
    deny from all
</files>

# Block PHP execution in uploads
<Directory "/wp-content/uploads/">
    <Files "*.php">
        Order Deny,Allow
        Deny from all
    </Files>
</Directory>

# Block access to sensitive files
<FilesMatch "(^#.*#|\.(bak|config|dist|fla|inc|ini|log|psd|sh|sql|sw[op])|~)$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

## 13.4 Disable XML-RPC (Per-Site Alternative)

If you can't block globally, add to site `.htaccess`:

```apache
# Block XML-RPC
<Files xmlrpc.php>
    Order Deny,Allow
    Deny from all
    # Allow specific IPs if needed:
    # Allow from 192.168.1.100
</Files>
```

## 13.5 Protect wp-login.php

```apache
# Limit login access by IP (if you have static IP)
<Files wp-login.php>
    Order Deny,Allow
    Deny from all
    Allow from YOUR.IP.ADDRESS.HERE
</Files>

# Or add basic auth
<Files wp-login.php>
    AuthType Basic
    AuthName "Restricted Access"
    AuthUserFile /path/to/.htpasswd
    Require valid-user
</Files>
```

Generate `.htpasswd`:

```bash
htpasswd -c /var/www/clients/$CLIENT/$SITE_USER/.htpasswd username
```

## 13.6 Security Plugins (Recommendations)

| Plugin | Purpose |
|--------|---------|
| Wordfence | Firewall, malware scanning |
| Sucuri Security | Hardening, monitoring |
| iThemes Security | Hardening, 2FA |
| Limit Login Attempts | Brute force protection |

**Note:** Some plugins overlap with server-level protections. Don't double-up unnecessarily.

## 13.7 Regular Maintenance

### Update Schedule

```bash
# Check for WordPress core updates
wp core check-update --path=/var/www/clients/$CLIENT/$SITE_USER/web/

# Update core (backup first!)
wp core update --path=/var/www/clients/$CLIENT/$SITE_USER/web/

# Update plugins
wp plugin update --all --path=/var/www/clients/$CLIENT/$SITE_USER/web/

# Update themes
wp theme update --all --path=/var/www/clients/$CLIENT/$SITE_USER/web/
```

### WP-CLI Installation

```bash
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /usr/local/bin/wp
```

---

# 14. Database Monitoring & Optimization

## 14.1 Check Database Status

### Connection Status

```bash
mysql -e "SHOW STATUS LIKE 'Threads_connected';"
mysql -e "SHOW STATUS LIKE 'Max_used_connections';"
```

### Active Queries

```bash
mysql -e "SHOW FULL PROCESSLIST;"
```

**Look for:**
- Long-running queries (Time > 10s)
- Many connections from same database user
- `Locked` or `Waiting` states

## 14.2 Identify Slow Queries

### Enable Slow Query Log

In `/etc/mysql/mariadb.conf.d/50-server.cnf`:

```ini
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
log_queries_not_using_indexes = 1
```

Restart MariaDB:

```bash
systemctl restart mariadb
```

### Review Slow Queries

```bash
tail -100 /var/log/mysql/slow.log
```

### Use mysqldumpslow

```bash
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

## 14.3 Database Size Check

### Per-Database Size

```bash
mysql -e "
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema
ORDER BY SUM(data_length + index_length) DESC;"
```

### Large Tables

```bash
mysql -e "
SELECT 
    table_schema,
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
ORDER BY (data_length + index_length) DESC
LIMIT 20;"
```

## 14.4 Optimization

### Optimize Tables

```bash
# Single database
mysqlcheck -o database_name

# All databases
mysqlcheck -o --all-databases
```

### WordPress-Specific: Clean Revisions

```bash
wp post delete $(wp post list --post_type='revision' --format=ids) \
    --path=/var/www/clients/$CLIENT/$SITE_USER/web/
```

### WordPress-Specific: Clean Transients

```bash
wp transient delete --expired --path=/var/www/clients/$CLIENT/$SITE_USER/web/
wp transient delete --all --path=/var/www/clients/$CLIENT/$SITE_USER/web/
```

## 14.5 MariaDB/MySQL Tuning

### Key Parameters

In `/etc/mysql/mariadb.conf.d/50-server.cnf`:

```ini
[mysqld]
# Memory allocation (adjust based on RAM)
innodb_buffer_pool_size = 512M
key_buffer_size = 128M
max_connections = 100

# Query cache (deprecated in MySQL 8, still in MariaDB)
query_cache_type = 1
query_cache_size = 64M
query_cache_limit = 2M

# Temp tables
tmp_table_size = 64M
max_heap_table_size = 64M

# Connection handling
wait_timeout = 300
interactive_timeout = 300
```

---

# 15. SSH & Access Hardening

## 15.1 SSH Configuration

Edit `/etc/ssh/sshd_config`:

```bash
# Disable root login
PermitRootLogin no

# Disable password authentication (use keys only)
PasswordAuthentication no
PubkeyAuthentication yes

# Restrict to specific users
AllowUsers youradminuser

# Disable empty passwords
PermitEmptyPasswords no

# Limit authentication attempts
MaxAuthTries 3

# Idle timeout
ClientAliveInterval 300
ClientAliveCountMax 2

# Disable X11 forwarding (unless needed)
X11Forwarding no

# Use strong ciphers
Ciphers aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com

# Change port (optional, security through obscurity)
# Port 2222
```

### Apply Changes

```bash
# Test configuration
sshd -t

# Restart SSH
systemctl restart sshd
```

**Warning:** Before disabling password auth, ensure your SSH key works!

## 15.2 SSH Key Setup

### Generate Key (On Your Local Machine)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Copy Key to Server

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
```

### Verify Key Login

```bash
ssh user@server
```

## 15.3 Fail2Ban for SSH

SSH jail is usually enabled by default. Verify:

```bash
fail2ban-client status sshd
```

## 15.4 Create Admin User (If Only Root Exists)

```bash
# Create user
adduser adminuser

# Add to sudo group
usermod -aG sudo adminuser

# Copy SSH key
mkdir -p /home/adminuser/.ssh
cp /root/.ssh/authorized_keys /home/adminuser/.ssh/
chown -R adminuser:adminuser /home/adminuser/.ssh
chmod 700 /home/adminuser/.ssh
chmod 600 /home/adminuser/.ssh/authorized_keys
```

---

# 16. Firewall Configuration

## 16.1 UFW (Uncomplicated Firewall)

### Installation and Basic Setup

```bash
apt install -y ufw

# Set defaults
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (critical - do this before enabling!)
ufw allow ssh
# Or specific port:
# ufw allow 22/tcp

# Allow HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status verbose
```

### Common Rules

```bash
# Allow ISPConfig admin (8080)
ufw allow 8080/tcp

# Allow FTP (if needed)
ufw allow 20/tcp
ufw allow 21/tcp

# Allow from specific IP only
ufw allow from 192.168.1.100 to any port 22

# Delete a rule
ufw delete allow 8080/tcp
```

### Rate Limiting

```bash
# Limit SSH connections (6 connections per 30 seconds per IP)
ufw limit ssh
```

## 16.2 Restrict Origin to Cloudflare Only

If using Cloudflare, you can restrict HTTP/HTTPS to Cloudflare IPs only:

```bash
# Reset HTTP/HTTPS rules
ufw delete allow 80/tcp
ufw delete allow 443/tcp

# Allow only Cloudflare IPs (add all Cloudflare ranges)
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    ufw allow from $ip to any port 80,443 proto tcp
done
```

**Warning:** This prevents direct access - only Cloudflare-proxied requests will work.

## 16.3 iptables (Direct)

For more control than UFW:

### View Current Rules

```bash
iptables -L -n -v
```

### Basic Protection

```bash
# Allow established connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT

# Allow SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Drop everything else
iptables -A INPUT -j DROP
```

### Save Rules

```bash
apt install -y iptables-persistent
netfilter-persistent save
```

---

# 17. Automatic Security Updates

## 17.1 Unattended Upgrades

### Installation

```bash
apt install -y unattended-upgrades apt-listchanges
```

### Configuration

Edit `/etc/apt/apt.conf.d/50unattended-upgrades`:

```
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}:${distro_codename}-updates";
};

// Email notifications
Unattended-Upgrade::Mail "admin@yourdomain.com";

// Remove unused dependencies
Unattended-Upgrade::Remove-Unused-Dependencies "true";

// Automatic reboot (careful in production!)
// Unattended-Upgrade::Automatic-Reboot "true";
// Unattended-Upgrade::Automatic-Reboot-Time "03:00";
```

### Enable Auto-Upgrades

Create/edit `/etc/apt/apt.conf.d/20auto-upgrades`:

```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
```

### Test

```bash
# Dry run
unattended-upgrade --dry-run --debug
```

### View Logs

```bash
cat /var/log/unattended-upgrades/unattended-upgrades.log
```

## 17.2 Manual Update Schedule

If you prefer manual control:

```bash
# Weekly update script
cat > /usr/local/bin/weekly-updates.sh << 'EOF'
#!/bin/bash
apt update
apt upgrade -y
apt autoremove -y
apt clean
EOF

chmod +x /usr/local/bin/weekly-updates.sh

# Add to crontab (Sunday 3 AM)
echo "0 3 * * 0 root /usr/local/bin/weekly-updates.sh >> /var/log/weekly-updates.log 2>&1" >> /etc/cron.d/weekly-updates
```

---

# 18. Backup Strategy

## 18.1 The 3-2-1 Rule

- **3** copies of data
- **2** different storage types
- **1** offsite location

## 18.2 What to Back Up

| Data | Location | Frequency |
|------|----------|-----------|
| Databases | MariaDB/MySQL | Daily |
| Website files | `/var/www/clients/` | Daily/Weekly |
| ISPConfig config | `/usr/local/ispconfig/`, database | Weekly |
| SSL certificates | `/var/www/clients/*/ssl/` | Weekly |
| Server configs | `/etc/` | After changes |

## 18.3 Database Backup Script

Create `/usr/local/bin/backup-databases.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/srv/backups/databases"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

mkdir -p "$BACKUP_DIR"

# Backup all databases
for db in $(mysql -N -e "SHOW DATABASES;" | grep -Ev "(information_schema|performance_schema|sys)"); do
    mysqldump --single-transaction --routines --triggers "$db" | gzip > "$BACKUP_DIR/${db}_${DATE}.sql.gz"
    echo "Backed up: $db"
done

# Remove old backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Removed backups older than $RETENTION_DAYS days"
```

Make executable and schedule:

```bash
chmod +x /usr/local/bin/backup-databases.sh

# Daily at 2 AM
echo "0 2 * * * root /usr/local/bin/backup-databases.sh >> /var/log/backup-db.log 2>&1" >> /etc/cron.d/database-backup
```

## 18.4 Website Files Backup

Using rsync to local backup location:

```bash
#!/bin/bash
BACKUP_DIR="/srv/backups/websites"
DATE=$(date +%Y%m%d)
SOURCE="/var/www/clients/"

mkdir -p "$BACKUP_DIR"

rsync -avz --delete "$SOURCE" "$BACKUP_DIR/websites_$DATE/"

# Keep only last 7 days
find "$BACKUP_DIR" -maxdepth 1 -type d -name "websites_*" -mtime +7 -exec rm -rf {} \;
```

## 18.5 Offsite Backup with Restic

### Install Restic

```bash
apt install -y restic
```

### Initialize Repository (Example: S3)

```bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"

restic init --repo s3:s3.amazonaws.com/bucket-name
```

### Backup Script

```bash
#!/bin/bash
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export RESTIC_REPOSITORY="s3:s3.amazonaws.com/bucket-name"
export RESTIC_PASSWORD="your-restic-password"

# Backup databases
restic backup /srv/backups/databases/

# Backup websites
restic backup /var/www/clients/

# Cleanup old snapshots
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 3
restic prune
```

## 18.6 ISPConfig Backup

ISPConfig has built-in backup functionality. Additionally:

```bash
# Backup ISPConfig database
mysqldump dbispconfig | gzip > /srv/backups/ispconfig/dbispconfig_$(date +%Y%m%d).sql.gz

# Backup ISPConfig files
tar -czf /srv/backups/ispconfig/ispconfig_files_$(date +%Y%m%d).tar.gz /usr/local/ispconfig/
```

## 18.7 Test Restores

**Backups are worthless until tested.**

Monthly, practice restoring:

1. A database to a test environment
2. Website files
3. Full server recovery procedure

Document the restore process!

---

# 19. Malware Detection & Response

## 19.1 Signs of Compromise

| Indicator | What to Check |
|-----------|---------------|
| Unknown processes | `ps aux` |
| Strange cron jobs | `crontab -l`, `/etc/cron.d/` |
| Unusual network connections | `netstat -tlnp` |
| Modified system files | `debsums -c` |
| Unexplained CPU/RAM usage | `top`, `htop` |
| New user accounts | `/etc/passwd` |
| Log anomalies | `/var/log/auth.log` |

## 19.2 Quick Malware Scan Commands

### Find Recently Modified PHP Files

```bash
# Last 7 days
find /var/www/clients/$CLIENT/$SITE_USER/web -type f -name "*.php" -mtime -7 -ls

# Last 24 hours
find /var/www/clients/$CLIENT/$SITE_USER/web -type f -name "*.php" -mtime -1 -ls
```

### Search for Common Malware Patterns

```bash
grep -rIn --include="*.php" \
    "base64_decode\|eval(\|gzinflate\|shell_exec\|system(\|passthru\|exec(" \
    /var/www/clients/$CLIENT/$SITE_USER/web/wp-content/ 2>/dev/null | head -50
```

### Find Files with Suspicious Names

```bash
find /var/www/clients/$CLIENT/$SITE_USER/web -type f \
    \( -name "*.php.suspected" -o -name "*.php.bak" -o -name "*.php.old" \
    -o -name "wp-*.php" -o -name "*.ico.php" \) -ls
```

### Check for Hidden Files

```bash
find /var/www/clients/$CLIENT/$SITE_USER/web -name ".*" -type f -ls
```

### Check for PHP in Uploads

```bash
find /var/www/clients/$CLIENT/$SITE_USER/web/wp-content/uploads -name "*.php" -ls
```

## 19.3 Using ClamAV

### Installation

```bash
apt install -y clamav clamav-daemon

# Update signatures
freshclam

# Start daemon
systemctl start clamav-daemon
```

### Scan Website Directory

```bash
clamscan -r --infected /var/www/clients/$CLIENT/$SITE_USER/web/
```

### Scheduled Scans

```bash
# Weekly full scan
echo "0 4 * * 0 root clamscan -r --infected --log=/var/log/clamav/weekly-scan.log /var/www/" >> /etc/cron.d/clamav-weekly
```

## 19.4 Response Procedure

### If Compromise Confirmed

1. **Document everything** before making changes
   ```bash
   # Snapshot current state
   tar -czf /root/incident-$(date +%Y%m%d).tar.gz /var/www/clients/$CLIENT/$SITE_USER/
   ```

2. **Isolate the site**
   ```bash
   # Disable site temporarily
   # In Apache vhost, add:
   # Require all denied
   systemctl reload apache2
   ```

3. **Identify scope**
   - Check other sites on the same server
   - Review access logs for attack vectors
   - Check for persistence mechanisms (cron, users)

4. **Clean up**
   - Remove malicious files
   - OR restore from known-good backup

5. **Patch vulnerability**
   - Update WordPress core, plugins, themes
   - Change all passwords
   - Check file permissions

6. **Monitor**
   - Watch logs for continued attempts
   - Set up alerts

### Change All Passwords

```bash
# WordPress admin password
wp user update admin --user_pass=NewSecurePassword --path=/path/to/wordpress

# Database user
mysql -e "ALTER USER 'dbuser'@'localhost' IDENTIFIED BY 'NewSecurePassword';"
# Update wp-config.php accordingly

# FTP/SFTP passwords through ISPConfig
```

---

# 20. Performance Optimization

## 20.1 OpCache Configuration

PHP OpCache dramatically improves performance by caching compiled PHP.

### Verify OpCache is Enabled

```bash
php -m | grep -i opcache
```

### Recommended Settings

Edit PHP configuration (e.g., `/etc/php/8.2/fpm/conf.d/10-opcache.ini`):

```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2
opcache.save_comments=1
opcache.enable_file_override=1
```

### Monitor OpCache

```php
<?php
// Create opcache-status.php (restrict access!)
print_r(opcache_get_status());
```

## 20.2 Redis Object Caching

### Installation

```bash
apt install -y redis-server php-redis
```

### Configure Redis

Edit `/etc/redis/redis.conf`:

```ini
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### Enable and Start

```bash
systemctl enable --now redis-server
```

### WordPress Integration

Install a Redis object cache plugin (e.g., Redis Object Cache) and configure `wp-config.php`:

```php
define('WP_REDIS_HOST', '127.0.0.1');
define('WP_REDIS_PORT', 6379);
define('WP_REDIS_DATABASE', 0);
```

## 20.3 Apache Performance

### Enable Key Modules

```bash
a2enmod deflate   # Compression
a2enmod expires   # Browser caching headers
a2enmod http2     # HTTP/2 support
```

### Compression

Create `/etc/apache2/conf-available/compression.conf`:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css
    AddOutputFilterByType DEFLATE text/javascript application/javascript application/x-javascript
    AddOutputFilterByType DEFLATE application/json application/xml application/xhtml+xml
</IfModule>
```

### Browser Caching

Create `/etc/apache2/conf-available/expires.conf`:

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

Enable:

```bash
a2enconf compression expires
systemctl reload apache2
```

## 20.4 MySQL/MariaDB Performance

### Key Buffer and Cache Settings

See Section 14.5 for detailed MariaDB tuning.

### Quick Performance Check

```bash
# Show key metrics
mysql -e "SHOW GLOBAL STATUS LIKE 'Threads_%';"
mysql -e "SHOW GLOBAL STATUS LIKE 'Connections';"
mysql -e "SHOW GLOBAL STATUS LIKE 'Slow_queries';"
```

---

# 21. Monitoring & Alerting

## 21.1 Simple Monitoring Script

Create `/usr/local/bin/server-health-check.sh`:

```bash
#!/bin/bash
# Server Health Check Script

ALERT_EMAIL="admin@yourdomain.com"
HOSTNAME=$(hostname)

# Thresholds
DISK_THRESHOLD=85
LOAD_THRESHOLD=$(nproc)
SWAP_THRESHOLD=50

# Check disk usage
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt "$DISK_THRESHOLD" ]; then
    echo "ALERT: Disk usage at ${DISK_USAGE}% on $HOSTNAME" | \
        mail -s "Disk Alert: $HOSTNAME" "$ALERT_EMAIL"
fi

# Check load average
LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk -F',' '{print $1}' | xargs)
LOAD_INT=${LOAD%.*}
if [ "$LOAD_INT" -gt "$LOAD_THRESHOLD" ]; then
    echo "ALERT: Load average at $LOAD on $HOSTNAME" | \
        mail -s "Load Alert: $HOSTNAME" "$ALERT_EMAIL"
fi

# Check swap usage
SWAP_TOTAL=$(free | awk '/Swap/ {print $2}')
SWAP_USED=$(free | awk '/Swap/ {print $3}')
if [ "$SWAP_TOTAL" -gt 0 ]; then
    SWAP_PERCENT=$((SWAP_USED * 100 / SWAP_TOTAL))
    if [ "$SWAP_PERCENT" -gt "$SWAP_THRESHOLD" ]; then
        echo "ALERT: Swap usage at ${SWAP_PERCENT}% on $HOSTNAME" | \
            mail -s "Swap Alert: $HOSTNAME" "$ALERT_EMAIL"
    fi
fi

# Check failed services
FAILED=$(systemctl --failed --no-legend | wc -l)
if [ "$FAILED" -gt 0 ]; then
    echo "ALERT: $FAILED failed services on $HOSTNAME" | \
        mail -s "Service Alert: $HOSTNAME" "$ALERT_EMAIL"
fi
```

Schedule to run every 5 minutes:

```bash
chmod +x /usr/local/bin/server-health-check.sh
echo "*/5 * * * * root /usr/local/bin/server-health-check.sh" >> /etc/cron.d/health-check
```

## 21.2 Uptime Monitoring with Uptime Kuma

Self-hosted uptime monitoring:

### Install with Docker

```bash
docker run -d \
    --name uptime-kuma \
    -p 3001:3001 \
    -v uptime-kuma:/app/data \
    --restart unless-stopped \
    louislam/uptime-kuma:1
```

Access at `http://server-ip:3001`

## 21.3 External Monitoring Services

Consider external services for independent verification:

- UptimeRobot (free tier available)
- Pingdom
- StatusCake
- Better Uptime

These alert you even if your server is completely down.

---

# 22. Maintenance Procedures

## 22.1 Pre-Maintenance Checklist

Before any significant changes:

- [ ] Full backup completed
- [ ] Maintenance window communicated
- [ ] SSH access verified
- [ ] Console access available (if remote SSH fails)
- [ ] Rollback plan documented

## 22.2 Safe Reboot Procedure

```bash
# Check for pending updates
apt update
apt list --upgradable

# Check disk space
df -h

# Check for active swapping
vmstat 1 5

# Check load
uptime

# Check running jobs
ps aux | grep -E "(mysql|backup|rsync)"

# Notify users if applicable
# ...

# Reboot
reboot
```

### Post-Reboot Verification

```bash
# Check services
systemctl --failed

# Check websites (sample curl)
curl -Is https://yoursite.com | head -5

# Check logs for errors
journalctl -p err -b

# Verify resource levels
uptime
free -h
df -h
```

## 22.3 Update Procedure

### Debian System Updates

```bash
# Preview updates
apt update
apt list --upgradable

# Apply updates (non-interactive)
apt upgrade -y

# If kernel updated, schedule reboot

# Clean up
apt autoremove -y
apt clean
```

### PHP Updates

When PHP version changes:

```bash
# Check which PHP version is active
php -v

# List installed PHP packages
dpkg -l | grep php

# After PHP upgrade, restart PHP-FPM
systemctl restart php*-fpm

# Verify sites work
```

### ISPConfig Updates

Follow ISPConfig official update guide for your version.

## 22.4 Log Rotation Verification

```bash
# Force log rotation to test
logrotate -f /etc/logrotate.conf

# Check for errors
cat /var/lib/logrotate/status
```

---

# 23. Troubleshooting Decision Trees

## 23.1 High Load Troubleshooting

```
High Load Detected
├── Check what's consuming CPU
│   └── ps -eo user,pcpu,cmd --sort=-pcpu | head -20
│
├── Is it PHP-FPM?
│   ├── YES → Identify which pool
│   │   ├── Map pool to site: getent passwd webX
│   │   ├── Check site access logs for attack patterns
│   │   ├── Block attacking IPs / endpoints
│   │   └── Consider reducing pm.max_children
│   │
│   └── NO → Check other processes
│       ├── MySQL? → Check SHOW PROCESSLIST for slow queries
│       ├── ClamAV? → Scanning activity, wait or adjust schedule
│       └── Unknown? → Investigate process, possibly kill
│
├── Is memory exhausted?
│   ├── YES → free -h shows high usage
│   │   ├── Reduce PHP workers
│   │   ├── Check for memory leaks
│   │   └── Consider more RAM
│   │
│   └── Swap active? (vmstat si/so non-zero)
│       └── Reduce load or add RAM
│
└── Immediate relief
    ├── Block XML-RPC: a2enconf block-xmlrpc
    ├── Restart PHP-FPM: systemctl restart php*-fpm
    └── If necessary: reboot
```

## 23.2 Website Not Loading

```
Website Not Loading
├── Is the server reachable?
│   └── ping server-ip
│
├── Is SSH working?
│   └── ssh user@server
│
├── Is Apache running?
│   ├── NO → systemctl start apache2
│   └── YES → Check error logs
│
├── Is PHP-FPM running?
│   ├── NO → systemctl start php*-fpm
│   └── YES → Check PHP error logs
│
├── Is MySQL running?
│   ├── NO → systemctl start mariadb
│   └── YES → Check database connectivity
│
├── Check site-specific logs
│   └── tail -50 /var/www/clients/$CLIENT/$SITE_USER/log/error.log
│
├── Is disk full?
│   └── df -h /
│       └── YES → Emergency cleanup
│
├── Is it a Cloudflare issue?
│   ├── Test direct to origin IP
│   └── Check Cloudflare status page
│
└── Is it DNS?
    └── dig yourdomain.com
```

## 23.3 Disk Space Emergency

```
Disk > 90% Full
├── Identify biggest offenders
│   └── du -h / --max-depth=1 | sort -h
│
├── Common culprits
│   ├── /var/log/ → Rotate/clean old logs
│   │   └── find /var/log -name "*.gz" -mtime +30 -delete
│   │
│   ├── /var/www/ → Check for huge debug logs, backup files
│   │   └── find /var/www -size +500M -ls
│   │
│   ├── /var/lib/mysql/ → Database growth
│   │   └── May need to optimize or archive
│   │
│   └── /tmp/ → Clear temporary files
│       └── find /tmp -type f -mtime +7 -delete
│
├── Truncate large log files (don't delete)
│   └── truncate -s 0 /path/to/huge.log
│
├── Clean apt cache
│   └── apt clean
│
└── Verify space recovered
    └── df -h /
```

---

# 24. Quick Reference Commands

## 24.1 System Health

```bash
# Full health snapshot
uptime && free -h && df -hT

# Top CPU consumers
ps -eo user,pid,pcpu,pmem,cmd --sort=-pcpu | head -15

# Top RAM consumers
ps -eo user,pid,pcpu,pmem,cmd --sort=-pmem | head -15

# Active swapping check
vmstat 1 5

# Service status
systemctl --failed
```

## 24.2 Site Identification

```bash
# Map webX user to directory
getent passwd $SITE_USER

# List all sites
ls -la /var/www/clients/*/

# Find site by domain (in ISPConfig DB)
mysql dbispconfig -e "SELECT domain, system_user, document_root FROM web_domain WHERE domain LIKE '%example%';"
```

## 24.3 Log Analysis

```bash
# Top requested URLs for a site
awk '{print $7}' $ACCESS_LOG | sort | uniq -c | sort -nr | head -30

# Top IPs
awk '{print $1}' $ACCESS_LOG | sort | uniq -c | sort -nr | head -20

# Count specific endpoint hits
grep -c "xmlrpc.php" $ACCESS_LOG
grep -c "wp-login.php" $ACCESS_LOG

# Live log watching
tail -f $ACCESS_LOG
```

## 24.4 Disk Analysis

```bash
# Overview
df -hT

# Top directories
du -h / --max-depth=1 2>/dev/null | sort -h

# Website storage
du -h /var/www/clients --max-depth=3 2>/dev/null | sort -h

# Large files
find /var -type f -size +100M -ls 2>/dev/null | sort -k7 -n

# Interactive
ncdu /
```

## 24.5 Security Commands

```bash
# Fail2Ban status
fail2ban-client status
fail2ban-client status $JAIL_NAME

# Unban IP
fail2ban-client set $JAIL_NAME unbanip $IP_ADDRESS

# Auth log review
tail -100 /var/log/auth.log | grep -i fail

# Check listening ports
ss -tlnp
```

## 24.6 Service Management

```bash
# Apache
systemctl status apache2
systemctl reload apache2
systemctl restart apache2
apache2ctl configtest

# PHP-FPM
systemctl status php*-fpm
systemctl restart php*-fpm
php-fpm8.2 -t

# MariaDB
systemctl status mariadb
systemctl restart mariadb

# Fail2Ban
systemctl status fail2ban
fail2ban-client reload
```

---

# 25. New Server Build Checklist

## 25.1 Initial Setup

- [ ] Update system packages
  ```bash
  apt update && apt upgrade -y
  ```

- [ ] Set timezone
  ```bash
  timedatectl set-timezone UTC
  ```

- [ ] Set hostname
  ```bash
  hostnamectl set-hostname servername
  ```

- [ ] Create admin user (if only root)
  ```bash
  adduser adminuser
  usermod -aG sudo adminuser
  ```

- [ ] Configure SSH keys
  ```bash
  # Copy key to new user
  ```

- [ ] Harden SSH (see Section 15)

## 25.2 Security Baseline

- [ ] Install and configure UFW
  ```bash
  apt install ufw
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow ssh
  ufw enable
  ```

- [ ] Install and configure Fail2Ban
  ```bash
  apt install fail2ban
  systemctl enable --now fail2ban
  ```

- [ ] Configure automatic security updates
  ```bash
  apt install unattended-upgrades
  ```

## 25.3 Monitoring Foundation

- [ ] Install sysstat
  ```bash
  apt install sysstat
  systemctl enable --now sysstat
  ```

- [ ] Install diagnostic tools
  ```bash
  apt install htop iotop ncdu curl wget git vim
  ```

## 25.4 ISPConfig Specific

- [ ] Install ISPConfig per official guide

- [ ] Configure Apache RemoteIP for Cloudflare

- [ ] Set up WordPress Fail2Ban jails

- [ ] Configure logrotate for site logs

- [ ] Block XML-RPC in Apache

## 25.5 Backup Setup

- [ ] Create backup directories
  ```bash
  mkdir -p /srv/backups/{databases,websites,configs}
  ```

- [ ] Configure database backup script

- [ ] Configure file backup script

- [ ] Set up offsite backup (restic/borg)

- [ ] Test restore procedure

## 25.6 Documentation

- [ ] Document server purpose

- [ ] Document installed services

- [ ] Document backup locations

- [ ] Document emergency contacts

- [ ] Document recovery procedures

---

# 26. Safety Rules & Best Practices

## 26.1 Never Delete Without Understanding

**Dangerous locations (avoid deleting):**

- `/var/lib/mysql/` - Database files
- `/usr/` and `/lib/` - System binaries and libraries
- `/etc/` - System configuration
- `wp-config.php` - WordPress configuration (unless intentional)
- Any file you don't recognize

**Generally safe cleanup targets (verify first):**

- `wp-content/cache/` - Plugin caches
- `wp-content/ai1wm-backups/` - Backup plugin files you've confirmed backed up elsewhere
- `/var/log/*.gz` - Old rotated logs
- `/tmp/` files older than 7 days
- Debug logs (truncate rather than delete)

## 26.2 Firewall Safety

- **Never flush firewall rules remotely** unless you have console access
- **Always allow SSH before enabling firewall**
- **Test rules carefully** - lock yourself out is common mistake
- **Prefer Fail2Ban unban** over iptables manipulation

## 26.3 Service Restart Hierarchy

When troubleshooting, restart in this order (least disruptive first):

1. Reload configuration (no service interruption)
   ```bash
   systemctl reload apache2
   ```

2. Restart specific service
   ```bash
   systemctl restart apache2
   ```

3. Restart PHP-FPM (may briefly interrupt PHP)
   ```bash
   systemctl restart php*-fpm
   ```

4. Reboot (last resort, planned window)
   ```bash
   reboot
   ```

## 26.4 Change Management

- **One change at a time** - easier to identify what broke
- **Test after each change** - don't stack changes
- **Document what you change** - your future self will thank you
- **Have rollback plan** - know how to undo

## 26.5 Backup Before Changes

Before significant changes:

```bash
# Quick config backup
tar -czf /root/pre-change-$(date +%Y%m%d-%H%M).tar.gz /etc/apache2/ /etc/php/

# Database backup
mysqldump dbname > /root/dbname-$(date +%Y%m%d).sql
```

## 26.6 Monitor After Changes

After making changes, watch for:

```bash
# Watch logs for errors
tail -f /var/log/apache2/error.log

# Monitor load
watch -n 5 uptime

# Check service status
systemctl status apache2 php*-fpm mariadb
```

---

# Appendix A: Important File Locations

| Purpose | Location |
|---------|----------|
| Apache main config | `/etc/apache2/apache2.conf` |
| Apache sites | `/etc/apache2/sites-available/` |
| Apache modules | `/etc/apache2/mods-available/` |
| Apache additional configs | `/etc/apache2/conf-available/` |
| PHP-FPM pools | `/etc/php/*/fpm/pool.d/` |
| PHP configuration | `/etc/php/*/fpm/php.ini` |
| MariaDB config | `/etc/mysql/mariadb.conf.d/` |
| Fail2Ban jails | `/etc/fail2ban/jail.d/` |
| Fail2Ban filters | `/etc/fail2ban/filter.d/` |
| ISPConfig | `/usr/local/ispconfig/` |
| Website files | `/var/www/clients/` |
| System logs | `/var/log/` |

---

# Appendix B: Useful Aliases

Add to `~/.bashrc`:

```bash
# Quick status
alias status='uptime && free -h && df -h /'

# Top consumers
alias topcpu='ps -eo user,pcpu,cmd --sort=-pcpu | head -15'
alias topmem='ps -eo user,pmem,cmd --sort=-pmem | head -15'

# Fail2Ban
alias f2bstatus='fail2ban-client status'

# Apache
alias aptest='apache2ctl configtest'
alias apreload='systemctl reload apache2'

# PHP-FPM
alias phprestart='systemctl restart php*-fpm'

# Logs
alias syslog='tail -f /var/log/syslog'
alias authlog='tail -f /var/log/auth.log'
```

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Environment: Debian 12 + ISPConfig 3*
