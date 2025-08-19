/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion8)'];

  // Extract the card header/title (preserve HTML structure)
  let titleCell = '';
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Find the first heading inside, or fallback to textContent
    const hdg = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    titleCell = hdg ? hdg : cardHeader.textContent.trim();
  }

  // Extract the content/cell (preserve HTML structure)
  let contentCell = '';
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    // The visible content is the .card-body (which contains a table in this case)
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      // Reference the cardBody directly (do not clone)
      contentCell = cardBody;
    }
  }

  const rows = [headerRow, [titleCell, contentCell]];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
