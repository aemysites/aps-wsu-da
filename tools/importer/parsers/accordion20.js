/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block name header, matching example
  const headerRow = ['Accordion (accordion20)'];

  // Select all immediate .card children (each accordion item)
  const cards = element.querySelectorAll(':scope > .card');
  const rows = [headerRow];

  cards.forEach(card => {
    // Title cell: Use the h2 inside .card-header or fallback to its text
    let titleCell = '';
    const cardHeader = card.querySelector('.card-header');
    if (cardHeader) {
      const h2 = cardHeader.querySelector('h2');
      if (h2) {
        titleCell = h2;
      } else {
        // Fallback to text content for edge case (should not occur in provided HTML)
        const tempDiv = document.createElement('div');
        tempDiv.textContent = cardHeader.textContent.trim();
        titleCell = tempDiv;
      }
    } else {
      // If no header, create empty cell
      titleCell = document.createElement('div');
    }

    // Content cell: use the .card-body element directly
    let contentCell;
    const cardBody = card.querySelector('.card-body');
    if (cardBody) {
      contentCell = cardBody;
    } else {
      // If no body, create empty cell
      contentCell = document.createElement('div');
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table referencing existing elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion element with the table
  element.replaceWith(block);
}
