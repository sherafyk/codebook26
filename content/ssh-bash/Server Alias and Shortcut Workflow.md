# Server Alias and Shortcut Workflow Guide
## A practical reference for SSH, aliases, deploy shortcuts, and WordPress plugin operations

This guide is a reusable reference for creating command-line shortcuts on your server so repeated WordPress and plugin-development tasks become faster, safer, and more consistent.

It is written for a workflow that looks like this:

- local development in Docker
- source control in GitHub
- deployment to a live WordPress server
- server access over SSH
- WordPress hosted in an ISPConfig 3-style environment
- plugin code deployed by `git pull`

This guide is intentionally generic and does **not** hardcode a specific local path or specific site path. Use it as a template for future projects.

---

## 1. Why aliases and shortcuts matter

When you work on WordPress plugins repeatedly, you end up typing the same commands over and over:

- SSH into the server
- navigate to the plugin folder
- check Git status
- pull the latest code
- inspect logs
- run permissions fixes
- list WordPress plugins
- activate/deactivate a plugin
- clear caches or transients

Doing those manually every time is:

- slow
- error-prone
- mentally repetitive
- easy to mistype

Aliases and small helper functions solve that problem.

They make your workflow:

- faster
- more repeatable
- easier to remember
- easier to teach to your future self

Think of them as personal “developer commands” for your server.

---

## 2. The basic idea

Instead of typing:

```bash
cd /path/to/your/live/wordpress/plugin/folder
git status
git pull
```

you define an alias like:

```bash
alias wpplug='cd /path/to/your/live/wordpress/plugin/folder'
```

Then you can run:

```bash
wpplug
git pull
```

That is the entire idea.

You can create aliases for:

- plugin folder navigation
- site root navigation
- log viewing
- Git pull/push helpers
- WordPress-specific actions
- deploy helpers
- plugin activation/deactivation

---

## 3. What aliases are good for

Aliases are best for:

- very short repeated commands
- folder navigation
- simple wrappers around common commands
- commands you do daily
- commands you do frequently enough that you should not have to remember the full syntax

Examples:
- jump to plugin folder
- jump to web root
- tail error logs
- pull latest plugin code
- list Git branch/status
- activate plugin via WP-CLI
- clear cache/transients
- inspect file ownership

---

## 4. What aliases are NOT good for

Aliases are not ideal for:

- multi-step conditional logic
- commands that need dynamic arguments every time
- long workflows with error handling
- destructive operations unless you are very careful

For those, prefer:
- shell functions
- small shell scripts
- deploy scripts checked into your repo or personal dotfiles

Rule of thumb:

- use an **alias** for simple repeated commands
- use a **function** for a repeatable workflow with arguments or multiple steps
- use a **script** when the process should be documented, versioned, or shared

---

## 5. Where to define aliases

Usually you define aliases in one of these files on the server:

- `~/.bashrc`
- `~/.bash_profile`
- `~/.profile`
- `~/.zshrc` if using zsh

Most common for bash:

```bash
~/.bashrc
```

Check your current shell:

```bash
echo $SHELL
```

If it returns something like `/bin/bash`, use `.bashrc`.

---

## 6. How to add aliases

Open your shell config file:

```bash
nano ~/.bashrc
```

Add aliases at the bottom.

Example:

```bash
alias ll='ls -lah'
alias ..='cd ..'
alias ...='cd ../..'
```

Then reload the file:

```bash
source ~/.bashrc
```

Now the aliases are available in the current shell session.

---

## 7. WordPress server aliases you should almost always create

These are the most useful categories.

### 7.1 Navigation aliases

Create aliases that jump directly to important folders:

- WordPress web root
- plugin root
- uploads folder
- logs folder
- theme folder if needed

Examples:

```bash
alias wproot='cd /path/to/live/wordpress/root'
alias wpplug='cd /path/to/live/wordpress/plugin/folder'
alias wpuploads='cd /path/to/live/wordpress/wp-content/uploads'
```

