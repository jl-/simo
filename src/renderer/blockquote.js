import Format from './format';

export const Options = {
    tag: 'blockquote',
};

export class Blockquote extends Format {
}

export default { ...Options, Ctor: Blockquote };
