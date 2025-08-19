/* global WebImporter */
export default function parse(element, { document }) {
  // Initialize the table rows array
  const rows = [];
  // Add the header row (exact match to example)
  rows.push(['Accordion (accordion28)']);

  // Find all accordion items (cards)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  
  // Process each card
  cards.forEach(card => {
    // Title cell: .card-header > h2 or fallback to .card-header text
    let titleContent;
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        titleContent = h2;
      } else {
        // Fallback to full header content
        titleContent = header;
      }
    } else {
      // No header found, use a blank cell
      titleContent = document.createElement('span');
    }

    // Content cell: .collapse > .card-body
    let bodyContent = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // Reference the existing card-body element
        bodyContent = cardBody;
      } else {
        // No body, empty div
        bodyContent = document.createElement('div');
      }
    } else {
      // No collapse/content found, empty div
      bodyContent = document.createElement('div');
    }

    rows.push([ titleContent, bodyContent ]);
  });

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
