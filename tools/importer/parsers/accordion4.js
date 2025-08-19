/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: single column as specified
  const headerRow = ['Accordion (accordion4)'];
  const cells = [headerRow];

  // Each card = one accordion item
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  cards.forEach(card => {
    // Title cell: get the header's element (reference directly, not clone)
    let titleEl = card.querySelector('.card-header');
    let titleCell;
    if (titleEl) {
      // If header contains a heading, use that heading element directly for semantic meaning, else the header div
      const heading = titleEl.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        titleCell = titleEl;
      }
    } else {
      // fallback: empty div
      titleCell = document.createElement('div');
    }
    // Content cell: reference the .card-body element directly (may contain multiple blocks/paras)
    let contentEl = card.querySelector('.card-body');
    let contentCell;
    if (contentEl) {
      contentCell = contentEl;
    } else {
      contentCell = document.createElement('div');
    }
    // Accordion row: array of two cells (title, content)
    cells.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
