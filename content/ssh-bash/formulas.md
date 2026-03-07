## Find and Replace (Docs/Word)

Here's how you can find and convert citation-style numbers in brackets (e.g., [1], [13]) into superscript numbers in Microsoft Word using Find and Replace: 


Find (wildcards on):
```
\[([0-9]{1,3})\]
```

Replace with (change font/format to superscript):
```
^&
```
## Pull Web OG Meta
```
function GET_OG(url, property) {
  var html = UrlFetchApp.fetch(url, { followRedirects: true }).getContentText();
  var regex = new RegExp(
    '<meta[^>]+property=["\']' + property + '["\'][^>]+content=["\']([^"\']+)["\']',
    'i'
  );
  var match = html.match(regex);
  return match ? match[1] : '';
}

```
**Use it like a formula:**    
`=GET_OG(A1,"og:title")`  
`=GET_OG(A1,"og:description")`  
`=GET_OG(A1,"og:image")`  
`=GET_OG(A1,"og:site_name")`  



