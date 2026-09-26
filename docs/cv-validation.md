# CV Studio validation

- The generated Anthony Cabigayan CV fits one A4 page. Rendered with Poppler and visually inspected; text extraction includes all supplied employment, education, eligibility, courses, and awards used in the CV.
- The browser SVG preview uses the same measured text and page operations as the PDF.
- A five-page sample preserves all eight roles, wraps long words, and keeps text within page bounds. Accented Latin names are supported; missing glyphs produce a visible error instead of being silently lost.
- Browser checks covered start-blank confirmation, required-field validation, profile edits, live preview, adding/removing roles, section tabs, and the mobile Preview action.
- A 390px mobile frame with a 375px content viewport has no horizontal document overflow.
- PDF generation produces a Blob and a reusable download link. The test browser did not report download events for either generated or static PDF links, so receipt in the browser's downloads could not be confirmed.
- Native Next.js production build and TypeScript checks passed. The hosted build is validated during publishing.

Visitor input remains in React form state. No CV input is transmitted to a server or persisted in browser storage. The published Site's existing sharing settings are preserved.
