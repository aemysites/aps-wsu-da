/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare rows with the required header
  const rows = [['Accordion (accordion6)']];
  // Select all immediate .card children as accordion items
  const cards = Array.from(element.querySelectorAll(':scope > .card'));
  cards.forEach(card => {
    // Title cell: Expecting an h2 (or similar heading) inside .card-header
    let header = card.querySelector('.card-header h2, .card-header h3, .card-header h4, .card-header h5, .card-header h6');
    // Fallback: If heading not present, use .card-header itself
    if (!header) {
      header = card.querySelector('.card-header');
    }
    // Ensure we're referencing the existing element (do not clone)
    const titleCell = header;
    // Content cell: All children of .card-body preserved
    const body = card.querySelector('.card-body');
    let contentCell;
    if (body) {
      // Gather all non-empty nodes in .card-body (preserve lists, paragraphs, etc)
      const nodes = Array.from(body.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim().length > 0;
        }
        return true;
      });
      // If there's only one node, use that directly, otherwise use array
      contentCell = nodes.length === 1 ? nodes[0] : nodes;
    } else {
      // Edge case: Content missing, provide empty span
      contentCell = document.createElement('span');
    }
    rows.push([titleCell, contentCell]);
  });
  // Create and replace with table, as per block definition
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
