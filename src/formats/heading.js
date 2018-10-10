import Format from './format';
import { h } from '../utils/dom';
import * as actions from '../meta/actions';

export const Options = {
    name: 'heading',
    title: 'Heading',
    desc: 'heading',
    shortcut: 'cmd+[',
    $control: h('span', { class: 'toolbar__icon icon-bold' })
};

export class Heading extends Format {
    constructor (options, editor) {
        super({ ...Options, ...options });
    }

    handle (active, change, editor) {
        console.log('// heading!', active, change, editor);
    }

    toggle (change, at, node, level) {
        const type = `h${level}`;
        const target = node.clone(false);
        target.type = target.type === type ? 'block' : type;
        change[actions.REPLACE_NODES]({ at, data: [target] });
    }
}

export default { ...Options, Ctor: Heading };
