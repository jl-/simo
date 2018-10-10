import Format from './format';
import { h } from '../utils/dom';
import { on } from '../utils/event';
import * as actions from '../meta/actions';

export const Options = {
    name: 'quotation',
    title: 'Quotation',
    desc: 'quotation',
    shortcut: 'cmd+[',
    $control: h('span', { class: 'toolbar__icon icon-bold' })
};

export class Quotation extends Format {
    constructor (options, editor) {
        super({ ...Options, ...options });
        on(this.$control, 'click', () => editor.dispatch('format', 'quotation', !this.active));
    }

    handle (active, change, editor) {
        console.log('// quote!', active, change, editor);
    }

    toggle (change, at) {
        const target = change.state.find(at).clone(false);
        target.type = target.type === 'blockquote' ? 'block' : 'blockquote';
        change[actions.REPLACE_NODES]({ at, data: [target] });
    }
}

export default { ...Options, Ctor: Quotation };