Why this helps:
- no memorizing long ISPConfig paths
- no typos
- instant context switching

---

### 7.2 Git aliases

Examples:

```bash
alias gs='git status'
alias gl='git log --oneline -10'
alias gp='git pull'
alias gco='git checkout'
alias gb='git branch'
```

These are general-purpose and very useful inside plugin repos.

Typical use:

```bash
wpplug
gs
gp
```

---

### 7.3 Deployment aliases

Examples:

```bash
alias wpdeploy='cd /path/to/live/plugin/folder && git pull'
alias wpdeploy-status='cd /path/to/live/plugin/folder && git status'
```

These are useful if you mostly deploy one plugin to one site.

Benefits:
- shorter deploy command
- less chance of pulling in the wrong directory
- easier to remember during repetitive releases

---

### 7.4 Log aliases

Examples:

```bash
alias apacheerr='tail -f /path/to/apache/error.log'
alias phpwarn='tail -f /path/to/php/error.log'
alias wperr='tail -f /path/to/wordpress/debug.log'
```

If your logs are in different locations per site, create site-specific names.

Benefits:
- instant access to the right log file
- easier live debugging during plugin changes

---

### 7.5 WP-CLI aliases or wrappers

If WP-CLI is installed on the server, it becomes very powerful.

Examples:

```bash
alias wpc='wp'
alias wpplugs='wp plugin list'
alias wpact='wp plugin activate your-plugin-slug'
alias wpdeact='wp plugin deactivate your-plugin-slug'
```

Better yet, if you need to run WP-CLI from a specific WordPress root every time, use a function or alias that includes `--path`.

Example:

```bash
alias wpc='wp --path=/path/to/live/wordpress/root'
```

Then:

```bash
wpc plugin list
wpc plugin activate your-plugin-slug
```

This avoids mistakes where you run `wp` in the wrong directory.

---

## 8. When to use a shell function instead of an alias

Functions are better than aliases when:

- you want multiple commands in sequence
- you need a reusable workflow
- you want optional arguments
- you want basic safety checks

Example function:

```bash
wpdeploy() {
  cd /path/to/live/plugin/folder || return 1
  git status
  git pull
}
```

This is better than an alias if you want:
- a directory change
- then Git status
- then Git pull

A function can also take arguments.

Example:

```bash
wpsite() {
  cd "/var/www/clients/client0/$1/web" || return 1
}
```

Then use:

```bash
wpsite web5
```

That is much harder to do well with a plain alias.

---

## 9. Recommended shortcut strategy for WordPress plugin work

Use a layered approach.

### Layer 1: general shell shortcuts
Examples:
- `ll`
- `gs`
- `gl`
- `gp`

### Layer 2: site-specific navigation aliases
Examples:
- `wproot`
- `wpplug`
- `wplogs`

### Layer 3: project-specific helper functions
Examples:
- `wpdeploy`
- `wpcheck`
- `wprollback`
- `wppull`

This is usually the sweet spot.

---

## 10. Example future-proof alias set

Use this as a base template and change the paths to match your server.

```bash
# Navigation
alias wproot='cd /path/to/live/wordpress/root'
alias wpplug='cd /path/to/live/plugin/folder'
alias wplogs='cd /path/to/log/folder'

# Git
alias gs='git status'
alias gl='git log --oneline -10'
alias gp='git pull'
alias gb='git branch'

# WP-CLI
alias wpc='wp --path=/path/to/live/wordpress/root'
alias wpplugs='wp --path=/path/to/live/wordpress/root plugin list'

# Logs
alias wperr='tail -f /path/to/wordpress/debug.log'
alias apacheerr='tail -f /path/to/apache/error.log'
```

And a function:

```bash
wpdeploy() {
  cd /path/to/live/plugin/folder || return 1
  echo "== Git status =="
  git status
  echo "== Pulling latest =="
  git pull
}
```

