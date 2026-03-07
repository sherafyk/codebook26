# The Complete Beginner's Guide to MarkupGo: Creating Dynamic Images and PDFs from HTML Templates

## Table of Contents
1. [Introduction & Mental Model](#introduction-mental-model)
2. [Quick Start: Your First Working Template](#quick-start)
3. [Canvas Sizing for Images vs PDFs](#canvas-sizing)
4. [Tailwind CSS Setup and Configuration](#tailwind-setup)
5. [Working with Fonts](#fonts)
6. [Dynamic Data with Handlebars](#handlebars)
7. [Positioning Elements](#positioning)
8. [Working with Images](#images)
9. [Text Overflow Handling](#text-overflow)
10. [Visual Polish: Shadows and Effects](#visual-polish)
11. [Z-Index Layering](#z-index)
12. [Render Options for Images and PDFs](#render-options)
13. [PDF Headers, Footers & Page Numbers](#pdf-headers-footers)
14. [Multi-Page PDF Layouts](#multi-page)
15. [Ready-to-Use Template Blueprints](#blueprints)
16. [Magic URL: No-Code Rendering](#magic-url)
17. [Reliability Settings](#reliability)
18. [Image Transformation API](#image-transformation)
19. [Essential Utility Toolkit](#utility-kit)
20. [API & Node.js Client](#api-node)
21. [Style Starters](#style-starters)
22. [Format Selection Guide](#format-selection)
23. [Best Practices](#best-practices)
24. [Debugging Checklist](#debugging)
25. [Complete Template Skeleton](#template-skeleton)

---

## 1. Introduction & Mental Model {#introduction-mental-model}

### What is MarkupGo?

**MarkupGo** is a service that renders your HTML/CSS/JavaScript code in a headless browser (Chromium), then captures it as an image (PNG/JPEG/WebP) or PDF document . Think of it like this:

- You write HTML (the structure and content)
- You style it with CSS (colors, fonts, layouts)
- MarkupGo takes a "screenshot" of your design
- You get a perfect image or PDF file

### What You're Actually Building

Unlike regular websites that adapt to different screen sizes, MarkupGo templates are more like **graphic design canvases** with fixed dimensions . You're creating:

- **Templates**: Reusable HTML layouts with placeholder variables (like `{{name}}`)
- **Context**: The actual data that fills in those placeholders
- **Rendered Output**: The final image or PDF with your data

### Key Concepts for Beginners

**HTML (HyperText Markup Language)**: The structure of your content. It uses tags like `<h1>` for headings and `<p>` for paragraphs.

**CSS (Cascading Style Sheets)**: The styling that makes things look good. It controls colors, sizes, fonts, and positioning.

**JavaScript**: Programming language for interactivity. In MarkupGo, mainly used for loading libraries like Tailwind CSS.

**Headless Browser**: A web browser without a visible window - it runs in the background to render your HTML.

**Context Variables**: Placeholders in your template (like `{{title}}`) that get replaced with real data when rendering.

---

## 2. Quick Start: Your First Working Template {#quick-start}

Let's build a social media preview card from scratch. This is a complete, working template :

```html
<!doctype html>
<html>
  <head>
    <!-- Load Tailwind CSS (a styling framework) via CDN -->
    <script src="https://cdn.tailwindcss.com?plugins=typography,aspect-ratio,line-clamp"></script>
    
    <!-- Configure Tailwind with custom brand colors -->
    <script>
      tailwind.config = {
        theme: { 
          extend: { 
            colors: { 
              brand: '#7C3AED'  // Your custom purple color
            } 
          } 
        }
      }
    </script>
    
    <!-- Load Google Fonts for better typography -->
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap" rel="stylesheet">
  </head>
  
  <body class="antialiased">
    <!-- Create a fixed 1200x630 pixel canvas (standard social media size) -->
    <div class="relative w-[1200px] h-[630px] mx-auto overflow-hidden bg-slate-900 text-white font-['Inter',_sans-serif]">
      
      <!-- Background image layer -->
      <div class="absolute inset-0 bg-[url('{{bg}}')] bg-cover bg-center"></div>
      
      <!-- Dark overlay for text readability (35% black) -->
      <div class="absolute inset-0 bg-black/35"></div>

      <!-- Main title positioned from bottom-left -->
      <div class="absolute left-[80px] bottom-[140px] max-w-[880px]">
        <h1 class="text-[72px] leading-[1.05] tracking-[-0.02em] font-bold
                   [text-shadow:0_4px_16px_rgba(0,0,0,0.45)]">
          {{ title }}
        </h1>
      </div>

      <!-- Tagline in brand color -->
      <div class="absolute left-[80px] bottom-[60px]">
        <p class="text-brand text-[36px] font-bold leading-tight">{{ tagline }}</p>
      </div>
    </div>
    
    <!-- Optional: Wait for fonts to load before rendering -->
    <script>
      document.fonts && document.fonts.ready?.then(() => (window.__ready__ = true));
    </script>
  </body>
</html>
```

### Understanding Each Part

1. **Tailwind CSS**: Loaded via CDN with plugins for typography and line clamping
2. **Fixed Canvas**: Exactly 1200×630 pixels (Facebook/LinkedIn optimal size)
3. **Layering**: Background image → dark overlay → text (ensures readability)
4. **Variables**: `{{bg}}`, `{{title}}`, `{{tagline}}` are replaced with actual content
5. **Precise Positioning**: Using pixel values like `left-[80px]` for exact placement

### Adding Libraries (Alternative Method)

You can also add libraries through MarkupGo's template settings :
- **JS Libraries**: Add the Tailwind CDN URL in the libraries.js array
- **CSS Libraries**: Add any additional stylesheets

Both inline (in HTML) and library array methods work equally well.

---

## 3. Canvas Sizing for Images vs PDFs {#canvas-sizing}

### For Images (PNG/JPEG/WebP)

Always use **fixed pixel dimensions** . Common sizes:

| Platform | Dimensions | Use Case |
|----------|------------|----------|
| Open Graph (Facebook/LinkedIn) | 1200×630px | Link preview cards |
| Twitter/X Card | 1200×600px | Tweet link previews |
| Instagram Square | 1080×1080px | Feed posts |
| Instagram Story | 1080×1920px | Vertical stories |
| HD Banner | 1920×1080px | Website heroes |

**Example setup:**
```html
<!-- Open Graph social card -->
<div class="relative w-[1200px] h-[630px] overflow-hidden">
  <!-- Your content here -->
</div>
```

**Important**: Always use `overflow-hidden` to ensure nothing extends beyond your canvas edges.

### For PDFs

PDFs use different units and settings :

```json
{
  "options": {
    "properties": {
      "size": { "width": 210, "height": 297 },  // A4 in millimeters
      "margins": { 
        "top": 10, 
        "bottom": 10, 
        "left": 12, 
        "right": 12 
      },
      "printBackground": true,  // IMPORTANT: Shows background colors
      "landscape": false
    }
  }
}
```

**Key differences:**
- Sizes are in **millimeters**, not pixels
- You can set page margins
- `printBackground: true` is required to show background colors/images
- For single long pages, use `singlePage: true` (note: height calculation may have issues)

---

## 4. Tailwind CSS Setup and Configuration {#tailwind-setup}

### What is Tailwind CSS?

Tailwind CSS is a utility-first CSS framework . Instead of writing traditional CSS:

```css
/* Traditional CSS */
.my-button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
```

You use utility classes directly in HTML:
```html
<!-- Tailwind CSS -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">Click me</button>
```

### Loading Tailwind via Play CDN

The easiest way for MarkupGo templates :

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
<script>
  tailwind.config = {
    theme: { 
      extend: { 
        colors: { 
          brand: '#e868c0',      // Custom pink
          primary: '#0f172a',    // Custom dark blue
          accent: '#fbbf24'      // Custom yellow
        } 
      } 
    }
  }
</script>
```

**Available plugins via CDN:**
- `typography`: Better text styling
- `aspect-ratio`: Maintain aspect ratios
- `line-clamp`: Limit text to specific number of lines
- `forms`: Better form styling

### Arbitrary Values & Properties (Your Precision Tools)

Tailwind's **arbitrary value** syntax lets you use exact values :

#### Arbitrary Values (in square brackets)
```html
<!-- Exact pixel values -->
<div class="w-[1200px] h-[630px]">

<!-- Exact font size -->
<h1 class="text-[64px]">

<!-- Exact positioning -->
<div class="left-[83px] top-[112px]">

<!-- Custom color with opacity -->
<div class="bg-[#0f172a]/90">  <!-- 90% opacity -->
```

#### Arbitrary Properties (CSS you need that Tailwind doesn't have)
```html
<!-- Text shadow for readability -->
<h1 class="[text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">

<!-- Custom CSS property -->
<div class="[mask-type:luminance]">

<!-- Multiple shadows -->
<div class="[box-shadow:0_0_0_1px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)]">
```

**Note**: Use underscores `_` instead of spaces in arbitrary properties.

---

## 5. Working with Fonts {#fonts}

### Loading Custom Fonts

Fonts must be loaded before rendering for consistent appearance :

```html
<head>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Multiple font families -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&family=Roboto+Mono:wght@400;600&display=swap" rel="stylesheet">
</head>
```

### Using Fonts in Your Template

```html
<!-- Primary font -->
<div class="font-['Inter',_sans-serif]">

<!-- Fallback to system fonts -->
<div class="font-['Roboto_Mono',_monospace]">

<!-- Font weights -->
<h1 class="font-bold">        <!-- 700 weight -->
<h2 class="font-semibold">    <!-- 600 weight -->
<p class="font-medium">        <!-- 500 weight -->
<span class="font-normal">    <!-- 400 weight -->

<!-- Fine-tuning typography -->
<h1 class="text-[72px] leading-[1.05] tracking-[-0.02em]">
  <!-- leading = line height, tracking = letter spacing -->
</h1>
```

### Ensuring Fonts Load Before Rendering

Add this script to wait for fonts :

```html
<script>
  // Wait for all fonts to be ready
  document.fonts && document.fonts.ready.then(() => {
    window.__ready__ = true;
  });
</script>
```

Then in your render options:
```json
{
  "waitForExpression": "window.__ready__ === true"
}
```

Or use a simple delay:
```json
{
  "waitDelay": "2s"
}
```

---

## 6. Dynamic Data with Handlebars {#handlebars}

MarkupGo uses **Handlebars** syntax for dynamic content . This lets you create templates with placeholders that get filled with real data.

### Basic Variables

```html
<!-- Simple replacement -->
<h1>Welcome, {{userName}}!</h1>
<p>Your score is {{score}} points</p>

<!-- Nested properties -->
<div>{{user.firstName}} {{user.lastName}}</div>
<img src="{{company.logo}}" alt="{{company.name}}">
```

### Conditional Content (if/else)

```html
<!-- Simple if -->
{{#if isPremium}}
  <div class="bg-gold-500 px-4 py-2 rounded">Premium Member</div>
{{/if}}

<!-- If/else -->
{{#if subtitle}}
  <p class="text-[36px]">{{subtitle}}</p>
{{else}}
  <p class="text-[36px] opacity-50">No subtitle provided</p>
{{/if}}

<!-- Multiple conditions -->
{{#if featured}}
  <div class="badge-featured">Featured</div>
{{else if popular}}
  <div class="badge-popular">Popular</div>
{{else}}
  <div class="badge-standard">Standard</div>
{{/if}}
```

### Loops (each)

```html
<!-- Simple list -->
<ul class="flex flex-col gap-2">
  {{#each items}}
    <li>{{this}}</li>
  {{/each}}
</ul>

<!-- List with properties -->
<div class="grid grid-cols-3 gap-4">
  {{#each products}}
    <div class="border rounded p-4">
      <h3>{{this.name}}</h3>
      <p>${{this.price}}</p>
      <p>{{this.description}}</p>
    </div>
  {{/each}}
</div>

<!-- Access index -->
{{#each items}}
  <div>Item {{@index}}: {{this}}</div>
{{/each}}
```

### Advanced: Lookup Helper

```html
<!-- Access array by index -->
{{lookup cities 0}}  <!-- First city -->

<!-- Dynamic property access -->
{{lookup user propertyName}}
```

### Passing Data

When rendering, you pass a context object:

```json
{
  "userName": "John Doe",
  "isPremium": true,
  "products": [
    {"name": "Widget", "price": 9.99},
    {"name": "Gadget", "price": 19.99}
  ]
}
```

**Pro tip**: Do calculations (totals, formatting) in your server code before passing to the template. Keep templates focused on presentation only.

---

## 7. Positioning Elements {#positioning}

### Absolute Positioning on Fixed Canvas

The most common pattern in MarkupGo :

```html
<div class="relative w-[1200px] h-[630px] bg-slate-900 overflow-hidden">
  <!-- Background layer (z-index 0) -->
  <div class="absolute inset-0 bg-[url('{{image}}')] bg-cover bg-center"></div>
  
  <!-- Overlay layer (z-index 10) -->
  <div class="absolute inset-0 bg-black/25"></div>

  <!-- Centered logo -->
  <div class="absolute top-[40px] left-1/2 -translate-x-1/2">
    <img src="{{logo}}" class="w-[160px] h-[160px] object-contain" />
  </div>

  <!-- Title anchored to bottom-left -->
  <div class="absolute left-[80px] bottom-[180px] max-w-[960px]">
    <h1 class="text-[72px] leading-[1.05] tracking-[-0.02em] font-bold
               [text-shadow:0_4px_16px_rgba(0,0,0,0.45)]">
      {{ title }}
    </h1>
  </div>
</div>
```

### Positioning Cheatsheet

| Pattern | Classes | Description |
|---------|---------|-------------|
| Full coverage | `absolute inset-0` | Fills entire parent |
| Center horizontally | `left-1/2 -translate-x-1/2` | Perfect centering |
| Center vertically | `top-1/2 -translate-y-1/2` | Vertical center |
| Center both | `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2` | Dead center |
| Precise positioning | `left-[83px] top-[112px]` | Exact pixel placement |
| From bottom | `bottom-[100px]` | Position from bottom edge |
| Safe margins | 60-100px from edges | Avoid content cutoff |

### Flexbox Layouts

For stacking and aligning content:

```html
<!-- Vertical stack with gap -->
<div class="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Horizontal with space between -->
<div class="flex items-center justify-between">
  <div>Left content</div>
  <div>Right content</div>
</div>

<!-- Center everything -->
<div class="flex items-center justify-center h-full">
  <div>Centered content</div>
</div>
```

### Grid Layouts

For structured content:

```html
<!-- 2-column grid -->
<div class="grid grid-cols-2 gap-8">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Responsive-style fixed widths -->
<div class="grid grid-cols-3 gap-4 w-[1200px]">
  <div class="col-span-2">Wide column</div>
  <div>Narrow column</div>
</div>
```

---

## 8. Working with Images {#images}

### Image Element vs Background Image

Choose based on your needs :

#### Using `<img>` Element
Best when you need object-fit control:

```html
<!-- Maintain aspect ratio, crop if needed -->
<img src="{{avatar}}" class="w-[420px] h-[420px] object-cover rounded-xl" />

<!-- Fit entire image within bounds -->
<img src="{{logo}}" class="w-[200px] h-[100px] object-contain" />

<!-- Other object-fit options -->
<img class="object-fill">     <!-- Stretch to fill -->
<img class="object-none">     <!-- Don't resize -->
<img class="object-scale-down"> <!-- Scale down only if needed -->
```

#### Using Background Image
Best for full-bleed designs or overlays:

```html
<!-- Full coverage background -->
<div class="absolute inset-0 bg-[url('{{bg}}')] bg-cover bg-center"></div>

<!-- Fixed size background -->
<div class="w-[600px] h-[400px] bg-[url('{{image}}')] bg-cover bg-center rounded-lg"></div>

<!-- With gradient overlay -->
<div class="relative">
  <div class="absolute inset-0 bg-[url('{{bg}}')] bg-cover"></div>
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
</div>
```

### Image Positioning Options

```html
<!-- Background position -->
<div class="bg-[url('{{img}}')] bg-top">      <!-- Align to top -->
<div class="bg-[url('{{img}}')] bg-bottom">   <!-- Align to bottom -->
<div class="bg-[url('{{img}}')] bg-left">     <!-- Align to left -->
<div class="bg-[url('{{img}}')] bg-right">    <!-- Align to right -->
<div class="bg-[url('{{img}}')] bg-center">   <!-- Center (default) -->

<!-- Background size -->
<div class="bg-[url('{{img}}')] bg-cover">    <!-- Cover entire area -->
<div class="bg-[url('{{img}}')] bg-contain">  <!-- Fit within area -->
<div class="bg-[url('{{img}}')] bg-auto">     <!-- Natural size -->
```

---

## 9. Text Overflow Handling {#text-overflow}

### Safe Multi-line Titles

Prevent text from breaking layouts :

```html
<!-- Allow wrapping with constraints -->
<h1 class="text-[64px] leading-[1.05] tracking-[-0.02em] font-bold
           max-w-[960px] break-words">
  {{ title }}
</h1>
```

### Line Clamping (Truncate to N Lines)

Requires the line-clamp plugin :

```html
<!-- Limit to 2 lines with ellipsis -->
<h2 class="text-[40px] leading-tight line-clamp-2">
  {{ longSubtitle }}
</h2>

<!-- Different clamp values -->
<p class="line-clamp-1">  <!-- Single line -->
<p class="line-clamp-3">  <!-- Three lines -->
<p class="line-clamp-none"> <!-- Remove clamp -->
```

### Fade-out Effect for Long Text

When you can't use line-clamp :

```html
<div class="relative max-h-[160px] overflow-hidden">
  <div class="text-[64px] leading-[1.2] break-words">
    {{ veryLongTitle }}
  </div>
  <!-- Gradient fade at bottom -->
  <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-[40px]
              bg-gradient-to-t from-slate-900/90 to-transparent"></div>
</div>
```

### Text Truncation Strategies

```html
<!-- Single line with ellipsis -->
<p class="truncate">{{ text }}</p>

<!-- Prevent wrapping -->
<p class="whitespace-nowrap">{{ text }}</p>

<!-- Allow pre-formatted text -->
<p class="whitespace-pre-line">{{ text }}</p>
```

---

## 10. Visual Polish: Shadows and Effects {#visual-polish}

### Box Shadows

```html
<!-- Standard shadows -->
<div class="shadow-sm">     <!-- Small shadow -->
<div class="shadow">        <!-- Default shadow -->
<div class="shadow-lg">     <!-- Large shadow -->
<div class="shadow-xl">     <!-- Extra large -->
<div class="shadow-2xl">    <!-- Huge shadow -->

<!-- Colored shadows -->
<div class="shadow-xl shadow-black/30">    <!-- 30% black shadow -->
<div class="shadow-lg shadow-purple-500/50"> <!-- Colored shadow -->

<!-- Custom complex shadow -->
<div class="[box-shadow:0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]">
```

### Text Shadows (Critical for Readability)

Text shadows aren't built into Tailwind, use arbitrary properties :

```html
<!-- Subtle shadow -->
<h1 class="[text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">

<!-- Strong shadow for photos -->
<h1 class="[text-shadow:0_4px_16px_rgba(0,0,0,0.45)]">

<!-- Multiple shadows for glow effect -->
<h1 class="[text-shadow:0_0_20px_rgba(124,58,237,0.5),0_0_40px_rgba(124,58,237,0.3)]">
```

### Borders and Rounded Corners

```html
<!-- Rounded corners -->
<div class="rounded">        <!-- Small radius -->
<div class="rounded-lg">     <!-- Large radius -->
<div class="rounded-2xl">    <!-- Extra large -->
<div class="rounded-full">   <!-- Circle/pill -->
<div class="rounded-[32px]"> <!-- Custom radius -->

<!-- Borders -->
<div class="border border-white/10">  <!-- Semi-transparent border -->
<div class="border-2 border-purple-500"> <!-- Colored border -->
<div class="border-t-4 border-blue-500"> <!-- Top border only -->
```

### Gradients

```html
<!-- Background gradients -->
<div class="bg-gradient-to-r from-purple-500 to-blue-500">
<div class="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">

<!-- Overlay gradients for readability -->
<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">

<!-- Radial gradients -->
<div class="bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.1),transparent_70%)]">
```

---

## 11. Z-Index Layering {#z-index}

Control stacking order of overlapping elements :

```html
<div class="relative">
  <!-- Background layer -->
  <div class="absolute inset-0 z-0 bg-[url('{{bg}}')] bg-cover"></div>
  
  <!-- Overlay -->
  <div class="absolute inset-0 z-10 bg-black/30"></div>
  
  <!-- Content on top -->
  <div class="absolute left-[80px] bottom-[100px] z-20">
    <h1>This appears on top</h1>
  </div>
</div>
```

### Z-Index Scale

| Class | Value | Use Case |
|-------|-------|----------|
| `z-0` | 0 | Background elements |
| `z-10` | 10 | Overlays, masks |
| `z-20` | 20 | Main content |
| `z-30` | 30 | Floating elements |
| `z-40` | 40 | Dropdowns |
| `z-50` | 50 | Modals, top-most |
| `z-auto` | auto | Default stacking |

---

## 12. Render Options for Images and PDFs {#render-options}

### Image Render Options

Complete options for image generation :

```json
{
  "options": {
    "properties": {
      "format": "png",        // "png" | "jpeg" | "webp"
      "quality": 90,          // 1-100, only for JPEG/WebP
      "width": 1200,
      "height": 630,
      "omitBackground": false, // true for transparent PNG
      "clip": false           // true to crop (fromUrl only)
    },
    "waitDelay": "2s",        // Wait before capture
    "waitForExpression": "window.__ready__ === true", // Wait for JS condition
    "emulatedMediaType": "screen", // or "print"
    "optimizeForSpeed": true,
    "failOnConsoleExceptions": true
  }
}
```

**Key settings explained:**
- `quality`: Lower = smaller file, higher = better quality (JPEG/WebP only)
- `omitBackground`: Set to `true` for transparent PNGs
- `clip`: Only needed for `fromUrl` rendering to crop to specified dimensions
- `waitDelay`: Simple delay in seconds (e.g., "2s", "500ms")
- `waitForExpression`: Wait for JavaScript condition to be true

### PDF Render Options

Complete options for PDF generation :

```json
{
  "options": {
    "properties": {
      "size": { 
        "width": 210,    // A4 width in mm
        "height": 297    // A4 height in mm
      },
      "margins": { 
        "top": 10, 
        "bottom": 10, 
        "left": 12, 
        "right": 12 
      },
      "landscape": false,
      "printBackground": true,    // MUST be true for colors/images
      "preferCssPageSize": false,
      "scale": 1,
      "displayHeaderFooter": false,
      "headerTemplate": "<div></div>",
      "footerTemplate": "<div></div>",
      "pageRanges": "",           // e.g., "1-5, 8, 11-13"
      "singlePage": false         // true for one long page
    },
    "emulatedMediaType": "print",  // Important for PDFs
    "pdfUA": true                   // PDF/UA compliance
  }
}
```

**Common page sizes (in mm):**
- A4: 210×297
- Letter: 216×279
- A3: 297×420
- Legal: 216×356

---

## 13. PDF Headers, Footers & Page Numbers {#pdf-headers-footers}

### Setting Up Headers and Footers

Headers and footers in PDFs have special requirements :

```json
{
  "options": {
    "properties": {
      "displayHeaderFooter": true,
      "headerTemplate": "<html><head><style>...</style></head><body>...</body></html>",
      "footerTemplate": "<html><head><style>...</style></head><body>...</body></html>"
    }
  }
}
```

### Important Limitations

1. **No JavaScript** execution in headers/footers
2. **No external resources** (CSS, fonts, images) are loaded
3. **Images must be base64** encoded data URLs
4. **Only Docker-bundled fonts** are available
5. **Styles must be inline** or in `<style>` tags

### Page Number Template

```html
<!-- Footer with page numbers -->
<html>
<head>
  <style>
    body { 
      font-size: 11px; 
      margin: 0 20px; 
      font-family: Arial, sans-serif;
      -webkit-print-color-adjust: exact; 
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="footer-content">
    <div>© 2024 Your Company</div>
    <div>
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>
    <div><span class="date"></span></div>
  </div>
</body>
</html>
```

### Special Classes Available

| Class | Description |
|-------|-------------|
| `pageNumber` | Current page number |
| `totalPages` | Total number of pages |
| `date` | Current date |
| `title` | Document title |
| `url` | Document URL |

---

## 14. Multi-Page PDF Layouts {#multi-page}

### Page Break Control

Use CSS to control where pages break :

```html
<!-- Prevent breaking inside element -->
<div class="break-inside-avoid">
  This content won't be split across pages
</div>

<!-- Force page break -->
<div class="break-after-page">
  Content before page break
</div>

<!-- Avoid break after heading -->
<h2 class="break-after-avoid">
  This heading stays with next content
</h2>
```

### Table Handling for PDFs

```html
<table class="w-full text-[12px] leading-[1.4]">
  <thead class="bg-slate-100">
    <tr class="text-left">
      <th class="p-3">Item</th>
      <th class="p-3">Qty</th>
      <th class="p-3">Price</th>
    </tr>
  </thead>
  <tbody>
    {{#each items}}
    <!-- Prevent row from splitting across pages -->
    <tr class="odd:bg-white even:bg-slate-50 break-inside-avoid">
      <td class="p-3">{{ this.name }}</td>
      <td class="p-3">{{ this.qty }}</td>
      <td class="p-3">${{ this.price }}</td>
    </tr>
    {{/each}}
  </tbody>
</table>
```

### CSS Page Size Control

If you prefer CSS control over page size :

```css
@page {
  size: A4;
  margin: 20mm;
}

@page :first {
  margin-top: 30mm;  /* Different margin for first page */
}
```

Then set `preferCssPageSize: true` in options.

---

## 15. Ready-to-Use Template Blueprints {#blueprints}

### A) Open Graph Social Card (1200×630)

Perfect for Facebook, LinkedIn, and other platforms :

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <div class="relative w-[1200px] h-[630px] bg-slate-900 text-white font-['Inter',_sans-serif]">
    <!-- Dynamic background image -->
    <div class="absolute inset-0 bg-[url('{{ bg }}')] bg-cover bg-center"></div>
    
    <!-- Gradient overlay for text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0"></div>

    <!-- Main title -->
    <div class="absolute left-[72px] bottom-[160px] max-w-[920px]">
      <h1 class="text-[72px] leading-[1.05] tracking-[-0.02em] font-black
                 [text-shadow:0_6px_24px_rgba(0,0,0,0.55)]">
        {{ title }}
      </h1>
    </div>

    <!-- Optional subtitle -->
    {{#if subtitle}}
    <div class="absolute left-[72px] bottom-[72px]">
      <p class="text-[36px] font-semibold text-[#e868c0]">{{ subtitle }}</p>
    </div>
    {{/if}}
  </div>
</body>
</html>
```

### B) Profile Card with Avatar (1080×1080)

Instagram-ready square format :

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="relative w-[1080px] h-[1080px] bg-slate-900 text-white p-[96px] flex flex-col gap-8">
    <div class="flex items-center gap-8">
      <!-- Avatar with fallback to initials -->
      {{#if avatar}}
        <img src="{{avatar}}" class="w-[220px] h-[220px] rounded-2xl object-cover" />
      {{else}}
        <div class="w-[220px] h-[220px] rounded-2xl bg-white/10 flex items-center justify-center
                    text-[96px] font-bold">
          {{ initials }}
        </div>
      {{/if}}

      <!-- Name and role -->
      <div>
        <div class="text-[72px] leading-[1.05] font-extrabold">{{ name }}</div>
        {{#if role}}
          <div class="text-[32px] text-white/80">{{ role }}</div>
        {{/if}}
      </div>
    </div>

    <!-- Bio text -->
    <div class="text-[28px] leading-[1.6] max-w-[760px] text-white/90 whitespace-pre-line">
      {{ bio }}
    </div>
  </div>
</body>
</html>
```

### C) Product Promotion Card (1200×1200)

E-commerce product showcase :

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="relative w-[1200px] h-[1200px] bg-white text-slate-900 p-[96px]">
    <div class="grid grid-cols-2 gap-[48px]">
      <!-- Product image -->
      <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
        <img src="{{image}}" class="w-full h-[720px] object-cover" />
      </div>
      
      <!-- Product details -->
      <div class="flex flex-col gap-6">
        <h1 class="text-[64px] leading-[1.05] font-black tracking-[-0.02em]">
          {{ title }}
        </h1>

        <!-- Price with sale logic -->
        {{#if sale}}
          <div class="flex items-baseline gap-4">
            <span class="text-[48px] font-black text-rose-600">
              ${{ sale.price }}
            </span>
            <span class="text-[28px] line-through text-slate-400">
              ${{ price }}
            </span>
          </div>
        {{else}}
          <div class="text-[48px] font-black">${{ price }}</div>
        {{/if}}

        <!-- Feature bullets -->
        <ul class="mt-2 text-[28px] leading-[1.5] list-disc pl-6">
          {{#each bullets}}
            <li>{{ this }}</li>
          {{/each}}
        </ul>
      </div>
    </div>
  </div>
</body>
</html>
```

### D) Certificate Template (1200×1200)

Professional certificate or award :

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="relative w-[1200px] h-[1200px] bg-slate-800 text-white rounded-2xl overflow-hidden font-['Inter',_sans-serif]">
    <div class="absolute inset-0 bg-slate-900"></div>

    <!-- Logo -->
    <div class="absolute top-[60px] left-1/2 -translate-x-1/2">
      <img src="{{logo}}" class="w-[220px] h-[220px] object-contain" />
    </div>

    <!-- Main image/photo -->
    <div class="absolute left-1/2 top-[420px] -translate-x-1/2 w-[700px] h-[420px]
                rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/30">
      <img src="{{image}}" class="w-full h-full object-cover" />
    </div>

    <!-- Recipient name -->
    <div class="absolute left-1/2 top-[880px] -translate-x-1/2 text-center max-w-[1000px]">
      <div class="text-[72px] leading-[1.05] tracking-[-0.02em] font-bold
                  drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
        {{ name }}
      </div>
    </div>

    <!-- Certificate info -->
    <div class="absolute left-1/2 top-[980px] -translate-x-1/2 text-center max-w-[1000px]">
      <div class="text-[#e868c0] text-[40px] font-bold leading-tight">
        {{ info }}
      </div>
    </div>
  </div>
</body>
</html>
```

### E) PDF Invoice Template

A4 invoice with proper formatting :

```html
<!doctype html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4; margin: 20mm; }
    @media print {
      .break-inside-avoid { break-inside: avoid; }
    }
  </style>
</head>
<body class="bg-white text-slate-900 font-sans">
  <div class="max-w-[210mm] mx-auto p-8">
    <!-- Header -->
    <div class="flex justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold">INVOICE</h1>
        <p class="text-gray-600">Invoice #{{invoiceNumber}}</p>
        <p class="text-gray-600">Date: {{date}}</p>
      </div>
      <div class="text-right">
        <img src="{{companyLogo}}" class="w-32 h-32 object-contain ml-auto mb-2" />
        <div class="text-sm">
          <p class="font-semibold">{{companyName}}</p>
          <p>{{companyAddress}}</p>
        </div>
      </div>
    </div>

    <!-- Bill To -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-2">Bill To:</h2>
      <p>{{customerName}}</p>
      <p class="text-gray-600">{{customerAddress}}</p>
    </div>

    <!-- Items table -->
    <table class="w-full mb-8">
      <thead class="border-b-2 border-gray-300">
        <tr>
          <th class="text-left py-2">Description</th>
          <th class="text-right py-2">Qty</th>
          <th class="text-right py-2">Rate</th>
          <th class="text-right py-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        {{#each items}}
        <tr class="border-b border-gray-200 break-inside-avoid">
          <td class="py-2">{{this.description}}</td>
          <td class="text-right py-2">{{this.quantity}}</td>
          <td class="text-right py-2">${{this.rate}}</td>
          <td class="text-right py-2">${{this.amount}}</td>
        </tr>
        {{/each}}
      </tbody>
      <tfoot>
        <tr class="font-semibold">
          <td colspan="3" class="text-right py-2">Total:</td>
          <td class="text-right py-2">${{total}}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</body>
</html>
```

**PDF Render Options for Invoice:**
```json
{
  "options": {
    "properties": {
      "size": { "width": 210, "height": 297 },
      "printBackground": true,
      "displayHeaderFooter": true,
      "footerTemplate": "<html><body><div style='font-size:10px;text-align:center;width:100%;'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div></body></html>"
    }
  }
}
```

---

## 16. Magic URL: No-Code Rendering {#magic-url}

### What is Magic URL?

Magic URL lets you generate images without writing any code . Just construct a URL with your parameters:

```
https://render.markupgo.com/template/{TEMPLATE_ID}.{FORMAT}?param1=value1&param2=value2
```

### Basic Pattern

```
https://render.markupgo.com/template/{ID}.png
  ?title=Hello%20World
  &subtitle=Welcome%20to%20MarkupGo
  &bg=https://example.com/image.jpg
```

### Passing Complex Options

Use bracket notation for nested parameters:

```
https://render.markupgo.com/template/{ID}.png
  ?title=My%20Title
  &options[properties][width]=1200
  &options[properties][height]=630
  &options[waitDelay]=2s
```

### URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| Context variables | Any template variable | `?name=John&age=25` |
| `options[...]` | Render options | `?options[properties][quality]=90` |
| `json=true` | Return JSON with URL instead of image | `?json=true` |
| `redirect=true` | 302 redirect to file URL | `?redirect=true` |

### Caching Behavior

**Important**: The same URL with identical parameters serves a cached image for **15 days** . This saves credits:

- First request: Generates image, uses 1 credit
- Subsequent identical requests (within 15 days): Serves cached image, no credit used
- Different parameters = new image = 1 credit

### Security Considerations

1. Enable Magic URL in template settings
2. URLs are public - anyone with the URL can generate images
3. Consider adding authentication tokens as parameters for sensitive templates
4. Rate limiting applies to prevent abuse

### Examples

**Social media card:**
```
https://render.markupgo.com/template/abc123.png
  ?title=Check%20out%20our%20new%20product!
  &subtitle=50%25%20off%20this%20week
  &bg=https://images.unsplash.com/photo-123
```

**Dynamic certificate:**
```
https://render.markupgo.com/template/cert456.pdf
  ?name=Jane%20Doe
  &course=Advanced%20JavaScript
  &date=2024-01-15
  &certificateId=CERT-2024-001
```

---

## 17. Reliability Settings {#reliability}

### Wait Strategies

Control when the snapshot is taken :

#### Simple Delay
```json
{
  "waitDelay": "2s"  // Wait 2 seconds
}
```

Common values:
- `"500ms"` - Half second
- `"1s"` - One second
- `"2s"` - Two seconds (good for fonts/images)
- `"5s"` - Five seconds (heavy resources)

#### Wait for JavaScript Expression
```json
{
  "waitForExpression": "window.__ready__ === true"
}
```

Examples:
```javascript
// Wait for fonts
"document.fonts.status === 'loaded'"

// Wait for custom flag
"window.dataLoaded === true"

// Wait for specific element
"document.querySelector('.main-content') !== null"

// Complex condition
"window.imagesLoaded && document.fonts.status === 'loaded'"
```

### Media Type Emulation

Control how the page renders :

```json
{
  "emulatedMediaType": "screen"  // For images (default)
}
```

Or for PDFs:
```json
{
  "emulatedMediaType": "print"   // For PDFs with print styles
}
```

### Error Handling

```json
{
  "failOnConsoleExceptions": true,  // Fail if JS errors occur
  "failOnHttpError": true           // Fail on 4xx/5xx responses
}
```

### Complete Reliability Setup

```json
{
  "options": {
    "properties": {
      "format": "png",
      "width": 1200,
      "height": 630
    },
    "waitDelay": "1s",
    "waitForExpression": "document.fonts && document.fonts.status === 'loaded'",
    "emulatedMediaType": "screen",
    "failOnConsoleExceptions": true,
    "optimizeForSpeed": false  // More reliable, slightly slower
  }
}
```

---

## 18. Image Transformation API {#image-transformation}

### Quick Image Modifications

Transform existing images without re-rendering :

```
https://files.markupgo.com/{IMAGE_PATH}
  ?width=1200
  &height=630
  &fit=cover
```

### Available Transformations

| Parameter | Description | Values |
|-----------|-------------|--------|
| `width` | Target width | Pixels |
| `height` | Target height | Pixels |
| `fit` | How to fit | `cover`, `contain`, `fill`, `inside`, `outside` |
| `position` | Crop position | `center`, `top`, `bottom`, `left`, `right` |
| `quality` | JPEG/WebP quality | 1-100 |
| `format` | Output format | `png`, `jpeg`, `webp` |
| `blur` | Blur amount | 0.3-1000 |
| `rotate` | Rotation angle | Degrees |

### Adding Overlays (Watermarks)

```
https://files.markupgo.com/{IMAGE_PATH}
  ?width=1200
  &height=630
  &draw[0][url]=https://example.com/watermark.png
  &draw[0][opacity]=0.2
  &draw[0][position]=bottom-right
```

Draw parameters:
- `draw[0][url]` - Overlay image URL
- `draw[0][opacity]` - Opacity (0-1)
- `draw[0][position]` - Position on image
- `draw[0][width]` - Overlay width
- `draw[0][height]` - Overlay height

### Use Cases

1. **Add watermark to generated images**
2. **Resize images for different platforms**
3. **Create blurred background versions**
4. **Add badges or labels dynamically**

---

## 19. Essential Utility Toolkit {#utility-kit}

### The Mini "Utility Kit" You'll Use Constantly

These patterns solve 90% of MarkupGo template needs :

#### Canvas Setup
```html
<!-- Standard social card canvas -->
<div class="relative w-[1200px] h-[630px] overflow-hidden">

<!-- Square canvas -->
<div class="relative w-[1080px] h-[1080px] overflow-hidden">

<!-- Story/vertical canvas -->
<div class="relative w-[1080px] h-[1920px] overflow-hidden">
```

#### Centering Techniques
```html
<!-- Center horizontally -->
<div class="absolute left-1/2 -translate-x-1/2">

<!-- Center vertically -->
<div class="absolute top-1/2 -translate-y-1/2">

<!-- Center both -->
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

<!-- Center with flexbox -->
<div class="flex items-center justify-center h-full">
```

#### Layout Stacks
```html
<!-- Vertical stack with gap -->
<div class="flex flex-col gap-4">

<!-- Horizontal with space between -->
<div class="flex items-center justify-between">

<!-- Grid layout -->
<div class="grid grid-cols-2 gap-8">
```

#### Shadows for Depth
```html
<!-- Box shadow -->
<div class="shadow-xl shadow-black/30">

<!-- Text shadow (custom) -->
<h1 class="[text-shadow:0_2px_10px_rgba(0,0,0,0.35)]">

<!-- Drop shadow filter -->
<h1 class="drop-shadow-lg">
```

#### Image Handling
```html
<!-- Cover: crop to fill -->
<img class="object-cover">

<!-- Contain: fit entirely -->
<img class="object-contain">

<!-- Background image -->
<div class="bg-[url('{{img}}')] bg-cover bg-center">
```

#### Text Readability
```html
<!-- Dark overlay (scrim) -->
<div class="absolute inset-0 bg-black/30">

<!-- Gradient scrim -->
<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">

<!-- Text with shadow -->
<h1 class="[text-shadow:0_4px_16px_rgba(0,0,0,0.45)]">
```

#### Typography Control
```html
<!-- Line height -->
<h1 class="leading-[1.05]">  <!-- Tight -->
<p class="leading-relaxed">   <!-- Loose -->

<!-- Letter spacing -->
<h1 class="tracking-[-0.02em]">  <!-- Tight -->
<p class="tracking-wide">        <!-- Wide -->

<!-- Line clamping -->
<p class="line-clamp-2">  <!-- Max 2 lines -->
```

---

## 20. API & Node.js Client {#api-node}

### JavaScript/Node.js Quick Reference

#### Installation
```bash
npm install @markupgo/node
```

#### Basic Usage

```javascript
const MarkupGo = require('@markupgo/node');
const markupgo = new MarkupGo('YOUR_API_KEY');

// Generate image from HTML
async function generateImageFromHtml() {
  const html = `
    <html>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  `;
  
  const options = {
    properties: {
      format: "png",
      width: 1200,
      height: 630
    }
  };
  
  const result = await markupgo.image.fromHtml(html, options);
  const buffer = await result.buffer(); // Get as buffer
  // Or: const url = await result.json(); // Get URL
}

// Generate from template
async function generateFromTemplate() {
  const data = {
    id: 'TEMPLATE_ID',
    context: {
      title: 'Dynamic Title',
      subtitle: 'Dynamic Subtitle',
      items: [
        { name: 'Item 1', price: 9.99 },
        { name: 'Item 2', price: 19.99 }
      ]
    }
  };
  
  const options = {
    properties: {
      format: "png"
    }
  };
  
  const result = await markupgo.image.fromTemplate(data, options);
  const json = await result.json();
  console.log('Image URL:', json.url);
}

// Generate PDF
async function generatePdf() {
  const data = {
    id: 'TEMPLATE_ID',
    context: {
      invoiceNumber: 'INV-001',
      customerName: 'John Doe',
      total: 99.99
    }
  };
  
  const options = {
    properties: {
      printBackground: true,
      size: { width: 210, height: 297 },
      margins: { top: 20, bottom: 20, left: 20, right: 20 }
    }
  };
  
  const result = await markupgo.pdf.fromTemplate(data, options);
  const buffer = await result.buffer();
  // Save to file
  require('fs').writeFileSync('invoice.pdf', buffer);
}
```

### API Methods

#### Image Generation 
```javascript
// From HTML string
markupgo.image.fromHtml(html, options)

// From template
markupgo.image.fromTemplate(data, options)

// From URL
markupgo.image.fromUrl(url, options)
```

#### PDF Generation 
```javascript
// From HTML string
markupgo.pdf.fromHtml(html, options)

// From template
markupgo.pdf.fromTemplate(data, options)

// From URL
markupgo.pdf.fromUrl(url, options)
```

#### Response Methods
```javascript
// Get as buffer (for saving/processing)
result.buffer()

// Get JSON with URL
result.json()

// Get as stream
result.stream()
```

---

## 21. Style Starters {#style-starters}

### Typography Scales

Ready-to-use font size combinations :

#### Hero Headlines
```html
<!-- Extra large hero -->
<h1 class="text-[96px] leading-[0.95] tracking-[-0.03em] font-black">

<!-- Large hero -->
<h1 class="text-[72px] leading-[1.05] tracking-[-0.02em] font-bold">

<!-- Medium hero -->
<h1 class="text-[56px] leading-[1.1] tracking-[-0.01em] font-bold">
```

#### Subheadings
```html
<!-- Large subhead -->
<h2 class="text-[36px] leading-[1.2] font-semibold">

<!-- Medium subhead -->
<h2 class="text-[28px] leading-[1.3] font-semibold">

<!-- Small subhead -->
<h3 class="text-[24px] leading-[1.4] font-medium">
```

#### Body Text
```html
<!-- Large body -->
<p class="text-[24px] leading-[1.5]">

<!-- Regular body -->
<p class="text-[18px] leading-[1.6]">

<!-- Small text -->
<p class="text-[14px] leading-[1.5]">
```

#### Special Fonts
```html
<!-- Monospace for code/numbers -->
<code class="font-['Roboto_Mono',_monospace] text-[16px]">

<!-- Display font for impact -->
<h1 class="font-['Playfair_Display',_serif] text-[80px] italic">
```

### Color Palettes

#### Modern Gradients
```html
<!-- Purple to pink -->
<div class="bg-gradient-to-r from-purple-500 to-pink-500">

<!-- Blue to green -->
<div class="bg-gradient-to-br from-blue-500 to-green-400">

<!-- Sunset -->
<div class="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500">

<!-- Ocean -->
<div class="bg-gradient-to-b from-blue-400 to-blue-700">
```

#### Text Colors with Opacity
```html
<!-- Primary text -->
<h1 class="text-slate-900">

<!-- Secondary text -->
<p class="text-slate-700">

<!-- Muted text -->
<span class="text-slate-500">

<!-- On dark background -->
<h1 class="text-white">
<p class="text-white/90">
<span class="text-white/60">
```

### Visual Effects

#### Glassmorphism
```html
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
```

#### Neumorphism
```html
<div class="bg-slate-100 rounded-2xl 
            [box-shadow:20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff]">
```

#### Glow Effect
```html
<div class="bg-purple-500 rounded-full 
            [box-shadow:0_0_60px_20px_rgba(147,51,234,0.5)]">
```

---

## 22. Format Selection Guide {#format-selection}

### When to Use Each Format 

| Format | Best For | Pros | Cons |
|--------|----------|------|------|
| **PNG** | Social media, transparency needed | Lossless quality, transparency support | Larger file size |
| **JPEG** | Photos, gradients | Small file size, good for photos | No transparency, lossy |
| **WebP** | Modern web, smaller files | Best compression, transparency | Not universal support |
| **PDF** | Documents, invoices, certificates | Selectable text, multiple pages, print-ready | Larger files, complex setup |

### Decision Tree

```
Need transparency?
  → Yes: PNG (with omitBackground: true)
  → No: Continue...
  
Is it a document?
  → Yes: PDF
  → No: Continue...
  
Mostly photos/gradients?
  → Yes: JPEG (quality: 85-90)
  → No: Continue...
  
Need smallest file?
  → Yes: WebP (quality: 85-90)
  → No: PNG (best quality)
```

### Format-Specific Settings

#### PNG Options
```json
{
  "format": "png",
  "omitBackground": true,  // For transparency
  "optimizeForSpeed": false  // Better compression
}
```

#### JPEG Options
```json
{
  "format": "jpeg",
  "quality": 90,  // 1-100
  "optimizeForSpeed": true  // Faster generation
}
```

#### WebP Options
```json
{
  "format": "webp",
  "quality": 85,  // Good balance
  "omitBackground": false
}
```

#### PDF Options
```json
{
  "printBackground": true,
  "preferCssPageSize": false,
  "displayHeaderFooter": true,
  "pdfUA": true  // Accessibility compliance
}
```

---

## 23. Best Practices {#best-practices}

### Opinionated Guidelines for Success 

1. **Fix Canvas Dimensions for Images**
   - Never use `w-screen` or `h-screen`
   - Decide exact export size first
   - Use pixel values: `w-[1200px] h-[630px]`

2. **Content Safety Margins**
   - Keep important content 60-100px from edges
   - Platform previews often crop edges
   - Test with actual social media platforms

3. **Text Readability First**
   - Always use scrims on photo backgrounds (25-40% black)
   - Add text shadows for extra clarity
   - Test with low-contrast images

4. **Use Arbitrary Properties Liberally**
   ```html
   <!-- Don't fight Tailwind's defaults -->
   <h1 class="[text-shadow:0_4px_16px_rgba(0,0,0,0.45)]
              [letter-spacing:-0.03em]">
   ```

5. **Wait for Resources**
   ```javascript
   // Always wait for fonts if precision matters
   document.fonts.ready.then(() => window.__ready__ = true);
   ```

6. **PDF-Specific Rules**
   - Always set `printBackground: true`
   - Define margins explicitly
   - Use `break-inside-avoid` for important blocks
   - Test multi-page layouts thoroughly

7. **Performance Optimization**
   - Reuse identical Magic URLs (15-day cache)
   - Optimize images before using as backgrounds
   - Keep templates under 1MB total
   - Minimize external resource calls

8. **Template Organization**
   ```html
   <!-- Clear layer structure -->
   <!-- Layer 0: Background -->
   <!-- Layer 1: Overlays/scrims -->
   <!-- Layer 2: Main content -->
   <!-- Layer 3: Floating elements -->
   ```

9. **Version Control**
   - Keep templates in Git
   - Use semantic versioning for major changes
   - Document context variables clearly
   - Include example render URLs

10. **Testing Checklist**
    - [ ] Fonts load correctly
    - [ ] Variables handle missing data
    - [ ] Text doesn't overflow
    - [ ] Images have fallbacks
    - [ ] Colors meet contrast requirements
    - [ ] Works with min/max content lengths

---

## 24. Debugging Checklist {#debugging}

### Common Issues and Solutions 

**Nothing appears in render?**
- ✓ Check Tailwind CDN loads in `<head>` before body
- ✓ Verify canvas has fixed pixel dimensions
- ✓ Check browser console for JavaScript errors
- ✓ Ensure template HTML is valid

**Text looks wrong or off-center?**
- ✓ If using `left-1/2`, add `-translate-x-1/2`
- ✓ Check font is actually loading (network tab)
- ✓ Verify font weights are available (400, 600, 700, etc.)
- ✓ Use `waitDelay: "2s"` for font loading

**Text unreadable on backgrounds?**
- ✓ Add overlay: `bg-black/25` or stronger
- ✓ Use text shadow: `[text-shadow:0_4px_16px_rgba(0,0,0,0.45)]`
- ✓ Increase font weight to `font-bold` or `font-black`
- ✓ Consider white text with dark overlay

**Images not showing?**
- ✓ Verify image URLs are publicly accessible
- ✓ Check for CORS issues (use same domain or CORS-enabled CDN)
- ✓ For base64, ensure proper data URL format
- ✓ Test image URL in browser directly

**PDF backgrounds missing?**
- ✓ Set `printBackground: true` in options
- ✓ Use `emulatedMediaType: "print"` for PDFs
- ✓ Check CSS has `-webkit-print-color-adjust: exact`

**Headers/footers not working (PDF)?**
- ✓ Use complete HTML documents for header/footer
- ✓ Convert images to base64 data URLs
- ✓ Use only system/Docker fonts
- ✓ Keep styles inline or in `<style>` tags

**Content cut off?**
- ✓ Add `overflow-hidden` to canvas container
- ✓ Check absolute positioning values
- ✓ Verify max-width constraints
- ✓ Test with longest expected content

**Render timing issues?**
- ✓ Use `waitForExpression` for custom readiness
- ✓ Try `waitDelay: "3s"` for complex templates
- ✓ Check network tab for slow resources
- ✓ Optimize/compress background images

**Wrong dimensions?**
- ✓ Use exact pixels for images: `[1200px]`
- ✓ Use millimeters for PDFs: `210mm`
- ✓ Check for conflicting width/height styles
- ✓ Verify options.properties dimensions

**Cache not updating?**
- ✓ Change any parameter to bust cache
- ✓ Add timestamp parameter: `?v=123456789`
- ✓ Wait 15 days for cache expiry
- ✓ Use different template ID for major changes

---

## 25. Complete Template Skeleton {#template-skeleton}

### The One Template to Rule Them All

Copy this and customize for any use case :

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  
  <!-- Tailwind CSS with plugins -->
  <script src="https://cdn.tailwindcss.com?plugins=typography,aspect-ratio,line-clamp"></script>
  
  <!-- Tailwind configuration -->
  <script>
    tailwind.config = { 
      theme: { 
        extend: { 
          colors: { 
            brand: '#e868c0',      // Your brand color
            primary: '#0f172a',    // Primary color
            accent: '#fbbf24'      // Accent color
          }
        }
      }
    }
  </script>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Optional: Additional styles -->
  <style>
    /* Custom CSS if needed */
    @page { size: A4; margin: 20mm; }  /* For PDFs */
  </style>
</head>

<body class="antialiased">
  <!-- 
    CANVAS SIZES (choose one):
    - Open Graph: w-[1200px] h-[630px]
    - Square: w-[1080px] h-[1080px]
    - Story: w-[1080px] h-[1920px]
    - HD: w-[1920px] h-[1080px]
  -->
  <main class="relative w-[1200px] h-[630px] overflow-hidden bg-slate-900 text-white font-['Inter',_sans-serif]">
    
    <!-- Layer 0: Background image (optional) -->
    {{#if bg}}
    <div class="absolute inset-0 bg-[url('{{ bg }}')] bg-cover bg-center"></div>
    {{/if}}
    
    <!-- Layer 1: Overlay/scrim for text readability -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    
    <!-- Layer 2: Main content -->
    <section class="absolute left-[72px] bottom-[88px] max-w-[960px] z-10">
      <!-- Title -->
      <h1 class="text-[72px] leading-[1.05] tracking-[-0.02em] font-black
                 [text-shadow:0_4px_16px_rgba(0,0,0,0.45)]">
        {{ title }}
      </h1>
      
      <!-- Subtitle (conditional) -->
      {{#if subtitle}}
      <p class="text-[36px] text-brand font-bold mt-3 line-clamp-2">
        {{ subtitle }}
      </p>
      {{/if}}
      
      <!-- Additional content -->
      {{#if items}}
      <ul class="mt-6 text-[24px] space-y-2">
        {{#each items}}
        <li class="flex items-center gap-2">
          <span class="text-accent">•</span>
          <span>{{ this }}</span>
        </li>
        {{/each}}
      </ul>
      {{/if}}
    </section>
    
    <!-- Layer 3: Floating elements (logo, badges, etc.) -->
    {{#if logo}}
    <div class="absolute top-[40px] right-[40px] z-20">
      <img src="{{ logo }}" class="w-[120px] h-[120px] object-contain" />
    </div>
    {{/if}}
    
    {{#if badge}}
    <div class="absolute top-[40px] left-[40px] z-20">
      <div class="bg-brand text-white px-6 py-3 rounded-full text-[18px] font-bold">
        {{ badge }}
      </div>
    </div>
    {{/if}}
    
  </main>

  <!-- Wait for fonts before rendering -->
  <script>
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        window.__ready__ = true;
      });
    } else {
      // Fallback for browsers without font loading API
      setTimeout(() => { window.__ready__ = true; }, 1000);
    }
  </script>
</body>
</html>
```

### Using This Template

1. **Choose your canvas size** - Update the `w-[...]` and `h-[...]` values
2. **Set your colors** - Modify the Tailwind config colors
3. **Pick your fonts** - Change the Google Fonts URL
4. **Adjust positioning** - Modify the `left-[...]` and `bottom-[...]` values
5. **Add your variables** - Use `{{ variableName }}` for dynamic content
6. **Test with real data** - Pass actual content lengths you expect

### Render Configuration

```json
{
  "options": {
    "properties": {
      "format": "png",
      "width": 1200,
      "height": 630,
      "omitBackground": false
    },
    "waitForExpression": "window.__ready__ === true",
    "emulatedMediaType": "screen",
    "optimizeForSpeed": false
  }
}
```

### Magic URL Example

```
https://render.markupgo.com/template/YOUR_ID.png
  ?title=Your%20Amazing%20Title
  &subtitle=Optional%20subtitle%20text
  &bg=https://images.unsplash.com/photo-xxx
  &logo=https://example.com/logo.png
  &badge=NEW
  &items[0]=First%20feature
  &items[1]=Second%20feature
  &items[2]=Third%20feature
```

---

## Conclusion

You now have everything you need to create professional images and PDFs with MarkupGo. Start with the template skeleton, customize it for your needs, and use the Magic URL for instant rendering. Remember:

1. **Think in fixed dimensions** - You're designing graphics, not responsive websites
2. **Layer your content** - Background → overlays → content → floating elements  
3. **Prioritize readability** - Use scrims and shadows liberally
4. **Test with real data** - Variable content can surprise you
5. **Leverage caching** - Reuse URLs to save credits

Happy rendering! 🎨
