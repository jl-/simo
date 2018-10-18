import '../../styles/toolbar.scss';
import { h } from '../../utils/dom';
import * as Options from './options';

export default class Toolbar {
    constructor (editor, options = {}) {
        this.formats = [];
        this.editor = editor;
        this.options = Options.sanitize(options);
        this.view = this.options.view || h('div', { class: 'toolbar' });

        for (const name of (this.options.formats || Options.formats)) {
            const format = editor.renderer.formats[name];
            if (format && format.$control) {
                this.formats.push(format);
                this.view.appendChild(format.$control);
            }
        }

        if (editor.renderer.view.parentElement !== this.view.parentElement) {
            editor.renderer.view.insertAdjacentElement('beforebegin', this.view);
        }
    }

    handle ({ selection }) {
        for (const format of this.formats) {
            format.update(selection);
        }
    }
}
