import bold from './bold';
import italic from './italic';
import link from './link';
import indent from './indent';
import list from './list';
import heading from './heading';
import blockquote from './blockquote';

export const defaultFormats = {
    block: 'div',
    text: 'span',
    node: 'span',
    paragraph: 'p',
    li: 'li',
    bold, italic, link, indent,
    list, heading, blockquote
};

export function mergeFormats (formats = {}) {
    const result = { ...defaultFormats };
    for (const name of Object.keys(formats)) {
        if (!formats[name] || !result[name] ||
            typeof result[name] === 'string') {
            result[name] = formats[name];
        } else if (typeof formats[name] === 'string') {
            result[name] = { ...result[name], tag: formats[name] };
        } else {
            result[name] = { ...result[name], ...formats[name] };
        }
    }

    return result;
}
