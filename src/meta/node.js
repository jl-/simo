export const SPACE = ' ';
export const TAB_CHAR = '    ';
export const VOID_CHAR = '\u200B';
export const LINEFEED_CHAR = '\n';

export const KEY_ATTR = 'data-key';

export const nodeTypes = {
    TEXT: 3,
    ELEMENT: 1,
    COMMENT: 8
};

export const positions = {
    BEFORE: -1,
    EQUAL: 0,
    AFTER: 1
};

export const blockTypes = [
    'heading', 'header', 'list', 'pre',
    'div', 'p', 'li', 'block', 'paragraph',
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
