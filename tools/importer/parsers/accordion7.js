/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion7)'];

  // Get all accordion items (cards)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  const rows = [];

  cards.forEach(card => {
    // Title cell: find .card-header, prefer h2/h5/a for visible text
    let titleCell;
    const headerEl = card.querySelector('.card-header');
    let titleText = '';
    if (headerEl) {
      // Try h2, h5, or direct link inside header
      const h2 = headerEl.querySelector('h2');
      if (h2) {
        titleText = h2.textContent.trim();
      } else {
        // Sometimes it's a link in h5 for action cards
        const h5 = headerEl.querySelector('h5');
        if (h5) {
          titleText = h5.textContent.trim();
        } else {
          // fallback to header text
          titleText = headerEl.textContent.trim();
        }
      }
      // Use strong for semantic meaning
      titleCell = document.createElement('strong');
      titleCell.textContent = titleText;
    } else {
      // If missing, empty cell
      titleCell = document.createElement('span');
      titleCell.textContent = '';
    }

    // Content cell: find .collapse > .card-body, reference whole element
    let contentCell;
    const collapseEl = card.querySelector('.collapse');
    if (collapseEl) {
      const cardBody = collapseEl.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        contentCell = document.createElement('span');
        contentCell.textContent = '';
      }
    } else {
      contentCell = document.createElement('span');
      contentCell.textContent = '';
    }

    rows.push([titleCell, contentCell]);
  });

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
