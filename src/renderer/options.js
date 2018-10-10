const rules = {
    image: 'img',
    block: 'div',
    text: 'span',
    node: 'span',
    italic: 'i',
    paragraph: 'p',
    bold: 'b',
    link: 'a',
    'ordered-list': 'ol',
    'unordered-list': 'ul'
};

export function mergeRules (given = {}) {
    return { ...rules, ...given };
}
