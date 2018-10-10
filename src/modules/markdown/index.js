import Module from '../base';
import { mergePatterns } from './options';
import { edgeLeafOf } from '../../utils/node';
import { editorEvents } from '../../meta/events';

export default class Markdown extends Module {
    constructor (options = {}, editor) {
        super(options, editor);
        this.patterns = mergePatterns(this.options.patterns);
    }

    [editorEvents.get('input')] (change, event, editor) {
        const focus = change.selection.focus;
        const first = edgeLeafOf(focus.blocks[0], { tail: false });
        const meta = { ...focus, first, node: focus.nodes[0] };

        for (const pattern of this.patterns) {
            if (typeof pattern.handleInput === 'function' &&
                pattern.handleInput(change, meta, editor, event)) break;
        }
    }
}
