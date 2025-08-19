/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header as per spec
  const headerRow = ['Accordion (accordion2)'];
  const tableRows = [headerRow];

  // 2. Get all .card accordion items
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: h2 (or fallback to .card-header text if no h2)
    let titleNode = card.querySelector('.card-header h2');
    if (!titleNode) {
      // fallback to .card-header text in a <div>
      const headerDiv = card.querySelector('.card-header');
      if (headerDiv) {
        const fallbackDiv = document.createElement('div');
        fallbackDiv.textContent = headerDiv.textContent.trim();
        titleNode = fallbackDiv;
      } else {
        // If totally missing, use empty string
        titleNode = '';
      }
    }

    // Content cell: all content from .card-body
    let contentNode = card.querySelector('.card-body');
    if (!contentNode) {
      // fallback to empty cell
      contentNode = '';
    }
    tableRows.push([
      titleNode,
      contentNode
    ]);
  });

  // 3. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
