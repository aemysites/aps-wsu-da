/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from example (must match exactly)
  const headerRow = ['Accordion (accordion12)'];
  const cells = [headerRow];

  // Get all accordion cards (each is one item)
  const cards = element.querySelectorAll(':scope > .card');
  cards.forEach(card => {
    // Title cell: find the heading
    let titleElem = '';
    const header = card.querySelector('.card-header');
    if (header) {
      // Find the first heading element in the header, or header itself
      const heading = header.querySelector('h1,h2,h3,h4,h5,h6');
      titleElem = heading ? heading : header;
    }

    // Content cell: body of accordion
    let contentElem = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        // Reference all children, including paragraphs, images, lists
        const fragments = Array.from(body.childNodes).filter(node => {
          // Ignore empty text nodes
          if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim().length > 0;
          return true;
        });
        if (fragments.length === 1) {
          contentElem = fragments[0];
        } else if (fragments.length > 1) {
          contentElem = fragments;
        } else {
          contentElem = '';
        }
      } else {
        contentElem = collapse;
      }
    }

    cells.push([titleElem, contentElem]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
