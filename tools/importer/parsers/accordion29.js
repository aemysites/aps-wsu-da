/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name EXACTLY as specified
  const headerRow = ['Accordion (accordion29)'];
  const rows = [];

  // Get all accordion items (cards)
  const cards = element.querySelectorAll(':scope > .card');

  cards.forEach((card) => {
    // Title cell: use existing heading (h2 inside .card-header)
    let titleCell;
    const cardHeader = card.querySelector(':scope > .card-header');
    if (cardHeader) {
      // Use the h2 if present, else all header content
      const h2 = cardHeader.querySelector('h2');
      if (h2) {
        titleCell = h2;
      } else {
        titleCell = cardHeader;
      }
    }
    // Content cell: everything inside .card-body
    let contentCell;
    const collapse = card.querySelector(':scope > .collapse');
    if (collapse) {
      const cardBody = collapse.querySelector(':scope > .card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        contentCell = collapse;
      }
    }
    // Edge case: If no title or content, skip
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // Table array: header then item rows
  const cells = [headerRow, ...rows];

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
