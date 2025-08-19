/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, must match example exactly
  const headerRow = ['Columns block (columns16)'];

  // 2. Get the two main columns (left: hours, right: librarian info)
  // The structure is always: leftCol = code_snippet_first, rightCol = code_snippet_second
  const leftCol = element.querySelector('.code_snippet_first');
  const rightCol = element.querySelector('.code_snippet_second');

  // Edge case: If either is missing, use an empty div for consistency
  const leftContent = leftCol || document.createElement('div');
  const rightContent = rightCol || document.createElement('div');

  // 3. Build the table structure -- only one table for this block
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // 4. Create the table block and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
