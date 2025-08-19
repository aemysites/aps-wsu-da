/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Accordion (accordion25)'];

  // Get all .card children (each is an accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  const rows = [headerRow];

  cards.forEach(card => {
    // Title cell: get .card-header h2 if available, else .card-header itself
    let titleEl = card.querySelector('.card-header h2') || card.querySelector('.card-header');
    // Content cell: everything inside .card-body (reference actual element)
    let contentEl = card.querySelector('.card-body');

    // Only include if both title and content are present
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
