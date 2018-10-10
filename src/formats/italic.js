import Format from './format';
import { h } from '../utils/dom';
import { on } from '../utils/event';

export const Options = {
    name: 'italic',
    title: 'Italic',
    desc: 'italic',
    shortcut: 'cmd+]',
    $control: h('span', { class: 'toolbar__icon icon-italic' })
};

export class Italic extends Format {
    constructor (options, editor) {
        super({ ...Options, ...options });
        on(this.$control, 'click', () => editor.dispatch('format', 'italic'));
    }

    handle (editor) {
        console.log('xxx italic ', editor);
    }
}

export default { ...Options, Ctor: Italic };
