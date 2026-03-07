# 📝 WordPress Gutenberg: Quick Find & Replace Helper

## 1. Get into the Code Editor

* In the Gutenberg editor:

  * **Shortcut**: `Ctrl + Shift + Alt + M` (Windows) or `Cmd + Opt + Shift + M` (Mac)
  * Or: 3-dot menu (⋮) → **Code Editor**
* This lets you see/edit the raw HTML of your post.

---

## 2. Use a Find & Replace Tool

* Browser shortcut: `Ctrl + F` (find only).
* To replace, install a browser extension like **Find & Replace for Text Editing** (Chrome/Firefox).
* Paste in regex for complex patterns.

---

## 3. Regex Basics (Quick Rules)

* `()` → capture group.
* `\d+` → numbers.
* `[^"]+` → “anything but quotes.”
* `$1`, `$2` → refer back to capture groups in the Replace box.
* Always test on a copy first!

---

## 4. Common Patterns

### 🔧 Superscript Footnotes

**Find (Regex):**

```regex
<a href="([^"]+)">\[(\d+)\]<\/a>
```

**Replace With:**

```html
<a href="$1"><sup>[$2]</sup></a>
```

This turns:

```html
<a href="https://example.com">[1]</a>
```

into:

```html
<a href="https://example.com"><sup>[1]</sup></a>
```

---

## 5. Workflow Recap

1. Open the post → switch to **Code Editor**.
2. Run **Find & Replace** with regex.
3. Switch back to **Visual Editor** to confirm.
4. Save.

---

✅ Keep this handy so you don’t have to re-learn the steps every time.
