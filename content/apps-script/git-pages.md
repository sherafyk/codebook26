## 1  Design a “posts” worksheet

| A          | B               | C                | D               | E          | F                                      | G                                                                 |
| ---------- | --------------- | ---------------- | --------------- | ---------- | -------------------------------------- | ----------------------------------------------------------------- |
| **date**   | **slug**        | **title**        | **categories**  | **tags**   | **description**                        | **body\_md**                                                      |
| 2025-07-10 | blog-guide | Blog Guide | content-strategy | Blog, Guide | 6 proven paths when doing something | *(full article markdown; you can use `\n` or new lines directly)* |

* **date** → must be `YYYY-MM-DD`.
* **slug** → lower-case, hyphenated, no spaces.
* **categories / tags** → comma-separated lists.
* **body\_md** → raw markdown (use triple-click in the cell to edit with hard line breaks).

---

## 2  Create a GitHub personal-access token (PAT)

1. GitHub ▸ **Settings → Developer settings → Tokens classic**
2. **Generate token** → scope only **`repo` → `public_repo`**.
3. Copy it once; we’ll paste it into the script’s Properties.

---

## 3  Add the Apps Script

**Extensions → Apps Script** → replace the default `Code.gs` with:

```js
/*****************************************************************
 * Publish selected rows as Jekyll posts to _posts/ via GitHub API
 *****************************************************************/
const GH_USER   = 'your-github-username';
const GH_REPO   = 'your-github-repo';
const BRANCH    = 'main';             // change if you use another branch
const TOKEN_KEY = 'GITHUB_PAT';       // stored in Script Properties
const SHEET     = 'posts';            // worksheet name

/**
 *  Adds a custom menu in the Sheet UI
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Jekyll')
    .addItem('▶ Publish selected rows', 'publishSelectedRows')
    .addToUi();
}

/**
 *  Main entry: loops through selected rows
 */
function publishSelectedRows() {
  const sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET);
  const range  = sheet.getActiveRange();
  const values = range.getValues();
  const props  = PropertiesService.getScriptProperties();
  const token  = props.getProperty(TOKEN_KEY);
  if (!token) { SpreadsheetApp.getUi().alert('❌ Set GITHUB_PAT in Script Properties'); return; }

  values.forEach((row, i) => {
    const [date, slug, title, cats, tags, desc, body] = row;
    if (!date || !slug || !title) return;       // skip incomplete lines

    const fm  = [
      '---',
      `layout: post`,
      `title: "${title.replace(/"/g,'\\"')}"`,
      `description: "${desc.replace(/"/g,'\\"')}"`,
      `date: ${Utilities.formatDate(new Date(date), 'GMT', 'yyyy-MM-dd')}`,
      `categories: [${cats}]`,
      `tags: [${tags}]`,
      '---\n\n'
    ].join('\n');

    const md  = fm + body.replace(/\r\n/g, '\n') + '\n';
    const b64 = Utilities.base64Encode(md);
    const path = `_posts/${Utilities.formatDate(new Date(date),'GMT','yyyy-MM-dd')}-${slug}.md`;

    const url = `https://api.github.com/repos/${GH_USER}/${GH_REPO}/contents/${encodeURIComponent(path)}`;
    const payload = {
      message: `Add post: ${title}`,
      branch:  BRANCH,
      content: b64
    };

    const options = {
      method: 'PUT',
      contentType: 'application/json',
      payload:   JSON.stringify(payload),
      headers: { Authorization: 'token ' + token }
    };

    const resp = UrlFetchApp.fetch(url, options);
    Logger.log(resp.getContentText());
  });

  SpreadsheetApp.getUi().alert('✅ Posts committed to GitHub!');
}
```

### 3-a. Save your PAT securely

* Apps Script IDE ▸ **Project Settings → Script properties**
  *Key*: `GITHUB_PAT` *Value*: `<your-token>`

---

## 4  Use it

1. Select one or many filled rows.
2. **Jekyll ▸ Publish selected rows**.
3. Check **GitHub → Actions** → build runs → your site deploys in \~60 s.
4. URLs will match your permalink rule, e.g.
   `/career-strategy/big4-exit-guide/`.

---

## 5  Updating or fixing a post

If the script hits the same path again, the GitHub API returns the file’s **SHA**.
Modify the `payload` like this to send an update:

```js
const fileInfo = JSON.parse(resp.getContentText());
payload.sha = fileInfo.sha;            // add SHA to overwrite
```

*(You can wrap that in a try/catch to detect “file exists” automatically.)*

---

