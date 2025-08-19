/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract tab labels from header
  const tabHeaderLinks = element.querySelectorAll('.nav-tabs .nav-link');
  const tabLabels = Array.from(tabHeaderLinks).map(link => link.textContent.trim());
  // 2. Extract tab content panes
  const tabContentPanes = element.querySelectorAll('.tab-content > .tab-pane');

  // edge case: if no labels or panes, do nothing
  if (tabLabels.length === 0 || tabContentPanes.length === 0) return;

  // 3. Build header row: always ['Tabs'] (per instructions)
  const headerRow = ['Tabs'];
  // 4. Build tab label row (first content row): all labels as columns
  const tabLabelRow = tabLabels;

  // 5. Build tab content row: all content as columns, reference existing children
  const tabContentRow = tabLabels.map((label, idx) => {
    const pane = tabContentPanes[idx];
    // Collect all element and text nodes with non-empty content
    const contentNodes = Array.from(pane.childNodes).filter(n =>
      n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim().length > 0)
    );
    if (contentNodes.length === 1) {
      return contentNodes[0];
    } else if (contentNodes.length > 1) {
      return contentNodes;
    } else {
      return '';
    }
  });

  // 6. Build table: header, labels row, content row
  const cells = [headerRow, tabLabelRow, tabContentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // 7. Replace original element
  element.replaceWith(table);
}
