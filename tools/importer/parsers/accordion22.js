/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with exact block name
  const headerRow = ['Accordion (accordion22)'];

  // Find title: card-header > heading element (reference it directly if exists, fallback to card-header)
  const cardHeader = Array.from(element.children).find(child => child.classList.contains('card-header'));
  let titleCell = null;
  if (cardHeader) {
    const heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    titleCell = heading ? heading : cardHeader;
  } else {
    // If no card-header, fallback to first heading in element
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    titleCell = heading ? heading : document.createTextNode('');
  }

  // Find content: .collapse > .card-body, or collapse itself
  let contentCell = null;
  const collapse = Array.from(element.children).find(child => child.classList.contains('collapse'));
  if (collapse) {
    // Look for the direct .card-body section in collapse
    const cardBody = Array.from(collapse.children).find(child => child.classList.contains('card-body'));
    contentCell = cardBody ? cardBody : collapse;
  } else {
    // fallback: use element itself
    contentCell = element;
  }

  // Create the rows for the block table
  const rows = [headerRow, [titleCell, contentCell]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
