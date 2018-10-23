import { lastOf } from '../utils/logic';
import * as actions from '../meta/actions';

export function format (change, at) {
    const target = change.state.find(at).clone(false);
    target.type = target.type === 'blockquote' ? 'block' : 'blockquote';
    change[actions.REPLACE_NODES]({ at, data: [target] });
}

export function lineFeedLeaf (change, focus, selection) {
    const { keys, blocks } = focus;
    const at = keys.slice(0, blocks.length);
    if (change.state.schema.isEmpty(blocks[0])) {
        return change.state.schema.of('block').cast(change, at);
    }

    change[actions.EXTEND_NODE](at, blocks[0], 'block');
    change[actions.SPLIT_NODE](selection.focus, 1);
}

export function backwardsBlock (change, focus) {
    const { keys, blocks } = focus;
    const at = keys.slice(0, blocks.length);
    return change.state.schema.of('block').cast(change, at);
}

export function lineFeedChild (change, focus) {
    if (!change.state.schema.isEmpty(focus.block[0]) ||
        focus.blocks[0] !== lastOf(focus.blocks[1].nodes)) {
        change[actions.SPLIT_NODE](focus, 1);
    } else {
        const at = focus.keys.slice(0, focus.blocks.length - 1);
        change.state.schema.of('block').insert(change, at, true);
        change[actions.REMOVE_NODES](focus, focus, false), false;
    }
}
