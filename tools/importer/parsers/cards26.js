/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Cards (cards26)'];

  // Find all slides by looking for .slide-wrapper within the block (covers normal and clone slides, but only take unique images)
  const wrappers = Array.from(element.querySelectorAll('.slide-wrapper'));

  // To avoid duplicates, collect by image src
  const seenSrcs = new Set();
  const rows = [];
  wrappers.forEach(slideWrapper => {
    const img = slideWrapper.querySelector('img');
    if (!img || seenSrcs.has(img.src)) return;
    seenSrcs.add(img.src);
    // Find the main text content: prefer .slide-content if present, otherwise grab all non-image elements
    let content = slideWrapper.querySelector('.slide-content');
    if (!content) {
      // Fallback: collect all children that aren't images
      content = document.createElement('div');
      Array.from(slideWrapper.children).forEach(child => {
        if (!child.querySelector('img') && child !== img) {
          content.appendChild(child);
        }
      });
      // Only use the fallback if it has content
      if (!content.hasChildNodes()) content = null;
    }
    if (!content) return;
    rows.push([img, content]);
  });

  if (!rows.length) return;
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
