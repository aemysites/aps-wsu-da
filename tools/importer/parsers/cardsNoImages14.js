/* global WebImporter */
export default function parse(element, { document }) {
  // Table header (matches spec exactly)
  const cells = [['Cards']];

  // Find all direct .card children
  const cards = Array.from(element.querySelectorAll(':scope > .card'));

  cards.forEach((card) => {
    // Get card title: .card-header > h2 or fallback to header text
    let title = '';
    const header = card.querySelector('.card-header');
    if (header) {
      const h2 = header.querySelector('h2');
      if (h2) {
        title = h2.textContent.trim();
      } else {
        title = header.textContent.trim();
      }
    }
    // Get the card body div
    const bodyWrap = card.querySelector('.card-body');
    // Row content array (will hold all content in a single cell)
    const rowContent = [];
    if (title) {
      // Use <strong> for heading as per semantic meaning
      const heading = document.createElement('strong');
      heading.textContent = title;
      rowContent.push(heading);
    }
    if (bodyWrap) {
      // Gather all children of body (preserving formatting)
      const bodyChildren = Array.from(bodyWrap.childNodes).filter(node => {
        // Ignore empty text nodes
        return !(node.nodeType === 3 && !node.textContent.trim());
      });
      // If there's a heading and also body content, add a <br>
      if (title && bodyChildren.length) {
        rowContent.push(document.createElement('br'));
      }
      bodyChildren.forEach((child) => {
        rowContent.push(child); // use references to original elements
      });
    }
    // Always add the row, even if only heading is present
    cells.push([rowContent]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
