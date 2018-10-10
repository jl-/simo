import { lastOf } from '../../utils/logic';
import * as actions from '../../meta/actions';
import * as hyperkit from '../../core/hyperkit';

export function lineFeedLeaf (change, focus, selection) {
    // 1. if current block is not empty, split from the focus point
    if (!change.state.schema.isEmpty(focus.block[0])) {
        return change[actions.SPLIT_NODE](focus, 1);
    }

    // 2.1 if current block is the first/last root list-item, insert a normal block
    // peer before/after its wrapping list, then remove the current block.

    // 2.2 if current block is the first/last nested list-item, insert a list-item
    // peer

    // const list = focus.blocks[1].nodes;
    // const outermost = focus.blocks[2];
    // if (list[0] === focus.block[0] || lastOf(list) === focus.block[0]) {
    //     const at = focus.keys.slice(0, focus.blocks.length - 1);
    //     hyperkit.insertNormalBlock(change, at, false);
    //     return change[actions.REMOVE_NODES](selection.anchor, selection.focus, true);
    // }
}

export function backwardsBlock (change, focus) {
    //
}
