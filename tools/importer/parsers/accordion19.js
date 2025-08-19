/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header row exactly as required
  const headerRow = ['Accordion (accordion19)'];
  const rows = [headerRow];

  // Select all immediate .card children (one per accordion item)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Extract the title from the card-header (prefer h2, but fallback to text)
    const cardHeader = card.querySelector('.card-header');
    let titleCell;
    if (cardHeader) {
      // Try heading first
      const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // If no heading, use all direct text content in card-header (excluding children)
        const span = document.createElement('span');
        span.textContent = cardHeader.childNodes.length === 1 && cardHeader.childNodes[0].nodeType === 3
          ? cardHeader.textContent.trim()
          : Array.from(cardHeader.childNodes)
              .filter(node => node.nodeType === 3)
              .map(node => node.textContent.trim())
              .join(' ');
        titleCell = span;
      }
    } else {
      titleCell = '';
    }

    // Extract the content cell from .collapse > .card-body
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        contentCell = body;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table using the helper
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
