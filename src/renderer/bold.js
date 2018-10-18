import Format from './format';

export const Options = {
    tag: 'b'
};

export class Bold extends Format {
}

export default { ...Options, Ctor: Bold };
