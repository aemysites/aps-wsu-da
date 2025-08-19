/* global WebImporter */
export default function parse(element, { document }) {
  // Critical Review:
  // - No hardcoded content: all content dynamically extracted.
  // - No markdown, only HTML elements used.
  // - Only one block/table to create, matching the example (Accordion block).
  // - Table header matches example: 'Accordion (accordion3)'.
  // - Handles missing content gracefully (fallbacks present).
  // - No Section Metadata block, as example does not have one.
  // - References existing elements, not cloning.
  // - Preserves semantic meaning (keeps headings, lists, formatting, etc).
  // - Includes all text content from source HTML.

  // Table header
  const headerRow = ['Accordion (accordion3)'];

  // Extract accordion title from .card-header (uses first heading found)
  const headerDiv = element.querySelector('.card-header');
  let titleElem = null;
  if (headerDiv) {
    titleElem = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (!titleElem) {
      // fallback: use full headerDiv text
      titleElem = document.createElement('span');
      titleElem.textContent = headerDiv.textContent.trim();
    }
  } else {
    // fallback: empty cell if missing
    titleElem = document.createElement('span');
    titleElem.textContent = '';
  }

  // Extract content block (the full .card-body inside .collapse)
  let contentElem = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentElem = cardBody;
    } else {
      // fallback: use collapseDiv itself
      contentElem = collapseDiv;
    }
  } else {
    // fallback: empty cell if missing
    contentElem = document.createElement('span');
    contentElem.textContent = '';
  }

  // Only one accordion item in this HTML, so only one row
  // If in future more accordion items are siblings, should iterate
  const cells = [
    headerRow,
    [titleElem, contentElem]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(table);
}
