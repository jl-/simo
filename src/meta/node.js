export const SPACE = ' ';
export const VOID_CHAR = '\u200B';

export const KEY_ATTR = 'data-key';

export const nodeTypes = {
    TEXT: 3,
    ELEMENT: 1
};

export const positions = {
    BEFORE: -1,
    EQUAL: 0,
    AFTER: 1
};

export const blockTypes = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
    'div', 'p', 'ul', 'ol', 'li', 'block', 'paragraph',
    'blockquote', 'section'
];

export const inlineTypes = [
    'text', 'link'
];

export const renderModes = {
    TAG: Symbol('render tag'),
    LEAF: Symbol('render leaf'),
    SKELETON: Symbol('render skeleton'),
    RECURSIVE: Symbol('render recursively'),
    DECORATION: Symbol('render decoration')
};
