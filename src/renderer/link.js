import Format from './format';

export const Options = {
    tag: 'a',
};

export class Link extends Format {
}

export default { ...Options, Ctor: Link };
