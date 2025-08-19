/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row exactly as required
  const headerRow = ['Accordion (accordion13)'];

  // Prepare title cell
  // Title: try to find a heading inside .card-header
  let titleCell;
  const cardHeader = element.querySelector('.card-header');
  if (cardHeader) {
    // Find the first heading (h1-h6) inside cardHeader for robustness
    let heading = cardHeader.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleCell = heading;
    } else {
      // If no heading, grab all direct child nodes of cardHeader (to preserve formatting)
      const nodes = Array.from(cardHeader.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE
      );
      titleCell = nodes.length ? nodes : document.createTextNode(cardHeader.textContent.trim());
    }
  } else {
    titleCell = document.createTextNode('');
  }

  // Prepare content cell
  // Body: find .card-body within .collapse
  let contentCell;
  const collapseDiv = element.querySelector('.collapse');
  if (collapseDiv) {
    const cardBody = collapseDiv.querySelector('.card-body');
    if (cardBody) {
      // Reference cardBody, not clone
      contentCell = cardBody;
    } else {
      // If .card-body is missing, grab all children of collapseDiv
      const nodes = Array.from(collapseDiv.childNodes).filter(
        n => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE
      );
      contentCell = nodes.length ? nodes : document.createTextNode(collapseDiv.textContent.trim());
    }
  } else {
    contentCell = document.createTextNode('');
  }

  // Compose the table structure
  const cells = [
    headerRow,
    [titleCell, contentCell],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
