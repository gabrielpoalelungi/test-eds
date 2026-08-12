export default function decorate(block) {
  // Block structure expected:
  // Row 1: Heading + intro text (preserved as-is)
  // Row 2+: Q&A pairs - each row has question in first cell, answer in second cell

  const rows = [...block.children];

  // If we have at least 2 rows (header + at least one Q&A)
  if (rows.length < 2) return;

  // First row is the header section (keep as-is)
  const headerRow = rows[0];

  // Create FAQ container
  const faqContainer = document.createElement('div');

  // Process Q&A rows (all rows after the first)
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cells = [...row.children];

    // Each row should have 2 cells: question and answer
    if (cells.length === 2) {
      const questionCell = cells[0];
      const answerCell = cells[1];

      // Create details/summary structure
      const details = document.createElement('details');
      const summary = document.createElement('summary');

      // Move question text to summary
      summary.textContent = questionCell.textContent.trim();

      // Move answer content to a div
      const answerDiv = document.createElement('div');
      answerDiv.innerHTML = answerCell.innerHTML;

      details.appendChild(summary);
      details.appendChild(answerDiv);

      faqContainer.appendChild(details);
    }
  }

  // Clear block and rebuild with header + FAQ container
  block.innerHTML = '';
  const newRow = document.createElement('div');
  newRow.appendChild(headerRow.children[0]); // Move header content
  newRow.appendChild(faqContainer);
  block.appendChild(newRow);
}
