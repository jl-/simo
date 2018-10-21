import Module from '../base';
import { mergeFormats } from './options';
import { editorEvents, editorHooks } from '../../meta/events';

export default class Markdown extends Module {
    constructor (editor, options = {}) {
        super(editor, options);
        this.formats = new Map();

        editor.hook(editorHooks.BEFORE_MOUNT, () => {
            const formats = mergeFormats(options.formats);
            for (const name of Object.keys(formats)) {
                if (formats[name] && editor.schema.supports(name)) {
                    this.formats.set(name, formats[name]);
                }
            }
        });
    }

    [editorEvents.get('input')] (change, event, editor) {
        if (event.isComposing) return;
        for (const format of this.formats.values()) {
            if (typeof format.handleInput === 'function' &&
                format.handleInput(change, editor, event)) break;
        }
    }
}