---

## 11. Why this is especially helpful with ISPConfig 3

ISPConfig 3 paths can be long and easy to forget.

Typical paths often look like:

```text
/var/www/clients/clientX/webY/web/...
```

This is exactly the kind of path structure where aliases shine.

Instead of memorizing:

- exact client number
- exact web number
- exact plugin folder nesting
- exact log file location

you define memorable commands once and reuse them forever.

That reduces mistakes like:
- deploying to the wrong site
- tailing the wrong log
- editing the wrong plugin folder
- running `git pull` in the wrong repo

---

## 12. Common server-side use cases and the best shortcut for each

### Use case: deploy latest plugin changes
Best tool:
- alias or function

Example:
```bash
wpdeploy
```

### Use case: jump into plugin repo and inspect
Best tool:
- navigation alias

Example:
```bash
wpplug
gs
```

### Use case: inspect WordPress logs during a bug fix
Best tool:
- log alias

Example:
```bash
wperr
```

### Use case: check plugin activation state
Best tool:
- WP-CLI alias

Example:
```bash
wpplugs
```

### Use case: activate/deactivate plugin
Best tool:
- WP-CLI alias or function

Example:
```bash
wpc plugin activate your-plugin-slug
wpc plugin deactivate your-plugin-slug
```

### Use case: verify web root
Best tool:
- navigation alias

Example:
```bash
wproot
pwd
```

---

## 13. Good naming conventions for aliases

Use names that are:
- short
- memorable
- specific enough not to collide with common commands

Good examples:
- `wproot`
- `wpplug`
- `wplogs`
- `wpdeploy`
- `wperr`

Less good:
- `go`
- `run`
- `site`
- `prod`

You want names that still make sense weeks later.

---

## 14. Caution with destructive shortcuts

Be very careful creating shortcuts for commands like:

- `rm -rf`
- recursive `chown`
- recursive `chmod`
- database resets
- cache wipes

If you do create these, prefer a function that:
- prints what it will do
- maybe asks for confirmation
- uses exact safe paths

Bad example:

```bash
alias fixperm='chmod -R 755 .'
```

That is too vague and too easy to run in the wrong folder.

Better:

```bash
fixplugperms() {
  cd /path/to/live/plugin/folder || return 1
  echo "About to fix plugin permissions in $(pwd)"
  chown -R www-data:www-data .
}
```

Even then, use care.

---

## 15. Best workflow for your plugin/server setup

Here is the ideal loop.

### Local development
1. Open plugin repo locally.
2. Ask Codex for a bounded change.
3. Test in Docker.
4. Confirm the feature works.

### Commit and push
5. Commit locally.
6. Push to GitHub.

### Server deploy
7. SSH into server.
8. Run:
   ```bash
   wpdeploy
   ```
9. Refresh the live site/admin.
10. Confirm the feature works.

### If debugging live
11. Run:
   ```bash
   wperr
   ```
12. Reproduce issue and inspect logs.

That is the clean loop to optimize around.

---

## 16. When to use aliases vs scripts for deployment

Use aliases/functions when:
- you are deploying one plugin to one server
- the commands are short
- you want personal convenience

Use scripts when:
- you have multiple plugins
- you have multiple environments
- you want rollback or tagging
- you want repeatable team-wide workflows
- you want to version the deployment logic

A good rule:
- start with aliases/functions
- move to scripts once the deploy process becomes multi-step enough to deserve versioning

---

## 17. A practical `.bashrc` section template

You can keep a dedicated section in your `.bashrc` like this:

