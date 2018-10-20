import Node from '../models/node';
import { lastOf } from '../utils/logic';
import * as actions from '../meta/actions';

export function create (props) {
    return new Node({ type: 'list', ...props });
}

export function format (change, at, ordered) {
    const node = change.state.find(at);
    const attrs = { type: 'list' };
    attrs.meta = node.meta ? { ...node.meta, ordered } : { ordered };

    const op = change[actions.CAST_NODE](at, node, attrs);
    change[actions.EXTEND_NODE](at, op.data, 'li');
}

export function indent (change, focus, editor) {
    // proceed only if the current block is not the first list-item of its list
    const previous = focus.blocks[1].nodes[
        focus.blocks[1].indexOf(focus.blocks[0].key) - 1
    ];
    if (!previous) return;

    // if the children of previous list-item is not block type, convert it into block type
    let at = focus.keys.slice(0, focus.blocks.length - 1);
    if (editor.schema.isBlock(lastOf(previous.nodes))) {
        at = at.concat(previous.key, lastOf(previous.nodes).key);
    } else {
        const op = change[actions.EXTEND_NODE](at.concat(previous.key), previous, 'block');
        at = at.concat(previous.key, op.data[0].key);
    }

    // wrap this list-item in a new list
    const node = editor.schema.create('list', {
        nodes: [focus.blocks[0]],
        meta: { ordered: focus.blocks[1].meta.ordered }
    });

    // then append it to its previous list-item
    change[actions.INSERT_NODES]({ at, data: [node], after: true });
    // then remove the current list-item backwards
    const offset = focus.offset;
    const keys = at.slice(0, -2).concat(focus.blocks[0].key);
    const op = change[actions.REMOVE_NODES]({ keys }, { keys }, true);
    const point = { keys: op.focus.keys, offset };
    change[actions.SELECT](point, point);
}

export function lineFeedLeaf (change, focus, selection) {
    // 1. if current block is not empty, split from the focus point
    if (!change.state.schema.isEmpty(focus.block[0])) {
        return change[actions.SPLIT_NODE](focus, 1);
    }

    // 2. if current list is not a direct child of a list-item
    if (!focus.blocks[2] || focus.blocks[2].type !== 'li') {
        // 2.1 if current block is the first/last list-item of its list
        // insert a normal block peer before/after its list, then remove this list-item
        const nodes = focus.blocks[1].nodes;
        const isFirst = nodes[0] === focus.block[0];
        if (isFirst || lastOf(nodes) === focus.block[0]) {
            const at = focus.keys.slice(0, focus.blocks.length - 1);
            change.state.schema.of('block').insert(change, at, !isFirst);
            return change[actions.REMOVE_NODES](selection.anchor, selection.focus, isFirst);
        }

        // 2.2 otherwise current block is a not leading/tailing of its list, then we need to:
        // 2.2.1 split its list from current block: ul -> ul + ul
        // (and the current block is the first list-item of this second list, ramain focused)
        // 2.2.2 insert a normal block peer before the second list
        // 2.2.3 remove the first list-item of the second list backwards
        const op = change[actions.SPLIT_NODE]({
            keys: focus.keys.slice(0, focus.blocks.length - 1),
            nodes: focus.nodes.slice(1 - focus.blocks.length),
            offset: nodes.indexOf(focus.block[0])
        });
        change.state.schema.of('block').insert(change, op.focus.keys, false);
        change[actions.REMOVE_NODES](selection.focus, selection.focus, true);
        return;
    }

    // 3. ortherwise current list is a direct child of a list-item
    // 3.1 if current block is the last but not first list-item of its list
}

export function backwardsBlock (change, focus) {
    //
}
