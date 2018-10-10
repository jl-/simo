import Module from '../base';
import { mergePatterns } from './options';
import { edgeLeafOf } from '../../utils/node';
import { editorEvents } from '../../meta/events';

export default class Markdown extends Module {
    constructor (options = {}, editor) {
        super(options, editor);
        this.patterns = mergePatterns(this.options.patterns);
    }

    matchPatterns (meta) {
        return this.patterns.filter(p => p.match(meta));
    }

    [editorEvents.get('input')] (change, event, editor) {
        const { keys, nodes, blocks, block, offset } = change.selection.focus;
        const first = edgeLeafOf(blocks[0], { tail: false });

        const meta = {
            keys, nodes, blocks, offset,
            block, first, node: nodes[0]
        };

        for (const pattern of this.matchPatterns(meta)) {
            if (pattern.handle(change, meta, editor, event)) break;
        }
    }
}