```bash
# ------------------------------
# WordPress workflow shortcuts
# ------------------------------

# Navigation
alias wproot='cd /path/to/live/wordpress/root'
alias wpplug='cd /path/to/live/plugin/folder'
alias wplogs='cd /path/to/log/folder'

# Git helpers
alias gs='git status'
alias gl='git log --oneline -10'
alias gp='git pull'
alias gb='git branch'

# WP-CLI
alias wpc='wp --path=/path/to/live/wordpress/root'
alias wpplugs='wp --path=/path/to/live/wordpress/root plugin list'

# Logs
alias wperr='tail -f /path/to/wordpress/debug.log'

# Deploy
wpdeploy() {
  cd /path/to/live/plugin/folder || return 1
  echo "== Git status =="
  git status
  echo "== Pulling latest =="
  git pull
}
```

Then reload:

```bash
source ~/.bashrc
```

---

## 18. How to test your aliases safely

After creating aliases/functions, test them one by one.

### Test navigation aliases
```bash
wpplug
pwd
```

Make sure `pwd` matches the folder you expected.

### Test Git aliases
```bash
wpplug
gs
gl
```

### Test log aliases
```bash
wperr
```

Confirm the log file exists.

### Test WP-CLI aliases
```bash
wpc plugin list
```

### Test deploy function
```bash
wpdeploy
```

Make sure it:
- enters the correct folder
- runs `git status`
- runs `git pull`

Do not assume they are correct until you verify `pwd` and file contents.

---

## 19. Common mistakes to avoid

Avoid these:

- creating aliases with vague names
- forgetting to reload `.bashrc`
- using aliases that assume the wrong working directory
- making destructive aliases too short/easy to trigger
- hardcoding wrong site paths
- creating shortcuts without testing them with `pwd`
- assuming WP-CLI is using the correct site without `--path`

---

## 20. When to create site-specific vs generic shortcuts

### Generic shortcuts
Use these for commands that work anywhere:
- `gs`
- `gl`
- `gp`
- `ll`

### Site-specific shortcuts
Use these for:
- WordPress root
- plugin folder
- logs
- deploy function
- WP-CLI path helpers

Keep both.

That way:
- generic commands are reusable everywhere
- site-specific commands save you from remembering long ISPConfig paths

---

## 21. Suggested future expansions

As your workflow matures, consider adding:

- a function to deploy and then show the last commit
- a function to tail logs after deploy
- a function to check current branch before pull
- a function to activate/deactivate the plugin
- a function to snapshot the current version before deploy
- a function to run WordPress cache/transient cleanup

Examples:

```bash
wpdeploycheck() {
  cd /path/to/live/plugin/folder || return 1
  git status
  git log --oneline -3
}
```

```bash
wplivecheck() {
  wp --path=/path/to/live/wordpress/root plugin list
  tail -n 50 /path/to/wordpress/debug.log
}
```

These are useful once your deployment rhythm gets faster.

---

## 22. Personal checklist before relying on server shortcuts

Before you rely on aliases/functions for production-related tasks, confirm:

- the path is correct
- `pwd` confirms the right folder
- the command works in a fresh SSH session
- the command does not affect the wrong site
- the log path is correct
- WP-CLI points to the right WordPress root
- the deploy function operates on the intended Git repo

---

## 23. The best mental model

Treat aliases and shortcut functions as:

**your personal command palette for server operations**

The goal is not to be clever.
The goal is to:

- remove repetitive typing
- reduce mistakes
- speed up safe, common actions
- make your future self less dependent on memory

If you do that, they are worth it.

---

## 24. Recommended starter set for future WordPress projects

For almost every future project, create:

- one alias for WordPress root
- one alias for plugin folder
- one alias for logs
- one alias for WP-CLI with correct `--path`
- one deploy function
- general Git aliases if not already present

That is enough to get most of the benefit without overengineering.

---

## 25. Final operating principle

The best server-side shortcut system is:

- small
- memorable
- tested
- path-correct
- safe
- easy to reuse across projects

Start with:
- navigation alias
- deploy function
- WP-CLI alias
- log alias

Then expand only when a repeated pain point proves it is worth it.

That is the standard to keep.
