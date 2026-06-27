---
name: react-window-print
description: >-
  Generates clean, printable HTML documents from React table datasets using window.open and window.print.
---

# React Window Print

## Overview
This skill provides a standard guidelines on how to implement print-ready vector PDF document export inside React/Vite frontends without requiring heavy third-party NPM libraries. It uses a new clean print preview window, injecting styled tables, headers, and footer lines.

## Dependencies
None.

## Quick Start
To trigger a print view in a React component, use the following code pattern:

```typescript
const handlePrint = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <html>
      <head>
        <title>Report Name</title>
        <style>
          body { font-family: sans-serif; padding: 40px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>Academic Report</h1>
        <table>
          <!-- Insert dynamic rows -->
        </table>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
```

## Workflow
1. **Fetch & Verify**: Fetch dataset values from API.
2. **Error Handling & Fallback**: If dataset is empty or API fails, do not throw a hard error. Instead, write an empty template report showing a warning notice.
3. **Template Writing**: Generate an HTML string containing structured tables, headers (logos), metadata grid, and authorized signature placeholders at the bottom.
4. **Trigger Print**: Open a blank page using `window.open`, write the string to its document, and call `window.print()` inside it.

## Common Mistakes
- **Pop-up Blocker**: Not checking if `window.open` returns null (which happens when pop-ups are blocked). Always add a fallback check.
- **Missing close()**: Forgetting to call `printWindow.document.close()` after writing, which can cause the print loader to spin indefinitely on some browsers.
