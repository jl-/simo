import '../../styles/toolbar.scss';
import { h } from '../../utils/dom';
import * as Options from './options';

export default class Toolbar {
    constructor (options = {}, editor) {
        this.formats = [];
        this.editor = editor;
        this.options = Options.sanitize(options);
        this.$el = this.options.$el || h('div', { class: 'toolbar' });

        for (const name of (this.options.formats || Options.formats)) {
            const format = editor.formatter.formats.get(name);
            if (format && format.$control) {
                this.formats.push(format);
                this.$el.appendChild(format.$control);
            }
        }

        if (editor.renderer.$el.parentElement !== this.$el.parentElement) {
            editor.renderer.$el.insertAdjacentElement('beforebegin', this.$el);
        }
    }

    handle ({ selection }) {
        for (const format of this.formats) {
            format.update(selection);
        }
    }
}
