/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: use the EXACT block name
  const headerRow = ['Columns block (columns18)'];

  // Extract all links inside the element (should be buttons)
  const links = Array.from(element.querySelectorAll('a'));

  // If there is any additional text content, include it as well
  // For this HTML there is only a <p> containing the links, so all content is links
  // Only add links if they exist, otherwise cell will be empty (edge case handling)
  const cellsRow = [links.length ? links : ['']];

  // Create the block table, matching the example structure: 1 header row, 1 content row, 1 column
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
