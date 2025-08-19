/* global WebImporter */
export default function parse(element, { document }) {
  // The block header must be exactly 'Table (bordered)' as per instructions/example
  const headerRow = ['Table (bordered)'];

  // Extract the <thead> header row, preserving each header cell's text content
  const thead = element.querySelector('thead');
  const ths = thead ? Array.from(thead.querySelectorAll('th')) : [];
  const columnHeaderRow = ths.map(th => th.textContent.trim());

  // Extract <tbody> rows and their cells, directly referencing cell content (preserving all formatting and elements)
  const tbody = element.querySelector('tbody');
  const trs = tbody ? Array.from(tbody.querySelectorAll('tr')) : [];
  const dataRows = trs.map(tr => {
    // For each <td> in the row, reference the actual cell element (not clone)
    // This preserves all formatting, images, icons, etc.
    return Array.from(tr.children);
  });

  // Compose final cells array for the block table
  const cells = [
    headerRow,
    columnHeaderRow,
    ...dataRows
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
