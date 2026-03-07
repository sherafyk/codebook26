
```
function removeBlankRows() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getDataRange();
  const values = range.getValues();

  // Keep only non-empty rows
  const filtered = values.filter(row => row.join('').trim() !== '');

  // Clear and rewrite
  sheet.clearContents();
  sheet.getRange(1, 1, filtered.length, filtered[0].length).setValues(filtered);
}
```

```
function moveBracketText() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const colA = sheet.getRange(1, 1, lastRow).getValues(); // column A

  const newA = [];
  const newB = [];

  const regex = /\[([^\]]+)\]/; // match text inside [ ]

  for (let i = 0; i < colA.length; i++) {
    const text = colA[i][0];
    if (typeof text === 'string') {
      const match = text.match(regex);
      if (match) {
        // column B gets the bracketed content (no brackets)
        newB.push([match[1].trim()]);
        // column A gets text with brackets removed
        newA.push([text.replace(regex, '').trim()]);
      } else {
        newB.push(['']);
        newA.push([text]);
      }
    } else {
      newA.push(['']);
      newB.push(['']);
    }
  }

  // write results back
  sheet.getRange(1, 1, newA.length).setValues(newA);
  sheet.getRange(1, 2, newB.length).setValues(newB);
}
```
