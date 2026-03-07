# 🧰 **Sheraf's MobaXterm GitHub Operator Master Sheet**

*(SSH-based, CLI-native, stable for long-term usage)*

---

## 🔑 1 — One-Time Initial Setup

### A. Generate SSH key (if not yet generated):

```bash
ssh-keygen -t ed25519 -C "youremail@example.com"
```

* Hit Enter to accept default location (`/home/yourusername/.ssh/id_ed25519`).
* Save the private key safely.

### B. Add public key to GitHub:

```bash
cat ~/.ssh/id_ed25519.pub
```

* Copy this key.
* Go to: GitHub → Settings → SSH and GPG keys → New SSH key → (Type: *Authentication Key*).

### C. Test SSH connection:

```bash
ssh -T git@github.com
```

You should see:

```
Hi username! You've successfully authenticated...
```

### D. Set global Git identity (only once):

```bash
git config --global user.name "username"
git config --global user.email "youremail@example.com"
```

---

## 🏗 2 — Daily GitHub Workflow

### A. Clone your repo (first time only):

```bash
git clone git@github.com:username/reponame.git
```

This creates the directory `reponame/` in current folder.

### B. Enter your repository:

```bash
cd reponame
```

### C. Create new files:

```bash
nano myfile.md
```

* Edit → Save (`Ctrl+O`, Enter, `Ctrl+X`).

### D. Stage your changes:

```bash
git add myfile.md
```

Or stage everything:

```bash
git add .
```

### E. Commit your changes:

```bash
git commit -m "Describe your commit message here"
```

### F. Pull before pushing (safe habit):

```bash
git pull origin main
```

⚠ If you see divergent branch warning again in rare cases, use:

```bash
git pull origin main --allow-unrelated-histories --no-rebase
```

### G. Push your changes:

```bash
git push origin main
```

---

## 🔄 3 — Ongoing Maintenance

### Check branch status:

```bash
git status
```

### See remote URL:

```bash
git remote -v
```

### Set pull strategy globally (recommended):

```bash
git config --global pull.rebase false
```

---

## 🚑 4 — Quick Error Recovery

| Error                      | Quick Fix                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| `Updates were rejected...` | Run `git pull origin main` first                                   |
| `Unrelated histories`      | Use `git pull origin main --allow-unrelated-histories --no-rebase` |
| SSH issues                 | Test: `ssh -T git@github.com`                                      |
| Wrong author identity      | Re-run `git config --global user.name` and `user.email`            |

---

## 💡 5 — SSH Config (Optional QoL upgrade)

You can simplify your SSH config like this:

```bash
nano ~/.ssh/config
```

Add:

```
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

This prevents conflicts if you use multiple SSH keys.


✅ **You are now fully GitHub-enabled via SSH from MobaXterm.**

---


## 🚑 **Disaster Recovery Sheet**

*(For when Git gets ugly)*

---

### 1️⃣ Hard Reset Local Branch to Match Remote (nuclear option)

If your local branch is totally messed up and you just want to reset to match remote:

```bash
git fetch origin
git reset --hard origin/main
```

✅ Your local branch is now identical to remote.

---

### 2️⃣ Abort Current Merge / Conflict

If you're in a broken merge state:

```bash
git merge --abort
```

Or to discard uncommitted changes:

```bash
git reset --hard
```

---

### 3️⃣ Unstage a file you accidentally added

```bash
git reset HEAD filename
```

---

### 4️⃣ Delete Local Changes (but keep staged changes)

```bash
git checkout -- filename
```

---

### 5️⃣ Clean untracked files (dangerous — double check before running)

```bash
git clean -fd
```

---

### 6️⃣ Delete Last Commit (local only)

```bash
git reset --soft HEAD~1
```

or hard delete:

```bash
git reset --hard HEAD~1
```

---

### 7️⃣ Force Push After Cleaning Up History

```bash
git push origin main --force
```

⚠ Use this carefully. Only when you know your remote collaborators won’t lose important work.

---

---

## 🧰 **Advanced Git Operator Sheet**

*(Branching, conflict resolution, cherry-picking, etc)*

---

### 1️⃣ Create a new branch

```bash
git checkout -b new-branch-name
```

### 2️⃣ Switch to existing branch

```bash
git checkout branch-name
```

### 3️⃣ Push new branch to remote

```bash
git push origin new-branch-name
```

### 4️⃣ Merge another branch into current branch

```bash
git merge branch-name
```

### 5️⃣ Resolve conflicts manually

* Open conflicting files
* Look for markers like:

```
<<<<<<< HEAD
your local changes
=======
remote changes
>>>>>>> branch-name
```

* Edit to resolve, save.

* After resolving:

```bash
git add .
git commit -m "Resolved conflicts"
git push origin main
```

### 6️⃣ Cherry-pick a single commit into current branch

```bash
git cherry-pick commit_hash
```

### 7️⃣ Stash work temporarily

```bash
git stash
```

Restore stash:

```bash
git stash pop
```


