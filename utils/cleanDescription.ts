export const cleanDescription = (text: string): string => {
    if (text.length < 1) return '';

    const tagsWithAttributes = ['character', 'anime', 'person', 'url', 'spoiler', 'manga'];
    const simpleTags = ['i', 'b', 'u', 'spoiler', 'manga'];

    let cleaned = text;

    // Удаление парных тегов с атрибутами: [tag=...][/tag] → остаётся внутренний текст
    tagsWithAttributes.forEach(tag => {
        const regex = new RegExp(`\\[${tag}=[^\\]]*]([\\s\\S]*?)\\[\\/${tag}]`, 'g');
        cleaned = cleaned.replace(regex, '$1');
    });

    // Удаление простых парных тегов: [tag][/tag] → остаётся внутренний текст
    simpleTags.forEach(tag => {
        const regex = new RegExp(`\\[${tag}]([\\s\\S]*?)\\[\\/${tag}]`, 'g');
        cleaned = cleaned.replace(regex, '$1');
    });

    // Полное удаление [[Text]]
    cleaned = cleaned.replace(/\[\[([^\]]+?)\]\]/g, '$1');

    // Полное удаление [character=1234 John Doe]
    cleaned = cleaned.replace(/\[character=\d+ [^\]]+?]/g, '');

    return cleaned
        .replace(/\n{2,}/g, '\n')
        .trim();
};