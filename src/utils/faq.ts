export function parseFaqFromMarkdown(body: string) {
  const items: { question: string; answer: string }[] = [];
  const blocks = body.trim().split(/(?:^|\n)\*\*\d+\.\s/).slice(1);

  for (const block of blocks) {
    const questionEnd = block.indexOf('**');
    if (questionEnd === -1) continue;

    const question = block.slice(0, questionEnd).trim();
    const answer = block
      .slice(questionEnd + 2)
      .trim()
      .replace(/\n{3,}/g, '\n\n');

    if (question && answer) {
      items.push({ question, answer: faqAnswerToHtml(answer) });
    }
  }

  return items;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const safeHref = decodeEntities(href).replace(/"/g, '&quot;');
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
}

function faqAnswerToHtml(text: string): string {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const parts: string[] = [];
  let listBuffer: string[] = [];

  function flushList() {
    if (!listBuffer.length) return;
    const items = listBuffer.map((line) => `<li>${inlineMarkdown(line.slice(2))}</li>`).join('');
    parts.push(`<ul>${items}</ul>`);
    listBuffer = [];
  }

  for (const line of lines) {
    if (line.startsWith('- ')) {
      listBuffer.push(line);
      continue;
    }

    flushList();
    parts.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  flushList();
  return parts.join('');
}
