import Format from './format';
import { h } from '../utils/dom';
import { on } from '../utils/event';

export const Options = {
    name: 'bold',
    title: 'Bold',
    desc: 'bold',
    shortcut: 'cmd+[',
    $control: h('span', { class: 'toolbar__icon icon-bold' })
};

export class Bold extends Format {
    constructor (options, editor) {
        super({ ...Options, ...options });
        on(this.$control, 'click', () => editor.dispatch('format', 'bold'));
    }

    handle () {
        console.log('// bold');
    }
}

export default { ...Options, Ctor: Bold };
