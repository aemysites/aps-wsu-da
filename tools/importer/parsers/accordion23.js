/* global WebImporter */
export default function parse(element, { document }) {
  // The block name header matches the example exactly
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Find all direct children with class 'card' (each accordion item)
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach(card => {
    // --- Title extraction ---
    // Each .card-header contains the title, typically an h2
    let titleElement = card.querySelector('.card-header');
    let titleContent;
    if (titleElement) {
      // Prefer heading element inside .card-header
      const heading = titleElement.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleContent = heading;
      } else {
        // fallback: preserve all content (including formatting) of card-header
        titleContent = document.createElement('div');
        titleContent.innerHTML = titleElement.innerHTML;
      }
    } else {
      // fallback: use first child
      titleContent = card.firstElementChild;
    }

    // --- Content extraction ---
    // The collapsible content is inside a .collapse div
    let collapse = card.querySelector('.collapse');
    let contentCell;
    if (collapse) {
      // Prefer the .card-body inside the collapse div
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        // fallback: use collapse div itself
        contentCell = collapse;
      }
    } else {
      // fallback: use the next sibling
      contentCell = card.children[1];
    }

    // Reference the actual element from the document, not a clone
    rows.push([titleContent, contentCell]);
  });

  // Create the Accordion block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
