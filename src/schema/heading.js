import * as actions from '../meta/actions';
import * as hyperkit from '../core/hyperkit';
import { edgeLeafOf } from '../utils/node';


export function format (change, at, level) {
    let block = change.state.find(at);
    if (block.type === 'li') {
        block = change[actions.EXTEND_NODE](at, block, 'block').data[0];
        at = at.concat(block.key);
    }

    const target = block.clone(false);
    if (target.type === 'heading' &&
        target.data && target.data.level === 'level') {
        target.type = 'block';
        delete target.data.level;
    } else {
        target.type = 'heading';
        (target.data || (target.data = {})).level = level;
    }

    return change[actions.REPLACE_NODES]({ at, data: [target] });
}

export function lineFeedLeaf (change, focus) {
    const { keys, blocks, nodes, offset } = focus;
    const at = keys.slice(0, blocks.length);
    if (change.state.schema.isEmpty(blocks[0])) {
        return hyperkit.castToNormalBlock(change, at, blocks[0]);
    }

    if (offset === 0 && edgeLeafOf(blocks[0]) === nodes[0]) {
        return hyperkit.insertNormalBlock(change, at, false);
    }

    const op = change[actions.SPLIT_NODE](focus, 1);
    return hyperkit.castToNormalBlock(change, op.focus.keys.slice(0, -1), op.data[1]);
}

export function backwardsBlock (change, focus) {
    const { keys, blocks } = focus;
    const at = keys.slice(0, blocks.length);
    return hyperkit.castToNormalBlock(change, at, blocks[0]);
}
