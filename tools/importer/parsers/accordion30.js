/* global WebImporter */
export default function parse(element, { document }) {
  // Define block header
  const headerRow = ['Accordion (accordion30)'];
  const rows = [headerRow];

  // Get all direct .card children of the accordion
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach(card => {
    // Title cell: extract heading inside card-header
    let titleCell;
    const headerDiv = card.querySelector('.card-header');
    if (headerDiv) {
      // Find first heading element in card-header
      const heading = headerDiv.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleCell = heading;
      } else {
        // If no heading, use all card-header content as paragraph
        const p = document.createElement('p');
        p.innerHTML = headerDiv.innerHTML.trim();
        titleCell = p;
      }
    } else {
      // Fallback: all card text as paragraph
      const p = document.createElement('p');
      p.innerHTML = card.textContent.trim();
      titleCell = p;
    }

    // Content cell: extract .collapse > .card-body or all .collapse content
    let contentCell;
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        contentCell = cardBody;
      } else {
        // If no .card-body, use all of .collapse
        contentCell = collapse;
      }
    } else {
      // Fallback: everything after headerDiv in card
      const nodes = [];
      let foundHeader = false;
      card.childNodes.forEach(node => {
        if (foundHeader) nodes.push(node);
        if (node === headerDiv) foundHeader = true;
      });
      if (nodes.length) {
        // Wrap remaining nodes in a div for semantic grouping
        const wrapper = document.createElement('div');
        nodes.forEach(node => {
          wrapper.appendChild(node);
        });
        contentCell = wrapper;
      } else {
        // Card only contains header
        contentCell = document.createElement('div');
      }
    }
    // Push one row per accordion item
    rows.push([titleCell, contentCell]);
  });

  // Create and replace with accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
