# GitHub Flavored Markdown (GFM) – Comprehensive Guide for Solopreneurs
**Updated:** 2025-May-29 @18:04 PDT  
**By:** Sherafgan Khan [(@sherafyk)](https://github.com/sherafyk)

**GitHub Flavored Markdown (GFM)** is a lightweight markup language for formatting text on GitHub. It builds on standard Markdown with **extended features** that make it easy to style your content in README files, issues, pull requests, comments, and more. This guide provides a **comprehensive, intuitive reference** for GFM, targeted at technically literate solopreneurs (even if you’re not an expert developer). Use it as a go-to resource for formatting text on GitHub.

**What you’ll learn in this guide:**

* How to use **basic Markdown syntax** (headings, emphasis, lists, code blocks, etc.) on GitHub.
* **GitHub-specific extensions** and behaviors (tables, task lists, mentions, emojis, footnotes, etc.).
* Differences in formatting **across GitHub contexts** (README vs. issues vs. wikis, etc.).
* Tips, best practices, common pitfalls, and **do’s and don’ts** for clean, effective Markdown.

Let’s dive in!

---

## 📚 Contents

* [Introduction to GFM](#introduction-to-gfm)
* [Markdown Basics on GitHub](#markdown-basics-on-github)
  * [Headings](#headings)
  * [Paragraphs and Line Breaks](#paragraphs-and-line-breaks)
  * [Emphasis and Text Styles](#emphasis-and-text-styles)
  * [Blockquotes](#blockquotes)
  * [Lists](#lists)
    * [Unordered Lists (Bulleted)](#unordered-lists-bulleted)
    * [Ordered Lists (Numbered)](#ordered-lists-numbered)
    * [Nested Lists](#nested-lists)
    * [Task Lists (Checklists)](#task-lists-checklists)
  * [Code and Syntax Highlighting](#code-and-syntax-highlighting)
    * [Inline Code](#inline-code)
    * [Code Blocks](#code-blocks)
    * [Displaying Output or Logs](#displaying-output-or-logs)
    * [Diagrams and Other Media in Code Blocks](#diagrams-and-other-media-in-code-blocks)
  * [Horizontal Rules (Section Breaks)](#horizontal-rules-section-breaks)
  * [Links and Images](#links-and-images)
    * [Links (Hyperlinks)](#links-hyperlinks)
    * [Images](#images)
  * [Tables](#tables)
* [Extended GitHub Markdown Features](#extended-github-markdown-features)
  * [Emojis](#emojis)
  * [Mentions and References (in detail)](#mentions-and-references-in-detail)
  * [Collapsible Sections (Details/Summary)](#collapsible-sections-detailssummary)
  * [Alerts (Admonition Blocks)](#alerts-admonition-blocks)
  * [Footnotes](#footnotes)
  * [Escaping and Literal Characters](#escaping-and-literal-characters)
  * [Comments (Hiding Content)](#comments-hiding-content)
* [Differences by GitHub Context](#differences-by-github-context)
* [General Tips, Do’s and Don’ts](#general-tips-dos-and-donts)
  * [Do’s ✔️](#dos-️)
  * [Don’ts ❌](#donts-)
  * [Troubleshooting Formatting Issues](#troubleshooting-formatting-issues)
  
---

## Introduction to GFM

Markdown is a plain text formatting syntax that converts easily to HTML. GitHub supports Markdown in many places, and their “flavored” version adds extra capabilities. As a solopreneur, you’ll encounter GFM when you:

* Write **README.md** files or documentation in your repositories.
* Open or comment on **issues**, **pull requests**, and **discussions** on GitHub.
* Create content in **GitHub Wikis** or GitHub Pages (which can use Markdown).

**Why GFM?** It allows you to create well-formatted content *without* writing HTML/CSS. You can add headings, **bold** text, links, tables, and more using simple punctuation characters. The result is easier-to-read source text and nicely rendered content on GitHub.

> [!NOTE]
> GitHub.com automatically renders Markdown in your repository and in communications. GFM is based on the CommonMark specification, so it’s standardized. However, some **features and rules vary slightly by context** (for example, line breaks work differently in an issue comment vs. a README file). We’ll point out these differences as we go.

---

## Markdown Basics on GitHub

Let’s start with core Markdown syntax that works on GitHub. These basics cover 90% of typical formatting needs.

<details>
 
<summary>
 
### Headings
 
</summary>

Headings help structure your content with different levels (like chapters, sections, sub-sections). In Markdown, you create a heading by prefixing your text with one or more `#` symbols:

* `#` creates a first-level heading (largest)
* `##` for a second-level heading
* ... up to `######` for a sixth-level heading (smallest)

**Example:**

```md
# Project Title
## Introduction
### Features
#### Sub-feature
##### Note
###### Fine Print
```

This would render as a hierarchy of headings. The number of `#` determines the heading’s level and size.

**Best practices:**

* *Include a space after the `#` symbols.* For example, write `# Heading` not `#Heading`. A missing space can prevent the heading from rendering.
* *Don’t skip levels arbitrarily.* It’s technically allowed to jump from `##` to `####`, but for clarity, try to use them in order (like an outline).
* *Avoid using more than one `#` Level-1 heading* in a single page (especially in README files). Typically, the top-level `#` heading is the title, and you use `##` and below for sections.

**Anchors for headings:** GitHub automatically generates **anchor IDs** for each heading in rendered Markdown. This means you can link directly to that section. The anchor is usually the heading text, **lowercased**, with spaces replaced by hyphens and special characters removed. For example, a heading `"## Features & Benefits"` becomes an anchor `#features--benefits` (note the hyphens). We’ll cover linking to these anchors in the **Links** section.

> **Tip:** To find a heading’s anchor on GitHub, hover over the rendered heading and click the link icon that appears. This copies or reveals the URL fragment you can use in links.

</details>

<details>
 
<summary>

### Paragraphs and Line Breaks

</summary>
 
**Paragraphs:** In Markdown, a new paragraph is created by leaving a blank line between lines of text. Simply continue text on the next line (with no blank line) to keep it in the **same paragraph**, or add an empty line to start a **new paragraph**. Paragraph text will wrap automatically in the rendered view.

**Line breaks:** What if you want a new line *without* starting a new paragraph (e.g. for an address or poem)?

* In \**README.md or other *.md files**, GitHub requires an explicit line break. You can achieve this by ending a line with **two or more spaces**, then hitting **Enter**. Alternatively, you can insert an HTML line break tag `<br>` at the end of a line.
* In **issues, pull request descriptions, or discussions**, GitHub will display a line break any time you press **Enter** (you don’t need the two spaces). This “auto line break” feature in comments makes it easier to write lists or steps without fiddling with spaces.

**Example (in a README.md):**

```md
This is line one with two spaces at the end.␣␣  
This will appear on a new line in the same paragraph.
```

The two trailing spaces (`␣␣`) ensure that “This will appear on a new line” starts below the previous text. Without them (or a `<br>` tag), the two lines would join into a single paragraph when rendered.

**Tips and common pitfalls:**

* Many text editors trim trailing whitespace by default. If you’re relying on spaces for a line break, be careful—those spaces might be removed on save. In such cases, using an explicit `<br>` is safer.
* Do not use multiple `<br>` tags for extra blank lines. Instead, add a completely blank line to separate paragraphs (which creates a blank line in output).
* In lists or other contexts, if you need a line break *within* a list item, you can use the same technique (a double space or `<br>` at the end of a line in the list). Ensure the next line is indented properly (see **Lists** below for indentation rules).

</details>

<details>
 
<summary>

### Emphasis and Text Styles

</summary>

You can emphasize text using *italics*, **bold**, or ***both***. GFM also supports other text styles like strikethrough and even subscripts/superscripts via HTML.

* **Italic:** Wrap text in single asterisks `*like this*` or single underscores `_like this_` to italicize. *(Both `*` and `_` work, but be consistent.)*
* **Bold:** Wrap text in double asterisks `**like this**` or double underscores `__like this__` for bold.
* **Bold + Italic:** Triple asterisks `***like this***` (or combinations like `**_text_**`) will bold and italicize the text simultaneously.
* **Strikethrough:** Wrap text in double tildes `~~like this~~` to put a line through it (useful for ~~mistakes~~ updates).
* **Underline:** Markdown doesn’t have a native underline, but GitHub allows certain HTML. You can use the `<ins>` tag: `<ins>underlined text</ins>` will appear <ins>underlined</ins>.
* **Subscript:** Use HTML `<sub>` tags. For example, `H<sub>2</sub>O` renders as H<sub>2</sub>O.
* **Superscript:** Use HTML `<sup>` tags. For example, `X<sup>2</sup>` renders as X<sup>2</sup>.

**Examples:**

```md
_Italic_ and *also italic*  
**Bold** and __bold too__  
***Bold and italic***  
~~Strikethrough~~ text  
This is <ins>underlined</ins> text  
E = mc<sup>2</sup> is the theory of relativity  
Formula for water is H<sub>2</sub>O
```

These will render as: *Italic* and *also italic*, **Bold** and **bold too**, ***Bold and italic***, ~~Strikethrough~~ text, This is <ins>underlined</ins> text, E = mc<sup>2</sup>, and H<sub>2</sub>O respectively.

**Notes and best practices:**

* You can use either `*` or `_` for emphasis, but be mindful: underscores can sometimes be misinterpreted if they touch alphanumeric characters. For example, `this_is_not_italic` will **not** italicize the middle part on GitHub because GFM avoids interpreting underscores as emphasis when inside a word. Using asterisks (`this*is*not*italic`) or adding spaces (`this _is not_ italic`) can avoid confusion.
* **Do not mix too many styles at once.** It can make text harder to read. Use bold for key points or headings, italics for *emphasis* or definitions, and reserve strikethrough for indicating removal or completed tasks.
* If you need **highlighted text** (like a marker pen effect), GFM doesn’t provide a dedicated syntax, but you can emulate it with HTML: `<mark>highlighted text</mark>` may render with a highlight background (if supported). Use sparingly, as this isn’t standard across all Markdown viewers.

</details>

<details>
 
<summary>

### Blockquotes

</summary>

Blockquotes are used to indicate quoted text, epigraphs, or even as simple call-out boxes. On GitHub, a blockquote is created with the `>` symbol at the start of a line:

```md
> This is a quote from a famous person.
> 
> It can stretch multiple lines, and you 
> just keep adding `>` at the start.
```

Rendered, this will appear as an indented block with a vertical gray bar on the left. For example:

> This is a quote from a famous person.
>
> It can stretch multiple lines, and you
> just keep adding `>` at the start.

**Multi-paragraph quotes:** Make sure to include a `>` before every new line or paragraph you want to include in the quote. If you leave a blank line without `>`, the quote will break out of the blockquote.

**Nesting blockquotes:** You can nest quotes (a quote inside a quote) by adding extra `>` levels:

```md
> Outer quote level 1
>> Nested quote level 2
>>> Nested quote level 3
```

Each additional `>` adds another indent level (rendered with multiple gray bars).

**Usage tips:**

* Use blockquotes in issue comments to quote previous text or code. *(Pro tip: In GitHub conversations, you can select text and press `r` to automatically quote it in a reply.)*
* Blockquotes can contain other formatting like **bold** or `code` or even lists. Just put the `>` before each line of the formatted content.
* **Do** put a blank line after a blockquote section unless another blockquote or list immediately follows. This ensures the following text isn’t accidentally included in the quote.
* **Don’t** overuse blockquotes just for indentation or styling. If you want an indented section for design purposes, consider using a `<blockquote>` with a style (if allowed) or a list.

</details>

<details>
 
<summary>

### Lists

</summary>

Lists are a fundamental way to organize information. GFM supports **unordered lists** (bullets), **ordered lists** (numbered), and **task lists** (checklists).

#### Unordered Lists (Bulleted)

Use a dash (`-`), plus (`+`), or asterisk (`*`) followed by a space to create a bullet point. All three symbols work the same; choose one and stick to it for consistency.

```md
- Item one
- Item two
* Item three
+ Item four
```

All the above will render as bullets. (Mixing symbols won’t change the appearance – they’ll all show as bullet points. It’s just a stylistic choice in the source.)

**Example:**

* Item one
* Item two
* Item three
* Item four

*(In the source above, we used `-` for first two and `*` or `+` for others, but they all show as a common list.)*

#### Ordered Lists (Numbered)

Numbered lists are created by starting lines with a number followed by a period and a space. For example:

```md
1. First item
2. Second item
3. Third item
```

Rendered, you’ll see a numbered list:

1. First item
2. Second item
3. Third item

**Important:** You can actually use any numbers and Markdown will automatically order them. For example, you could write `1. First`, `1. Second`, `1. Third` – GitHub will still render them as 1, 2, 3. The *first* number you use typically determines the start count and the rest are ignored for numbering. This means:

* If you want to start a list at a number other than 1 (say 5), you can: start the first item with `5.` and the rendered list will begin at 5. Subsequent items can still be numbered `1.` or sequentially; the output will continue from 5. (This is an advanced use; often not needed unless your list continues numbering from a previous list or you have a specific ordering).
* A common practice is to just use `1.` for all items in your source. This makes maintenance easier (you don’t have to renumber every item if you insert one in the middle), and the output will still be properly numbered **1, 2, 3,…**.

**Example using one for all items:**

```md
1. First step
1. Second step
1. Third step
```

Renders as:

1. First step
2. Second step
3. Third step

*(The source used “1.” each time, but the output is incremented.)*

#### Nested Lists

You can create nested sub-lists by indenting items under other list items. Nested lists are useful for outlines or multi-level tasks.

**How to nest:** Indent the line of the sub-item by **four spaces** (or one tab, which GitHub treats as 4 spaces) *relative to the start of the parent item’s text*. For example:

```md
1. First item
    - First sub-item under first item
        * Sub-sub-item under first sub-item
2. Second item
```

In the above, the dash for the sub-item is indented 4 spaces from the “1.” of the parent. The `*` for the sub-sub-item is indented 8 spaces (4 more) to nest under the sub-item.

**Rendered result:**

1. First item

   * First sub-item under first item

     * Sub-sub-item under first sub-item
2. Second item

**Guidelines for nesting:**

* Ensure there’s a **blank line before the start of a list**, especially if it follows a paragraph or other block. Missing a blank line can cause the list to not render properly or to continue the previous paragraph.
* For each nesting level, indent by at least 4 spaces. You can use more for alignment, but no fewer. GitHub’s web editor and many text editors allow you to highlight lines and press `Tab` to indent or `Shift+Tab` to outdent, which inserts the right amount of spaces.
* If a parent list is numbered with multiple digits (e.g., “100. Item”), you might need to indent sub-items more than 4 spaces. Essentially, the sub-item bullet should align under the first character of the parent item’s text (not under the number). For example, with “100. Item”, there are 5 characters before the text (“100.␣”), so you’d indent sub-items 5 spaces to nest properly.
* You can nest mixed types (an ordered list under a bullet or vice versa). The syntax is flexible as long as indentation is correct.

**Common pitfalls:**

* Using tabs vs spaces inconsistently for indentation can cause rendering issues. Prefer spaces for predictability (most editors insert spaces when you press Tab in Markdown).
* Forgetting a space after the bullet or number. Always put a space after `-`, `*`, `+`, or after the dot in `1.`.
* If your list items aren’t rendering as lists, check for stray characters or formatting. For example, `-item` (no space) won’t form a list; it will just show “-item” in text.

</details>

<details>
 
<summary>

### Task Lists (Checklists)

</summary>

Task lists are a special feature of GFM to create checkboxes. They are extremely useful for tracking to-dos in issues or project boards, and for README checklists.

**Syntax:** Begin a list item with `[ ]` for an unchecked box or `[x]` (lowercase 'x') for a checked box. You must include a space after the closing bracket, and the item must be part of a list (bullet or numbered).

```md
- [ ] Write the introduction
- [x] Proofread the document
```

This renders as:

* [ ] Write the introduction
* [x] Proofread the document

On GitHub, an unchecked box appears empty and a checked box is filled with a checkmark.

**Interactive behavior:** In **issues, pull requests, and discussions**, these checkboxes are clickable. You (and others with access) can tick them off to mark tasks as done. When you click a box, GitHub will update the Markdown behind the scenes by inserting or removing the `x`. This is great for project tracking. For example, if you list tasks in an issue, GitHub will show progress (like “3/5 tasks complete”) in some views. In **README files or other non-interactive markdown**, the checkboxes will render, but clicking them won’t change the file (they are static).

**Tips:**

* Always include a space between the brackets and the task description. `- [ ]Task` (no space) will not render correctly; it must be `- [ ] Task`.
* You can mix task items with regular list items, but be careful with formatting. For example, a bullet list can contain some items that are tasks and others that aren’t.
* Task lists can be nested, too. Indent the `- [ ]` item under another list item to create a sub-task list.
* If your task list isn’t rendering, ensure there’s an empty line before the list and that you have the correct bracket format. A common mistake is forgetting the space after the brackets or not using a hyphen/number to denote the list item.

**Do’s and Don’ts:**

* **Do** use task lists in issue descriptions to break down work. It’s satisfying and clear to check items off as you complete them.
* **Don’t** rely on task lists for sensitive state tracking if the repository is public—anyone with edit rights on the issue could check/uncheck items. It’s mainly for collaborative convenience, not security.

</details>

<details>
 
<summary>
 
### Code and Syntax Highlighting

</summary>

Displaying code or command-line output in Markdown requires special formatting so it’s shown as text, not executed or formatted as prose. GFM provides inline code formatting and multi-line code blocks, with optional syntax highlighting.

#### Inline Code

For short snippets of code or commands within a sentence, wrap them in **single backticks** (`` ` ``). For example:

```md
Please run the `npm install` command before starting the server.
```

This will render as: Please run the `npm install` command before starting the server.

Inline code will appear in a monospaced font with a slightly shaded background, making it stand out from normal text. Use this for filenames, `variableNames`, or short code within paragraphs.

#### Code Blocks

For longer code (multiple lines or blocks of code), use **fenced code blocks**. A fenced code block starts with three backticks on a line by itself and ends with three backticks on a line by itself:

<pre><code>``` 
Your code goes here 
```</code></pre>

*(Note: In this guide we show the backticks fence in a `<pre><code>` block to avoid confusion.)*

Anything between the \`\`\` lines will be rendered verbatim in a code block, preserving whitespace and line breaks, in a monospaced font. Markdown formatting is not processed inside code blocks, so it’s great for examples.

**Example:**

<pre><code>```
function hello(name) {
  console.log("Hello, " + name + "!");
}
hello("GitHub");
```</code></pre>

Rendered, that will show a code block:

```javascript
function hello(name) {
  console.log("Hello, " + name + "!");
}
hello("GitHub");
```

*(In the example above, we also added “\`\`\`javascript” to demonstrate syntax highlighting, which we’ll explain next.)*

**Syntax highlighting:** You can specify a language for the code block by adding the language name right after the opening triple backticks. For example, use <code>`python</code> for Python code, <code>`json</code> for JSON, <code>\`\`\`bash</code> for shell scripts, etc. GitHub’s highlighter will detect the language and colorize the code accordingly. Using the language identifier is optional, but it greatly improves readability for code.

* **Supported languages:** GitHub supports hundreds of languages for highlighting. It uses the open source **Linguist** library, and you can check [GitHub’s languages YAML](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml) for the list of keys (for example, use “js” or “javascript” for JavaScript, “rb” or “ruby” for Ruby, etc.). Common file extensions often work as identifiers.
* If you don’t specify a language, the code block will still render, just without colors. That’s fine for generic text or when you want to avoid any highlighting.
* **Tip:** Use lower-case language names (e.g., `html`, not `HTML`) for compatibility with Jekyll or other processors.

**Preserving special characters:** In code blocks and inline code, you don’t need to escape Markdown symbols (like `*` or `_`). They will be displayed literally. This makes it easy to show Markdown examples or other code without it formatting. If you need to show actual backticks inside a code block, you can use a trick: enclose the code block in a higher number of backticks. For example, to show a triple backtick inside, you can start your fence with four backticks \`\`\`\` and end with four.

**Indented code blocks:** As an alternative to triple backticks, Markdown also allows indenting lines by 4 spaces to create a code block. However, this method is less convenient and can get messy with nested lists. We recommend the fenced \`\`\` style for clarity.

#### Displaying Output or Logs

If you want to show command output or log text, you can use the same code block approach. There’s no separate syntax for “quote code output”; just treat it as a code block (possibly with no specific language).

For example:

<pre><code>``` 
$ git status 
On branch main 
nothing to commit, working tree clean 
```</code></pre>

This will render as a block of console text. Optionally, you might specify `text` or `console` as the language for generic monospaced styling.

#### Diagrams and Other Media in Code Blocks

GitHub now supports embedding certain **diagrams** and rich content by using code block fences with specific “languages”:

* **Mermaid diagrams:** If you label a code block with `mermaid`, GitHub will render the contents as a diagram (flowchart, sequence diagram, etc.) using the [Mermaid](https://mermaid-js.github.io/) library. For example:

  <pre><code>```mermaid
  flowchart TD
      A[Start] --> B{Is it working?};
      B -- Yes --> C[Finish];
      B -- No --> D[Try again];
  ```</code></pre>

  In a Markdown file or issue, the above would display a flowchart diagram rather than raw text. This is incredibly useful for visualizing processes or architectures without leaving Markdown.

* **GeoJSON/TopoJSON maps:** Fencing with `geojson` or `topojson` will render an interactive map if the data is valid geographic data.

* **STL 3D models:** Fencing with `stl` (ASCII STL) will show a 3D model viewer of that object (common for 3D printing models).

For most solopreneurs, **Mermaid diagrams** are a standout feature – you can create flowcharts and diagrams in markdown without any external tool. For other specialized formats, just know that GitHub might render those too.

**Note:** The code block content for diagrams must be properly formatted in the diagram’s syntax. If there’s an error, GitHub will usually just show the code block text or an error message.

**Common pitfalls for code blocks:**

* Forgetting to close the code fence. If you start with `and the code block never ends, the rest of your markdown will likely be broken. Always ensure you have a matching closing`.
* Using tabs or mixing spaces inside a code block is fine (the content will show exactly as is), but remember that leading/trailing spaces are preserved, which could be important for languages like Python or YAML in examples.
* Not allowing a blank line before a code fence can sometimes merge it with previous paragraph in certain cases. It’s generally safe to have a blank line before and after a fenced code block in your markdown source.
* If you see unexpected formatting around a code block, check that you didn’t accidentally indent the `fences or have some stray character. The backticks for fences must start at the beginning of a line (no spaces before`).

</details>

<details>
 
<summary>
 
### Horizontal Rules (Section Breaks)

</summary>

A horizontal rule is a simple line break across the page, useful for separating sections or thematic breaks. In Markdown, you can create one by placing **three or more** hyphens, asterisks, or underscores on a line by themselves:

* `---`
* `***`
* `___`

All three will produce a similar horizontal line. For example, the line you see above “Horizontal Rules” in this guide is generated by three dashes.

**Example:**

```md
First part of section.

---

Next section starts after the horizontal line.
```

This will insert a horizontal line between the two paragraphs.

**Tips:**

* You can use more than three if you like (`----` works too), but at least three are required.
* Make sure the line of dashes or asterisks **does not have other content on it**. If you have `---` within a sentence (like using it as punctuation), it won’t turn into a rule. To be safe, put a blank line before and after the `---` line.
* If you start a line with a dash or asterisk and it isn’t creating a line but a list instead, it might be because there’s text after it or because you used only one or two. Ensure it’s three or more and no other text. Also, if you indent it, it might become a list item’s separator rather than a full-width rule, so put it fully left-aligned.

Horizontal lines are great for readability in longer documents (like release notes or long issue templates) to chunk sections.

</details>

<details>
 
<summary>

### Links and Images

</summary>
 
Links and images in Markdown use a similar syntax, with one key difference: links produce clickable text, while images produce the actual image embedded.

#### Links (Hyperlinks)

There are a few ways to create links:

* **Inline link:** `[link text](URL)`. For example: `[GitHub](https://github.com)` will render as [GitHub](https://github.com).

* **With a title (hover text):** You can add a title after the URL, in quotes. E.g.: `[GitHub](https://github.com "Visit GitHub")`. The title appears as a tooltip on hover.

* **Reference-style links:** This is useful if you have the same URL used multiple times or want to keep your text clean. You write `[link text][label]` in the paragraph, and somewhere else (often bottom of the document) define `[label]: URL "Optional Title"`. For example:

  ```md
  Please visit our [website][home] for more info and our [support page][home] for help.

  [home]: https://example.com "Our homepage"
  ```

  In the text above, both `[website]` and `[support page]` use the same reference `[home]` which is defined once with the URL.

* **Auto-links:** If you just paste a full URL in your text, GitHub will automatically turn it into a clickable link. For example, typing `https://www.github.com` in an issue or README will appear as [https://www.github.com](https://www.github.com) (it may even show as just “github.com” clickable text). You can also put URLs or email addresses in angle brackets like `<https://www.github.com>` or `<user@example.com>`; this ensures they’re recognized as links in most Markdown processors.

**Examples:**

```md
Check out [GitHub Docs](https://docs.github.com "GitHub Documentation").  
Our website is https://example.com for more info.  
Contact us at <support@example.com>.
```

* The first line renders as: Check out [GitHub Docs](https://docs.github.com "GitHub Documentation"). (hovering shows the title).
* The second line: “Our website is [https://example.com](https://example.com) for more info.” where the URL is clickable.
* The third: “Contact us at [support@example.com](mailto:support@example.com).” with the email linked to open a mail client.

**Relative links (in repositories):** If you want to link to another file in your repo, you can use a relative path instead of a full URL. For instance, to link to a file in a docs folder: `[See the guidelines](docs/CONTRIBUTING.md)`. GitHub will convert that into a proper link to the file in your repository. If that file exists, it will route correctly in the web UI. Relative links are great because they automatically work across branches (GitHub adjusts the link to stay on the same branch the viewer is on). Use `../` to go up directories, etc. If you start a link with `/`, it is relative to the repository root.

*Make sure the spelling and path are correct; otherwise, you’ll get a broken link.*  Also, keep the link text on one line – a line break inside the `[text](url)` can break the link.

**Section links (anchors within the page):** As mentioned in **Headings**, each heading has an ID. You can link to a section on the *same page* by using a hash (`#`) and the heading’s ID. For example, to link to a section titled “Features and Benefits”, use something like `[Features](#features-and-benefits)`. This will scroll (or jump) to that heading in the rendered page.

If you want to link to a section in another page, combine the relative or full path with the anchor: `[To Do](docs/PLAN.md#next-steps)` would go to the “Next Steps” section in the PLAN.md file.

**How are heading IDs generated?** GitHub’s rules for transforming a heading into an ID (fragment) are:

* Letters are **lowercased**.
* Spaces and punctuation are mostly **removed or replaced with hyphens** (`-`). (Only alphanumeric characters and hyphens remain in the anchor.)
* If there are multiple headings with the same text, GitHub will add “-1”, “-2”, etc. to make the anchors unique.
* Formatting inside headings is ignored when generating the anchor. E.g., a heading "# **Hello** World!" has anchor `#hello-world`.

Always test your anchor links. On GitHub’s rendered view, clicking an in-page link should jump you to the target. If it doesn’t, you may have mis-typed the anchor. You can copy exact anchor names by hovering over actual headings as mentioned earlier.

**Mentions and issue/PR references (special links):** In **issue or comment contexts**, GitHub will automatically link certain patterns:

* `@username` will link to that GitHub user’s profile (and usually notify them, if applicable).
* `#123` will link to issue or pull request number 123 in the **same repository**.
* `Username/Repo#123` will link to an issue/PR in another repository.
* `GH-123` is an alternative for `#123` (mostly historical, but it works the same).
* Commit hashes (e.g., `a1b2c3d` or the full 40-char SHA) will link to that commit and show a shortened SHA.
* These are called *autolinked references*. They only work in **repositories’ conversations and descriptions** (issues, PRs, commit messages, etc.). In Markdown files (like a README), **@ mentions and issue # references do not auto-link**. This is by design, since READMEs are more static content. So, in a README, if you want to mention a user or issue, you should manually link it (e.g., `[**@octocat**](https://github.com/octocat)` for a user, or use the full issue URL).

**Label and milestone links:** As an aside, linking to certain GitHub URLs can produce special outputs. For instance, if you include a link to a label (e.g., the URL ends in `/labels/bug`), GitHub might render it as a styled label chip. This only works for links to the same repository’s label. It’s a neat trick but not widely used in documentation.

#### Images

Images in Markdown use a syntax similar to links, but with an exclamation mark `!` at the start:

```md
![alt text](image-url.png "Optional title")
```

* **Alt text** (between the `[]`): This should be a description of the image for accessibility (screen readers) or if the image fails to load.
* **Image URL or path** (in `()`): This can be an absolute URL (starting with http/https) or a relative path to an image in your repository.
* **Title** (optional, in quotes): A tooltip text when you hover over the image.

**Example:**

```md
![Our team logo](assets/logo.png "Company Logo")
```

If `assets/logo.png` is in your repo, this will embed the image in the rendered page with “Company Logo” as a hover text.

On GitHub, images will be displayed at their native size or constrained by CSS to fit the layout. Some notes:

* **Relative paths:** Like with links, using relative paths for images is very handy. `![Screenshot](screens/example.png)` will load the image from your repository. If viewers switch branch, GitHub will automatically look for that image in the same branch. If the image is in a private repo, it will only display for users with access.
* **Uploading images:** In issues and comments, you can paste images from your clipboard or drag-and-drop. GitHub will upload it and insert a link like `![](https://user-images.githubusercontent.com/...)`. This is a convenience feature; behind the scenes it uses an image hosting service for GitHub. You can use those links in your Markdown files as well, but keep in mind they are static copies. If you update an image in your repo, you’d need to update the link. So for project docs, prefer adding the image file to the repo and using a relative path.
* **Supported formats:** GitHub supports common image formats: PNG, JPEG, GIF, and SVG. GIFs will play if animated. SVGs are supported (and will be sanitized for security). **Warning:** If you use an external SVG, GitHub may proxy it or sanitize it heavily for security. Usually adding SVGs to the repo and linking them works.
* **Resizing images:** Standard Markdown has no syntax for resizing images (like setting width). GitHub will display the image as-is (or scaled via CSS if it’s too wide for the content area). If you need to control the display size, you must use HTML. For example: `<img src="assets/logo.png" alt="Logo" width="200" />` will display the image at 200px width. This HTML is allowed in GFM.
* **Centering images:** By default, images (like other content) are left-aligned. If you want to center an image, you can use an HTML approach. A simple way is wrapping the image in a `<div align="center">` ... `</div>` or using a `<p align="center">` around it. E.g.:

  ```html
  <p align="center">
    <img src="assets/logo.png" alt="Logo" width="200" />
  </p>
  ```

  GitHub will honor the `align="center"` attribute on a paragraph or div, even though it’s technically deprecated HTML. This is a common trick for READMEs. Alternatively, you could use CSS in a GitHub Pages site, but for content on GitHub.com, the align attribute works since full CSS injection is not allowed.
* **Image links:** If you want an image to be clickable (hyperlinked), you can combine link and image syntax. Simply put the image markdown inside a link: `[![alt](image.png)](https://destination.url)`. This makes the image itself a link.

**Common pitfalls with images:**

* Ensure the path or URL is correct. If the image doesn’t show up, try opening the link in a browser to verify it.
* If your image is very large, consider resizing it or using a lower resolution for the README to improve load times. You can link to the high-res version separately if needed.
* For diagrams or flowcharts, consider using Mermaid (as above) instead of embedding a static image. It keeps your content all in Markdown and text.
* Remember alt text! It’s not just for accessibility (though that’s very important); the alt text will show if the image can’t load, giving context.

</details>

<details>
 
<summary>

### Tables

</summary>

Tables allow you to present data in rows and columns. GitHub Flavored Markdown supports table syntax, which is an extension to basic Markdown.

**Basic table syntax:** Use pipes `|` to separate columns, and use a line of dashes `---` to separate the header row from the body.

```md
| Item       | Price  | In stock |
| ---------- | ------ | -------- |
| Coffee     | $2.50  | Yes      |
| Tea        | $1.75  | No       |
| Pastries   | $5.00  | 3 left   |
```

This will render a table:

| Item     | Price  | In stock |
| -------- | ------ | -------- |
| Coffee   | \$2.50 | Yes      |
| Tea      | \$1.75 | No       |
| Pastries | \$5.00 | 3 left   |

Let’s break down the syntax:

* The first row (before the separator) is the **header row**. It’s typically bold in the output.
* The separator line must have at least three `-` dashes for each column, and the columns are separated by pipes. It’s okay to have more dashes than the column text width.
* The subsequent rows are the table **body**.

**Alignment:** By default, text in table columns is left-aligned. You can control alignment by adding colons `:` in the separator line:

* `:---` means left-align (colon on the left).
* `---:` means right-align (colon on the right).
* `:---:` means center-align (colon on both sides).

Example with alignment:

```md
| Item       | Price   | In stock |
| :--------- | ------: | :------: |
| Coffee     | $2.50   | Yes      |
| Tea        | $1.75   | No       |
| Pastries   | $5.00   | 3 left   |
```

This makes the “Item” column left, “Price” column right (notice the prices line up on the right), and “In stock” centered:

| Item     |  Price | In stock |
| :------- | -----: | :------: |
| Coffee   | \$2.50 |    Yes   |
| Tea      | \$1.75 |    No    |
| Pastries | \$5.00 |  3 left  |

**Tips for tables:**

* It’s a good practice to put a pipe at the beginning and end of each line for clarity, but GFM does not require the leading or trailing `|`. We used them in the examples for neatness.
* All rows must have the same number of `|` columns (including the header and separator). You can leave cells blank, but the pipes have to line up.
* You can use backticks to put code or inline monospaced text in a table cell.
* Tables **do not** support formatting like line breaks within a cell (at least not with pure Markdown). If you need a multiline cell or fancy formatting inside a table, you might have to use raw HTML for the table, or get creative (like using `<br>` inside the cell).
* You can format text in tables (e.g., **bold** or *italic* or links) and it will render, as long as the formatting characters are inside the cell content.
* Be careful with the `|` character itself inside a table cell – it will be interpreted as a column separator. To put a literal pipe in a cell, you can escape it as `\|`.

**Common pitfalls:**

* If a table isn’t rendering and you just see a jumbled mess, check that you have an empty line before the table (tables need to start on a new line, not immediately after text).
* Also ensure that the separator line of dashes has the correct number of columns matching the header. Missing or extra `|` is the usual suspect.
* If text is very long in a column, the table will scroll horizontally on GitHub’s view (tables don’t automatically word-wrap). For very wide content, consider splitting into multiple lines manually with `<br>` or redesigning the table structure.

Despite these limitations, tables are extremely useful for structured information like comparison charts, pricing tables, etc., right inside your README or issue.

</details>



---

## Extended GitHub Markdown Features

GitHub Flavored Markdown offers some **extended features and integrations** beyond basic Markdown. These can help you add interactivity or enriched content to your documentation. Below are some of these advanced tricks:

<details>
 
<summary>

### Emojis

</summary>
 
GitHub supports a vast array of emojis via shortcodes. You might have seen people writing things like `:smile:` or `:rocket:` in issues – those get converted to actual emoji characters or images.

For example:

* `:tada:` becomes 🎉
* `:bug:` becomes 🐛
* `:thumbsup:` becomes 👍 (there’s also a shorthand `:+1:` for 👍 and `:-1:` for 👎).

**Usage:** Just type a colon `:`, then the emoji name, then another colon. As you type on GitHub (in an issue or comment), an autocompletion menu might pop up with suggestions. In a Markdown file (like README), you won’t get autocompletion, but you can refer to an emoji cheat sheet.

GitHub’s own emoji list is extensive (it includes common smileys, objects, flags, and even specific ones like `:octocat:` for the GitHub logo). You can find a list here: [https://github.com/ikatyang/emoji-cheat-sheet](https://github.com/ikatyang/emoji-cheat-sheet) (or many cheat sheets online).

**Examples:**

```md
Great job on this project :smile:! Let's celebrate :tada:.
Need help? Ask for it, don't be shy :raising_hand:.
```

Renders as:
Great job on this project \:smile:! Let’s celebrate \:tada:.
Need help? Ask for it, don’t be shy \:raising\_hand:.

*(The emojis should appear inline if viewed on GitHub – in this text you see the codes literally because we’re in a code block or not rendering here.)*

You can also just use actual Unicode emoji characters (e.g., copy-paste from an emoji picker). Those will display fine too. The advantage of colon shortcodes is that they’re easier to remember/type and are consistent across platforms.

**Notes:**

* Emoji shortcodes are case-insensitive (`:Smile:` works same as `:smile:`).
* Not every single Unicode emoji has a shortcode, but most common ones do.
* If you accidentally type something like `:smile` (missing the ending colon) or a code that doesn’t exist, it will just remain as text. Double-check your spelling if an emoji isn’t showing.
* Emoji in headings: You can include emoji in heading text too (via shortcode or character), and it will show in the rendered heading. For example, `## Welcome :wave:` would put a wave emoji in the heading.

</details>

<details>
 
<summary>
 
### Mentions and References (in detail)

</summary>

We touched on this under links, but here’s a bit more context for **GitHub-specific mentions and references**:

* **@ Mentions:** In issues, PRs, commits, or discussions, typing `@` and a username will notify that user (if they have access or the conversation is public) and create a link to their profile. This is great for drawing someone’s attention. Remember, it doesn’t work in README or static markdown files – there, it will just show as text. So use it in interactive contexts.
* **Issue/PR References:** Typing `#` followed by an issue or PR number will auto-link to that issue/PR within the same repo. If it’s in another repo, use the complete form `owner/repo#number`. These references will also create a “backlink” in the referenced issue showing that it was mentioned (unless you put it in a code block or otherwise escape it). If you want to mention an issue without creating a backlink, a trick is to put a space after the `#` or wrap it in backticks.
* **Commit References:** If you include a commit’s hash (at least 7 characters, the standard short SHA) in a comment or PR description, it will become a link to that commit. It will display as the short SHA. For example, saying “fixed in a1b2c3d” will show as “fixed in a1b2c3d” (blue link). Like issues, cross-repo commit links can be done by full repo name like `owner/repo@SHA` (or `owner/repo@branch` for a branch link).
* **References in commit messages:** If you write “Fixes #123” in a commit message and push it, GitHub will link that and even close issue #123 when the commit lands on the default branch (this is a special integration, beyond just formatting).

These shortcuts save time and keep discussions interconnected. They are part of GFM’s “autolinked references” but be mindful of context (works only in places where GitHub knows the repository context, not in general markdown files).

</details>

<details>
 
<summary>

### Collapsible Sections (Details/Summary)

</summary>

Sometimes your document might have large sections that are optional or details that not everyone needs to see by default. GitHub allows the use of the HTML `<details>` and `<summary>` elements to create a collapsible section (like a dropdown or accordion effect).

**Example:**

```md
<details>
<summary>Click here for more details</summary>

Here is the detailed content that is hidden by default. 
It can contain **Markdown** formatting, code, or even other blocks.

- Point A
- Point B

</details>
```

Rendered on GitHub, this will show a small disclosure triangle and the “Click here for more details” text. When clicked, it expands to reveal the content inside the `<details>`.

**Important notes for using details/summary:**

* The `<summary>` tag’s text is what is always visible (the clickable label). Put a short, informative title there.
* All content that should be collapsible goes after the `</summary>` and before `</details>`. You can include multiple paragraphs, lists, code blocks, etc., inside.
* Make sure to close the `</details>` tag properly. If you forget the closing tag, you might break the rest of your Markdown layout.
* You can nest a `<details>` inside another, but be cautious — too many nested collapsibles can be confusing.
* This feature is natively supported in most browsers, and GitHub does allow it. It’s great for things like “See example code” or “View output” without cluttering the main view.

This is technically HTML, but it’s a very useful extension that many people use in GitHub README files to keep them concise.

</details>

<details>
 
<summary>

### Alerts (Admonition Blocks)

</summary>
 
GitHub has a special markdown extension for “alerts” or “admonitions” – colored callout boxes for highlighting information like notes, tips, warnings, etc. This is similar to what you might have seen in docs or static site generators.

The syntax uses a blockquote that starts with a specific marker:

```md
> [!NOTE]
> **Note:** Here is some additional information for readers.
```

The above produces a specially styled note box. GitHub supports these types (the marker in brackets sets the type):

* `> [!NOTE]` – Renders a **Note** box (often blue or gray info icon).
* `> [!TIP]` – Renders a **Tip** box (green lightbulb icon perhaps).
* `> [!IMPORTANT]` – Renders an **Important** box (yellow or blue star/icon).
* `> [!WARNING]` – Renders a **Warning** box (orange warning icon).
* `> [!CAUTION]` – Renders a **Caution** box (red stop or warning icon).

Immediately after this marker line, on the next line you continue the quote with your content for the alert. Typically you’ll make the first line of content a **bold title** like "**Note:**" or "**Tip:**" (or you can rely on the icon and styling). Subsequent lines that are part of the alert should all start with `> ` as well, until you end the block.

**Example of a full alert block:**

```md
> [!WARNING]
> **Warning:** Ensure you backup your data before proceeding. 
> This action is irreversible.
```

Rendered on GitHub, it will appear as a distinct colored box with an icon and the content. See below:

> [!NOTE]
> This is a note.

> [!TIP]
> This is a tip.

> [!IMPORTANT]
> This is important information.

> [!WARNING]
> This is a warning.

> [!CAUTION]
> This is a caution.

Each alert type has a different icon and color to convey its purpose.

**Guidelines for alerts:**

* Use them sparingly to emphasize *critical* information. Overusing colored callouts can overwhelm or reduce their impact. The GitHub Docs team recommends no more than one or two alerts per article.
* Don’t stack alerts back-to-back (one immediately after another) – it can look bad and might merge strangely. Always have normal content between them.
* You cannot nest alerts (and you shouldn’t try to put one inside a blockquote or list). They need to stand on their own.
* These alerts are relatively new in GFM. If you export your Markdown to another system, those systems might not recognize this syntax, as it’s not part of core Markdown. In such cases, the `[!NOTE]` text might just appear as plain text.
* Ensure the marker like `[!NOTE]` is at the start of a line, following a `> `. If you indent an alert or put it inside a list, it might not render as an alert box.

Using alert boxes can make your README or documentation friendlier by drawing attention to important tips, but use them thoughtfully.

</details>

<details>
 
<summary>
 
### Footnotes

</summary>
 
Footnotes allow you to add references or asides without cluttering the main text. They appear as superscript numbers in the text, which link to the full note at the bottom of the page. GFM now supports footnotes in all Markdown files (except in GitHub Wikis).

**Syntax:**

1. Choose an identifier for your footnote (usually a number or word) and insert it in the text in square brackets with a leading `^`. For example: `[^1]` or `[^note]` in your paragraph.
2. Add the footnote’s full text elsewhere in the document (commonly at the bottom) by starting a line with the same identifier in square brackets, a colon, and a space. Like: `[^1]: This is the footnote text.`

**Example:**

```md
Markdown is a lightweight markup language[^1] that you can use to format text.

[^1]: It was created by John Gruber and Aaron Swartz in 2004.
```

In the text, `[^1]` will appear as a little superscript “1”. Clicking it (on GitHub’s rendered view) jumps to the footnote at the bottom, which is numbered and shown as “1. It was created by John Gruber...”. There will also be a little backlink arrow from the footnote back to where it was referenced.

**Multiple footnotes:** You can have as many as you need. Use different labels (numbers or words) for each. If you reuse the same footnote reference label in multiple places, each reference will point to the same footnote definition.

**Multi-line footnotes:** If a footnote is long, you can write it on multiple lines. To continue a footnote definition onto another line, indent the subsequent lines by 4 spaces (or 2 spaces, as GitHub’s example shows):

```md
[^2]: This is a footnote that has  
    multiple lines. Note that we’ve indented
    the second line.
```

The rendered footnote will combine those lines into one continuous note. (The two spaces at the end of the first line above ensure a line break in the note; footnotes themselves need a similar handling for line breaks.)

**Best practices:**

* Place your footnote definitions at the end of the document or section. While the syntax allows you to put them anywhere, keeping them at the bottom (or all together) is conventional and easier to manage.
* Footnotes are for additional info or citations. If it’s critical info, consider putting it in the main text or an alert instead – not everyone will click footnotes.
* Remember, **footnotes are not supported in GitHub Wikis**. They will just appear as literal `[^1]` text there. In regular repo Markdown and issues, they work fine.
* Don’t use overly long footnotes or too many; they can clutter the bottom of your README. If you have a lot of references (like academic style), you might be writing something that’s better served by a documentation site or wiki.

</details>

<details>
 
<summary>
 
### Escaping and Literal Characters

</summary>

Sometimes you want to write Markdown syntax characters literally, without them turning into formatting. For instance, you might want to show an asterisk `*` or a backtick `` ` `` in your content.

**Escape with backslash:** In GFM (and most Markdown), you can put a backslash `\` before a formatting character to **escape** it. This tells the renderer to treat it as plain text.

Characters you might need to escape include:

```
\  `  *  _  { }  [ ]  ( )  #  +  -  .  !  |  >  ~  (and maybe others in certain contexts)
```

For example:

* To show a literal asterisk, write `\*`.
* To show backticks, you might do `` \` `` or wrap them in a code span.
* If you want to write something like “**Not Bold**” with the asterisks visible, you’d write `\*\*Not Bold\*\*` which renders as **Not Bold** (with stars).

**Example escapes:**

```md
Let\'s rename \*our-new-project\* to \*our-old-project\*.
```

This renders as: Let’s rename *our-new-project* to *our-old-project*. (Without the backslashes, that text would try to italicize “our-new-project”.)

**Where escaping doesn’t work:** One quirk – GitHub **issue titles** and **PR titles** do not process Markdown, so you can’t format them anyway. Thus, you don’t need to escape characters there for Markdown’s sake (they won’t render as formatting regardless). But in normal Markdown content, use `\` to escape as needed.

If you find that some text is unexpectedly bold or a link, check for unintentional Markdown triggers:

* URLs with underscores can accidentally italicize part of them if not careful. Wrapping the URL in `< >` or placing it in a code span avoids that.
* Starting a line with `-` or `1.` can trigger lists. If you want a literal “1. Something” at start of line, you might prefix it with a hidden character or escape the dot. Alternatively, put a backslash: `1\. Something` to prevent list formatting.
* The `<details>` and other HTML tags we introduced should be treated as raw HTML. If you want to show an example of `<details>` in your document, you may need to escape the `<` as `&lt;` in that context, or wrap the snippet in a code block.

In general, if something is getting formatted and you don’t want it to, try escaping or using a code span to isolate it.
</details>

<details>
 
<summary>

### Comments (Hiding Content)

</summary>
 
You can include comments in your Markdown that will **not** appear in the rendered output. This is handy for leaving notes to yourself or collaborators within the raw text.

GitHub respects HTML comments: anything between `<!--` and `-->` will be hidden.

**Example:**

```md
<!-- This section needs review. -->
The quick brown fox jumps over the lazy dog.
```

When rendered, only “The quick brown fox jumps over the lazy dog.” will appear. The comment is completely removed.

Use cases:

* Adding a “TODO” note in a README draft that you don't want visible.
* Storing some reference info or alternative text that might be used later.
* Commenting out a section you want to temporarily disable from rendering (though for large blocks, it might be easier to just remove it or use a separate draft).

Just be careful: **comments are still visible in the raw Markdown** (e.g., if someone views the source on GitHub or edits the file). They are not secure or hidden from someone determined – it’s just hidden in the normal reading view.

</details>

<details>
 
<summary>

### Differences by GitHub Context

</summary>
 
By now, we’ve highlighted a few differences in how Markdown behaves depending on where it’s used. Here’s a quick summary:

* **Repository Markdown files (.md):** Like README, CONTRIBUTING, etc. They support all the GFM features (tables, task lists, footnotes, etc.). However, they require the strict syntax for line breaks (two spaces or `<br>`). Also, things like @mentions and issue references will not auto-link in these files, because the file is rendered in a standalone context (not part of a specific issue thread). Relative links in these files are context-aware (branch-specific).
* **Issues, PR descriptions, and comments:** These also support most GFM features (tables, lists, headings, etc.). They automatically convert single line breaks to `<br>` for convenience, so you can write like you would an email. They also allow @mentions, issue references (#), and other autolinks, which is great for cross-referencing. One thing: the **title** of issues/PRs does not process Markdown beyond linking issue numbers or references. So you can’t have a bold text or list in an issue title.
* **GitHub Wikis:** Wikis use GFM as well, but historically they had some differences. Notably, as per GitHub docs, footnotes are **not supported** in wikis, and possibly some newer extensions like alerts may not work in wikis if the wiki system hasn’t been updated. Wikis also allow some additional syntax like \[\[WikiLink]] for linking pages. If you use a wiki, check its specific help. But basic formatting is the same.
* **GitHub Pages (Jekyll):** If you turn your Markdown into a GitHub Pages site, it’s processed by Jekyll (by default) which might use a slightly different Markdown engine (often Kramdown or the like). GitHub Pages by default *enables* GFM features nowadays, but certain things like the alert boxes `[!NOTE]` might not show up on a Jekyll site unless you use a plugin or a different engine that supports it. So, if you plan to reuse your GitHub Markdown content on a static site generator, double-check compatibility or enable the needed extensions.
* **GitHub Actions logs:** If you output Markdown in an Actions log (for example, from a script), note that the logs are in plain text and do **not** render Markdown formatting. So if your CI script echoes `## Heading` or `**bold**`, the log will just show the raw characters. (GitHub Actions has its own annotation syntax for things like highlighting lines or creating foldable sections, which is separate from Markdown.) Keep this in mind if you’re trying to prettify logs.
* **Email notifications:** People watching a repo get emails for issue comments, etc. Those emails do their best to render the Markdown, but some things (like task list interactivity or details collapsibles) might not translate perfectly in email format. It’s a minor point, but worth knowing that the primary consumption of your content is on the web interface; alternate channels might show a slightly flattened view.


</details>

---

## General Tips, Do’s and Don’ts

To wrap up, here are some general guidelines for writing effective Markdown on GitHub:

<details>
 
<summary>
 
### Do’s ✔️

</summary>

* **Do structure your documents with headings and lists.** This makes them easy to navigate. Use a Table of Contents if the document is very long (you can manually create one by listing links to the sections).
* **Do use consistent formatting.** For example, if you choose `-` for bullets, use it throughout a document. If you use sentence case for headings, keep that style.
* **Do include alt text for images** and useful link text for hyperlinks. This improves accessibility and user experience (avoid link text like “click here”; instead, describe what it is).
* **Do test your Markdown.** GitHub has a Preview tab when editing files and comments – use it! This helps catch issues like a list not rendering or a table being misaligned. For README files, you can even use online Markdown previewers or editors to ensure it looks as intended.
* **Do keep lines reasonably short in the source.** This is optional, but many people keep markdown text wrapped at \~80-120 characters per line for easier diffs and editing. (This doesn’t affect output since line breaks without two spaces are treated as a single paragraph.)
* **Do comment your Markdown (with `<!-- ... -->`)** if needed to clarify complex sections in the source for other maintainers (or your future self).
* **Do leverage GFM features** like tables and task lists to make information clearer. A simple table can often convey data better than a hard-to-read list.
* **Do use HTML as a fallback** when Markdown can’t achieve what you need, but...
* **Do keep it simple.** The beauty of Markdown is its simplicity. Often, a plain list or paragraph is better than a heavily formatted concoction.

</details>

<details>
 
<summary>

### Don’ts ❌

</summary>

* **Don’t overuse emphasis.** If everything is **bold** or *italic*, nothing stands out. Use them sparingly for keywords or important points.
* **Don’t use HTML/CSS for big styling changes.** GitHub strips most styling for security and consistency. For example, you cannot add custom CSS classes or `<style>` tags. And if you attempt things like `<font color="red">`, it won’t work. Stick to the allowed HTML elements (we covered many: <ins>, <sub>, etc.) and accept that GitHub’s style is fixed.
* **Don’t include confidential info** in comments or hidden sections, thinking they won’t show. Remember that all content in a repo (even if not rendered) is accessible in the source.
* **Don’t nest block elements in ways that Markdown doesn’t allow.** For example, you generally can’t put a table directly inside a list without some trickery, or a heading inside a blockquote might need an empty line. If something looks broken, try a different structuring (maybe break it into separate sections).
* **Don’t forget about mobile users.** GitHub content is responsive, but very wide tables or images might overflow on mobile. Consider adding line breaks or using smaller images if a lot of your audience might view on phones.
* **Don’t rely on line breaks for spacing.** In HTML/Markdown, a single blank line = new paragraph, multiple blank lines collapse to one. If you need more spacing for aesthetic reasons, that’s a CSS matter (which you can’t control on GitHub). So, don’t add 5 blank lines thinking it will give a big gap – it won’t (you’ll just get one blank line).
* **Don’t use heading tags out of order just to change text size.** Some might be tempted to use a lower-level heading because it’s smaller text. Instead, use the proper level for the document structure. All headings can be styled with bold/italic if needed, or just accept the size hierarchy.
* **Don’t put too much in one line** (in source) if it’s a complex table or list. It’s easier to edit if you break after pipes or list items, etc. (Though it doesn’t affect render, it affects maintenance.)

</details>

<details>
 
<summary>

### Troubleshooting Formatting Issues

</summary>

Even experienced Markdown users hit snags. Here are some common problems and how to fix them:

* **“My list isn’t showing as a list!”** – Ensure you have a blank line before the list starts. Make sure each list item starts with a valid bullet (`-`, `*`, `+`) or number+dot, followed by a space. Check that you’re not inside a code block or blockquote unintentionally.
* **“My heading text is showing `#` signs instead of a heading.”** – You likely forgot the space after the `#`. For example, `##Heading` won’t work, it needs to be `## Heading`. Alternatively, if you meant to show a literal `#`, escape it with a backslash.
* **“Line breaks aren’t working in my README.”** – Remember, in files (like README), you need two spaces at end of line or `<br>`. If you’re sure you did that, maybe your editor trimmed them. Try `<br>` as a safer option. Or verify in GitHub’s preview – sometimes the issue is that the line actually doesn’t have two spaces.
* **“The table looks wrong / columns don’t align.”** – Count the pipes! Check each row has the same number. Also, a common mistake is forgetting the separator line of dashes or writing it incorrectly. Every column needs some dashes. Also, make sure the content of cells doesn’t accidentally include a `|`. If it does, escape that `|` with a backslash.
* **“My code block isn’t rendering, I see \`\`\` in text.”** – That means your fence is not being recognized. Check for matching backticks (opening and closing). Also ensure you didn’t indent the backticks; fences must start at the margin (or at least, if inside a list, they should be indented properly under a list item).
* **“Footnotes aren’t appearing / just showing as \[^1].”** – This could happen if you’re on a platform that doesn’t support them (like Wiki). Or if you forgot to add the definition `[^1]: ...` somewhere. Also, each footnote reference `[^1]` needs a corresponding definition; otherwise it won’t know what to render.
* **“An HTML tag I used isn’t showing or is removed.”** – GitHub sanitizes HTML for security. Forbidden elements (script, iframe, form, style, etc.) will be stripped out. If you tried to embed a video with `<iframe>` or style text with `<style>` or add a script, GitHub will not allow it for security reasons. You’ll need to use a different approach (like link to a video or use a GIF, etc.). If you attempted something like a `<center>` tag and it didn’t work, maybe use the `align` attribute method shown earlier instead.
* **“Markdown in HTML isn’t working.”** – If you wrap text in an HTML tag, the content inside generally won’t be processed as Markdown. For example, `<div>*Hello*</div>` will likely just show "*Hello*" with asterisks rather than italic, because once you open an HTML block, Markdown parsing can be disabled inside it. Some elements do parse inside (like inside a `<summary>` tag Markdown works for simple styling). But as a rule, **Markdown inside raw HTML may not render**. The workaround is usually to avoid mixing or close the HTML tag before continuing with Markdown. For complex layouts, sometimes it’s easier to do the whole section in HTML.

Finally, remember that you can always **view the source** of well-formatted GitHub README files or documentation by others for inspiration. On any GitHub Markdown page, clicking **“Raw”** will show you the exact Markdown they wrote. This can be a great way to learn tricks.

If something in your Markdown still isn’t right, chances are someone on Stack Overflow or the GitHub Community has asked a similar question – a quick web search often helps, as you saw throughout this guide.

</details>

---

With this reference, you should be well-equipped to write clear and professional Markdown on GitHub. Keep practicing by updating your README files, writing documentation, and participating in discussions. Over time, using GFM will become second nature, and you’ll be able to focus on your content without worrying about the formatting.

Happy writing in Markdown, and best of luck with your projects! 🎉
