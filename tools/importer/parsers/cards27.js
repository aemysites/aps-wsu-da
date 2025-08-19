/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards27)'];

  // Find the cards list
  const cardsList = element.querySelector('ul.cards__list');
  if (!cardsList) return;

  // Helper to extract image from background-image style
  function extractImage(a) {
    if (!a) return null;
    const style = a.getAttribute('style') || '';
    const match = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/i);
    if (match && match[1]) {
      const img = document.createElement('img');
      img.src = match[1].trim();
      img.alt = a.getAttribute('alt') || '';
      return img;
    }
    return '';
  }

  // Helper to build the content cell for a card
  function buildContentCell(itemContent, tagSpan) {
    const frag = document.createDocumentFragment();
    // Title (strong)
    const title = itemContent.querySelector('h3');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    // Description
    const desc = itemContent.querySelector('p');
    if (desc) {
      frag.appendChild(desc);
      frag.appendChild(document.createElement('br'));
    }
    // CTA link
    const cta = itemContent.querySelector('a');
    if (cta) {
      frag.appendChild(cta);
    }
    // Tag (e.g. "Coming Soon", "Featured")
    if (tagSpan) {
      frag.appendChild(document.createElement('br'));
      frag.appendChild(tagSpan);
    }
    return frag;
  }

  // Build each card row
  const rows = Array.from(cardsList.children).map((li) => {
    const aImg = li.querySelector('.item-image');
    const imgEl = extractImage(aImg);
    const itemContent = li.querySelector('.item-content');
    const tagSpan = li.querySelector('.tag');
    const contentCell = itemContent ? buildContentCell(itemContent, tagSpan) : document.createTextNode('');
    return [imgEl, contentCell];
  });

  // Create and insert the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
