/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from background-image style attribute
  function makeImageFromBackground(el, altText) {
    const style = el.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?(.+?)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].trim();
      img.alt = altText || '';
      return img;
    }
    return null;
  }

  // Find the UL containing the cards
  const list = element.querySelector('.cards__list');
  const items = list ? Array.from(list.children) : [];

  // Header row for the block
  const cells = [['Cards (cards1)']];

  // Parse each card item
  items.forEach(cardItem => {
    // Get image anchor and generate image element
    const imageAnchor = cardItem.querySelector('.item-image');
    // Get title text for alt attribute
    let altText = '';
    const content = cardItem.querySelector('.item-content');
    if (content) {
      const title = content.querySelector('.item-content__title');
      if (title) altText = title.textContent.trim();
    }
    const img = imageAnchor ? makeImageFromBackground(imageAnchor, altText) : null;

    // Prepare the text content cell
    const textCell = [];
    if (content) {
      // Title (as <h3>)
      const title = content.querySelector('.item-content__title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      // Description (as <p> if present)
      const desc = content.querySelector('.item-content__desc');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      // Call-to-Action link (if present)
      const link = content.querySelector('.item-content__link');
      if (link) {
        textCell.push(link);
      }
    }
    cells.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
