import Node from '../models/node';
import { VOID_CHAR } from '../meta/node';
import * as actions from '../meta/actions';

export function castToNormalBlock (change, at, node) {
    const target = node.clone(false);
    target.type = 'block';
    change[actions.REPLACE_NODES]({ at, data: [target] });
}

export function removeNodeAtPoint (change, point, isBackwards) {
    change[actions.REMOVE_NODES](point, point, isBackwards);
}

export function insertNormalBlock (change, at, after) {
    const nodes = [{ type: 'text' }];
    const block = new Node({ type: 'block', nodes });
    change[actions.INSERT_NODES]({ at, data: [block], after });
}

export function removeSelection (change, selection) {
    const { anchor, focus, isBackwards } = selection;
    if (selection.hasMultiNodes) {
        const fop = !change.state.schema.isFrozen(focus.nodes[0]) ?
            change[actions.SPLIT_NODE](focus, 0) : null;
        const aop = !change.state.schema.isFrozen(anchor.nodes[0]) ?
            change[actions.SPLIT_NODE](anchor, 0) : null;
        const fpoint = fop ? fop[isBackwards ? 'focus' : 'anchor'] : focus;
        const apoint = aop ? aop[isBackwards ? 'anchor' : 'focus'] : anchor;
        change[actions.REMOVE_NODES](apoint, fpoint, isBackwards);
    } else {
        const point = isBackwards ? focus : anchor;
        const length = Math.abs(anchor.offset - focus.offset);
        const text = selection.contains(point.keys) ? VOID_CHAR : '';
        change[actions.REPLACE_TEXT](point, text, length);
    }
}
