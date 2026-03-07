# 🔄 Google Sheets to WordPress Auto Poster

Use this workflow to automate blog posts from a spreadsheet to WordPress.

## Tools
- Google Apps Script
- WordPress REST API

## Code Sketch

```js
function postToWP(title, content) {
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ title: title, content: content, status: 'publish' }),
    headers: { Authorization: 'Bearer YOUR_TOKEN' }
  };
  UrlFetchApp.fetch("https://yourwordpresssite.com/wp-json/wp/v2/posts", options);
}
```