const ACRONYMS = ['HTML', 'CSS', 'UI', 'UX', 'API', 'HTTP', 'SQL', 'IOS'];

export function formatText(text: string): string {
  return text
    .split('_')
    .map((word) => {
      const upperWord = word.toUpperCase();
      return ACRONYMS.includes(upperWord)
        ? upperWord
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/UI UX/g, 'UI/UX');
}
