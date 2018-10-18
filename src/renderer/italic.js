import Format from './format';

export const Options = {
    tag: 'i',
};

export class Italic extends Format {
}

export default { ...Options, Ctor: Italic };
