/* global WebImporter */
export default function parse(element, { document }) {
  // The block name must match exactly
  const headerRow = ['Columns block (columns15)'];

  // To ensure all text and inline content is captured, we reference the element's children if present,
  // otherwise, the element itself if it contains only text or a single link.
  let content;
  if (element.children.length > 0) {
    // Collect all child nodes (including text, links, etc.) in an array, to preserve all content
    content = Array.from(element.childNodes).filter(
      node => !(node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '')
    ).map(node => node);
    // If content is a single node, just reference that directly
    if (content.length === 1) {
      content = content[0];
    }
  } else {
    // If there are no child elements, just use the element itself
    content = element;
  }

  const cells = [
    headerRow,
    [content]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
