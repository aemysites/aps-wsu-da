/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion31)'];

  // --- Extract title ---
  let titleEl = null;
  // Find the header containing the title (look for a heading inside .card-header)
  const headerDiv = element.querySelector('.card-header');
  if (headerDiv) {
    // Accept any heading level or fallback to direct textContent
    titleEl = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (!titleEl) {
      // Create a <span> with the text if heading not found
      const span = document.createElement('span');
      span.textContent = headerDiv.textContent.trim();
      titleEl = span;
    }
  } else {
    // Fallback: use first heading in card
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleEl = heading;
    } else {
      // Last fallback: empty cell
      titleEl = document.createElement('span');
    }
  }

  // --- Extract content ---
  let contentEl = null;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    // Look for card-body, but accept collapseDiv if not found
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      contentEl = cardBody;
    } else {
      contentEl = collapseDiv;
    }
  } else {
    // Fallback: any .card-body
    const cardBody = element.querySelector('.card-body');
    if (cardBody) {
      contentEl = cardBody;
    } else {
      // Last fallback: empty cell
      contentEl = document.createElement('div');
    }
  }

  // Compose the rows: header + [title, content]
  const rows = [headerRow, [titleEl, contentEl]];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  
  // Swap in place
  element.replaceWith(block);
}
