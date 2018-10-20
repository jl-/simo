import Format from './format';

export const Options = {
};

export class List extends Format {
    tag (node) {
        return node.meta.ordered ? 'ol' : 'ul';
    }
}

export default { ...Options, Ctor: List };
