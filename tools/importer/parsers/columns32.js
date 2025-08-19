/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single column as per spec
  const headerRow = ['Columns (columns32)'];

  // Extract columns
  const panelBody = element.querySelector('.panel-body');
  const row = panelBody?.querySelector('.row');
  const columns = row ? Array.from(row.children) : [];

  // For each column, grab the .form-group block
  const colCells = columns.map(col => {
    const group = col.querySelector('.form-group');
    return group ? group : col;
  });

  // Compose table data: header row is always a single cell, followed by one row of n columns
  const cells = [
    headerRow,
    colCells
  ];

  // Create table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Adjust the header row to have colspan
  // WebImporter.DOMUtils.createTable doesn't add colspan, so we manually set it here
  const th = block.querySelector('th');
  if (th && colCells.length > 1) {
    th.setAttribute('colspan', colCells.length);
  }

  // Replace original element
  element.replaceWith(block);
}
