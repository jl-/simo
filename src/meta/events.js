export const editorEvents = [
    'keydown',
    'compositionstart',
    'beforeinput',
    'input',
    'compositionend',
    'keyup',

    'blur',
    'click',
    'select',
    'contextmenu',
    'copy',
    'cut',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'dragstart',
    'drop',
    'paste',
].reduce((r, k) => r.set(k, Symbol(k)), new Map());

export const editorHooks = {
    BEFORE_EACH: '@BEFORE_EACH',
    AFTER_EACH: '@AFTER_EACH',

    CREATED: '@CREATED',
    BEFORE_MOUNT: '@BEFORE_MOUNT',
    MOUNTED: '@MOUNTED',
    UPDATED: '@UPDATED'
};

export const keyCodes = {
    ENTER: 13,
    DELETE: 8,
    BACKSPACE: 8,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    CMD: 91,
    META: 91,
    TAB: 9,
    SPACE: 32,
    PERIOD: 190,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
};
