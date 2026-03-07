
# Google Apps Script × OpenAI helper library  
A clean, sheet agnostic toolkit for calling **`chat/completions`** from Google Sheets.

---

## Table of contents
1. [What you get](#what-you-get)  
2. [Quick start](#quick-start)  
3. [Installation](#installation)  
4. [Configuration](#configuration)  
5. [API helper `callOpenAI`](#api-helper-callopenai)  
6. [Single cell wrapper `runChat`](#single-cell-wrapper-runchat)  
7. [Batch wrappers](#batch-wrappers)  
8. [Convenience presets](#convenience-presets)  
9. [In cell custom function `GPT`](#in-cell-custom-function-gpt)  
10. [Error handling](#error-handling)  
11. [Extending](#extending)  
12. [Formulas](#convenient-formulas-for-your-sheet)

---

## What you get
| Component | Purpose |
|-----------|---------|
| `CONFIG` object | Centralises constants: API URL, default sheet, property key |
| `callOpenAI()` | Low level POST helper (JSON in, assistant reply out) |
| `runChat()` | One shot read prompt / write reply for any three cells |
| **Batch helpers** | Iterate vertically or horizontally and fill results |
| Temperature presets | `chatLowTemp`, `chatMedTemp`, `chatDeterministic` |
| `GPT()` custom function | Use `=GPT(prompt)` directly inside a cell |
| Robust errors | HTTP status and API message surfaced in sheet |
| Key security | Uses Script Properties, never hard-codes secrets |

All of the above lives in a single file **`openai.gs`** so you can push it to GitHub without leaking your key.

---

## Quick start

1. Open script.google.com → new project  
2. Replace the default `Code.gs` with `openai.gs` (below)  
3. Run saveApiKey() once and paste your secret key  
4. In your sheet:  
      cell B1: "`gpt-4o-mini`"  
      cell A2: "`Write a haiku about tequila sunsets`"  
   Then run from the editor:  
      `chatLowTemp("B1","A2","A3")`   // A3 will get the reply

---

## Installation

Copy **`openai.gs`** snippets below into your Apps Script project, modify as you see fit.

---

## Configuration

```javascript
/* ========= CONFIG ========= */
const CONFIG = {
  SHEET_NAME : 'Sheet1',                       // default worksheet, you can change this
  API_URL    : 'https://api.openai.com/v1/chat/completions', // default endpoint for chat completions; not for images, assistants, etc.
  PROP_KEY   : 'OPENAI_API_KEY'                // Script Property name. DO NOT ENTER YOUR ACTUAL KEY, JUST LEAVE AS IS
};
```

Change `SHEET_NAME` or override it per call.
Everything else rarely changes.

### Saving your key (one time)

```javascript
function saveApiKey() {
  PropertiesService.getScriptProperties()
    .setProperty(CONFIG.PROP_KEY, 'sk-paste-your-key-here');
}
```

> [!NOTE]
> Run that once. Your secret is encrypted in the project and never committed. Remove block once complete.

---

## API helper `callOpenAI`

```javascript
/**
 * Low level wrapper around chat/completions.
 *
 * @param {string} prompt        user content
 * @param {string} model         model id, e.g. "gpt-4o-mini"
 * @param {number} [temperature] 0-2 (omit for deterministic, e.g. if using a reasoning model)
 * @param {Object[]} [systemMsgs] optional system / assistant messages
 * @returns {string} assistant reply
 */
function callOpenAI(prompt, model, temperature, systemMsgs) {
  const messages = [...(systemMsgs || []), { role: 'user', content: prompt }];
  const payload  = { model, messages };
  if (temperature !== undefined) payload.temperature = temperature;

  const options  = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization:
               'Bearer ' + PropertiesService.getScriptProperties()
                 .getProperty(CONFIG.PROP_KEY) },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const res      = UrlFetchApp.fetch(CONFIG.API_URL, options);
  const status   = res.getResponseCode();
  const body     = JSON.parse(res.getContentText());

  if (status < 200 || status >= 300)
    throw new Error(`OpenAI ${status}: ${body.error?.message || body}`);

  return body.choices[0].message.content.trim();
}
```

---

## Single cell wrapper `runChat`

```javascript
/**
 * Pull prompt and model from two cells, push reply to a third.
 *
 * @param {string} modelCell   A1 style reference
 * @param {string} promptCell  A1 style reference
 * @param {string} outputCell  A1 style reference
 * @param {number} [temperature]
 * @param {string} [sheetName] override default sheet
 */
function runChat(modelCell, promptCell, outputCell,
                 temperature, sheetName) {
  const sheet  = SpreadsheetApp.getActive()
                  .getSheetByName(sheetName || CONFIG.SHEET_NAME);
  const model  = sheet.getRange(modelCell).getValue();
  const prompt = sheet.getRange(promptCell).getValue();

  try {
    const reply = callOpenAI(prompt, model, temperature);
    sheet.getRange(outputCell).setValue(reply);
  } catch (err) {
    sheet.getRange(outputCell).setValue(`Error: ${err.message}`);
  }
}
```

---

## Batch wrappers

### Vertical range → vertical answers

Fill prompts in column **A** (`A2:A10`), write results to column **B** (`B2:B10`).

```javascript
function runChatColumn(promptRangeA1, outputRangeA1, model,
                       temperature, sheetName) {
  const sheet   = SpreadsheetApp.getActive()
                    .getSheetByName(sheetName || CONFIG.SHEET_NAME);
  const prompts = sheet.getRange(promptRangeA1).getValues().flat();

  const replies = prompts.map(p =>
    p ? [callOpenAI(p, model, temperature)] : ['']
  );

  sheet.getRange(outputRangeA1).offset(0, 0, replies.length, 1)
       .setValues(replies);
}
```

Example:

```javascript
runChatColumn('A2:A10', 'B2', 'gpt-4o-mini', 0.3);
```

### Row wise (horizontal) helper

```javascript
function runChatRow(promptRangeA1, outputRangeA1, model,
                    temperature, sheetName) {
  const sheet   = SpreadsheetApp.getActive()
                    .getSheetByName(sheetName || CONFIG.SHEET_NAME);
  const prompts = sheet.getRange(promptRangeA1).getValues()[0];

  const replies = [prompts.map(p =>
    p ? callOpenAI(p, model, temperature) : ''
  )];

  sheet.getRange(outputRangeA1).offset(0, 0, 1, replies[0].length)
       .setValues(replies);
}
```

---

## Convenience presets

```javascript
function chatLowTemp(modelCell, promptCell, outputCell, sheetName) {
  runChat(modelCell, promptCell, outputCell, 0.2, sheetName);
}
function chatMedTemp(modelCell, promptCell, outputCell, sheetName) {
  runChat(modelCell, promptCell, outputCell, 0.4, sheetName);
}
function chatDeterministic(modelCell, promptCell, outputCell, sheetName) {
  runChat(modelCell, promptCell, outputCell, undefined, sheetName);
}
```

---

## In cell custom function `GPT`

```javascript
/**
 * Use directly in a cell: =GPT("Explain prime numbers")
 *
 * @param {string} prompt
 * @param {string} [model]        optional, default "gpt-4o-mini"
 * @param {number} [temperature]  optional
 * @return {string}
 */
function GPT(prompt, model, temperature) {
  return callOpenAI(prompt,
                    model || 'gpt-4o-mini',
                    temperature);
}
```

Custom functions run under the user’s quota, not trigger quota, so avoid large loops here.

---

## Error handling

Non 2xx responses propagate the HTTP status and API message into the sheet.
A typical cell output looks like:

```
Error: OpenAI 429: Rate limit exceeded. Try again in 20 s.
```

This keeps failures visible and prevents silent data corruption.

---

## Extending

| Need              | Hook                                                       |
| ----------------- | ---------------------------------------------------------- |
| Retry or back off | wrap `UrlFetchApp.fetch` inside `callOpenAI`               |
| Streaming         | add `stream:true` to payload, use `UrlFetchApp.fetchAll`   |
| Function calling  | extend `payload` with `functions` and `function_call`      |
| Moderation        | chain a small `callModeration(prompt)` before `callOpenAI` |
| On edit trigger   | use `onEdit(e)` to detect prompt edits then call `runChat` |

Absolutely—here’s a **cleaner, more conceptual, and flexible section** you can drop into your documentation.
This version standardizes the references, clearly explains the layout, and emphasizes how to adapt for your own sheet (with less “hard-coded” feel).

---

## Convenient Formulas for Your Sheet

Use these examples to quickly connect your Google Sheet cells to OpenAI.
**You can use any cells you want—these are just examples.** Adjust cell references as needed.

---

#### 1. Deterministic Reply (no randomness)

**How to set up:**

* Put your **OpenAI model ID** (e.g., `gpt-4o-mini`) in any cell, e.g. `B1`
* Put your **prompt text** in any other cell, e.g. `A2`

**Formula:**

```excel
=GPT(A2, $B$1)
```

**How it works / How to adapt:**

* This calls the model in `$B$1` with the prompt in `A2` and returns a “strict” (repeatable) answer.
* Use **any cell** for your prompt—just update `A2` in the formula.
* Always **lock the model cell** with `$` so you can drag/copy the formula down and always use the same model.

---

#### 2. Low-Temperature (Conservative) Reply

**How to set up:**

* Model in `B1`
* Prompt in `A2`

**Formula:**

```excel
=GPT(A2, $B$1, 0.25)
```

**How it works / How to adapt:**

* The third argument (`0.25`) sets how “creative” the answer is (0 = strict, 2 = wild).
* Change the temperature to fit your needs.
* You can use any cells for prompt/model—just update references in the formula.

---

#### 3. Horizontal Prompts (Replies Across Columns)

**How to set up:**

* Model ID in `A2`
* Prompts in row 1: `B1`, `C1`, `D1`, ...
* Replies will appear in row 2: `B2`, `C2`, `D2`, ...

**Formula for B2 (drag right):**

```excel
=GPT(B$1, $A$2, 0.4)
```

**How it works / How to adapt:**

* Formula grabs prompt from the cell above (`B$1`), always uses the model in `$A$2`.
* Drag the formula right to automatically use `C1`, `D1`, etc.
* Change references if you use different rows or columns.

---

#### 4. Dynamic Script Call (runChat)

**How to set up:**

* Model ID in `B2`
* Prompt in `A2`
* Output (where reply will go) in `C2`

**Formula:**

```excel
="runChat('" & ADDRESS(ROW(B2),COLUMN(B2),4) & "','" & ADDRESS(ROW(A2),COLUMN(A2),4) & "','" & ADDRESS(ROW(C2),COLUMN(C2),4) & "',0.2);"
```

**How it works / How to adapt:**

* This creates a string like:
  `runChat('B2','A2','C2',0.2);`
* Copy the output (not the formula) and paste it into your Apps Script console to trigger the script for those cells.
* You can use **any cell** for model, prompt, and output—just update the cell references in the formula.

---

#### 5. Medium-Temperature Preset (chatMedTemp)

**How to set up:**

* Model in `B2`
* Prompt in `A2`
* Output in `C2`

**Formula:**

```excel
="chatMedTemp('" & ADDRESS(ROW(B2),COLUMN(B2),4) & "','" & ADDRESS(ROW(A2),COLUMN(A2),4) & "','" & ADDRESS(ROW(C2),COLUMN(C2),4) & "');"
```

**How it works / How to adapt:**

* Generates:
  `chatMedTemp('B2','A2','C2');`
* Paste that in the Apps Script console to run for that row.
* Change function name to `chatLowTemp` or `chatDeterministic` for stricter outputs.
* Update cell references as needed.

---

### **How to adapt these formulas for your sheet:**

* **You can use any cells you like!**

  * Example references (A2, B1, etc.) are just for illustration.
  * Wherever your model/prompt/output lives, just swap the references in the formulas.

* **Absolute references (`$B$1`, `$A$2`):**

  * Add `$` to “lock” the model or prompt cell if you want to copy/drag the formula without changing which cell is used.

* **Temperature:**

  * *0–0.3*: strict, factual (summaries, code, definitions)
  * *0.4–0.7*: moderate creativity (ideas, writing)
  * *1.0–2.0*: wild, brainstorming

* **Batching:**

  * For lots of prompts, use Apps Script batch helpers like `runChatColumn` or `runChatRow` (see earlier sections).

* **Formulas are just shortcuts:**

  * If you want more control, write scripts that use whatever cell references or workflow you prefer.

---

**Summary:**
These examples are here to save you time, but **they work with any cells you choose**. Just swap cell references for your layout, and you’re set.


