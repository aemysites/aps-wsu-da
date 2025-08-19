/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Cards (cards11)'];

  // Each card is a .cart element, direct child of the container
  const cardElements = Array.from(element.querySelectorAll(':scope > div.cart'));

  const rows = cardElements.map((card) => {
    // Icon element (first child)
    const icon = card.querySelector('i');
    // Number (title), in .cartfig
    const number = card.querySelector('.cartfig');
    // Description (the p tag)
    const desc = card.querySelector('p');

    // Compose text cell: bold number, then description
    const textContent = [];

    // Only add number if present and not empty
    if (number && number.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = number.textContent.trim();
      textContent.push(strong);
    }
    // Only add description if present and not empty
    if (desc && desc.textContent.trim()) {
      // Add a <br> only if there is a number/title above it
      if (textContent.length) {
        textContent.push(document.createElement('br'));
      }
      textContent.push(desc);
    }
    // If both missing, add empty string (fallback)
    if (textContent.length === 0) {
      textContent.push('');
    }

    // First cell: icon
    // Second cell: text content
    return [icon, textContent];
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
