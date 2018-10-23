import Format from './format';

export const Options = {
};

export class Heading extends Format {
    tag (node) {
        return `h${node.meta && node.meta.level || '1'}`;
    }
}

export default { ...Options, Ctor: Heading };
