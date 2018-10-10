import Format from './format';
import { h } from '../utils/dom';
import { on } from '../utils/event';
import * as actions from '../meta/actions';

export const Options = {
    name: 'list',
    title: 'List',
    desc: 'List',
    shortcut: 'cmd+[',
    $control: (() => {
        const $root = h('span', { class: 'toolbar__group' });
        const $ordered = h('span', { class: 'toolbar__icon icon-bold' });
        const $unordered = h('span', { class: 'toolbar__icon icon-bold' });
        $root.appendChild($ordered); $root.appendChild($unordered);
        return $root;
    })()
};

export class List extends Format {
    constructor (options, editor) {
        super({ ...Options, ...options });
        on(this.$control, 'click', () => editor.dispatch('format', 'list'));
    }

    handle (active, change, editor) {
        console.log('// list!', active, change, editor);
    }

    toggle (change, at, type) {
        const node = change.state.find(at);
        const op = change[actions.CAST_NODE](at, node, { type });
        change[actions.EXTEND_NODE](at, op.data, 'li');
    }
}

export default { ...Options, Ctor: List };
