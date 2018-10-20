import * as actions from '../meta/actions';
import * as hyperkit from '../core/hyperkit';

export function format (change, at) {
    const target = change.state.find(at).clone(false);
    target.type = target.type === 'blockquote' ? 'block' : 'blockquote';
    change[actions.REPLACE_NODES]({ at, data: [target] });
}

export function lineFeedLeaf (change, focus, selection) {
    const { keys, blocks } = focus;
    const at = keys.slice(0, blocks.length);
    if (change.state.schema.isEmpty(blocks[0])) {
        return hyperkit.castToNormalBlock(change, at, blocks[0]);
    }

    change[actions.EXTEND_NODE](at, blocks[0], 'block');
    change[actions.SPLIT_NODE](selection.focus, 1);
}

export function backwardsBlock (change, focus) {
    const { keys, blocks } = focus;
    const at = keys.slice(0, blocks.length);
    return hyperkit.castToNormalBlock(change, at, blocks[0]);
}
