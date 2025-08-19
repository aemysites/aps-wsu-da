/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as specified
  const headerRow = ['Columns block (columns21)'];

  // Collect all table rows
  const rows = Array.from(element.querySelectorAll('tbody > tr'));
  // If no rows found, abort
  if (!rows.length) return;

  // Collect block rows, referencing only existing elements
  const blockRows = rows.map(tr => {
    // For each <td> in this <tr>
    const tds = Array.from(tr.children);
    // For each <td>, if it has element children, reference all of them; otherwise, use the text
    return tds.map(td => {
      // Remove empty text nodes
      const children = Array.from(td.childNodes).filter(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent.trim().length > 0;
        }
        return true;
      });
      // If only one element, use directly. If multiple, use array.
      if (children.length === 1) {
        return children[0];
      }
      return children;
    });
  });

  // Form table cell structure: header row, then rows
  const cells = [headerRow, ...blockRows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
