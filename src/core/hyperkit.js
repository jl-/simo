import { VOID_CHAR } from '../meta/node';
import * as actions from '../meta/actions';

export function removeNodeAtPoint (change, point, isBackwards) {
    change[actions.REMOVE_NODES](point, point, isBackwards);
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
    } else if (!change.state.schema.isFrozen(focus.nodes[0])) {
        const point = isBackwards ? focus : anchor;
        const length = Math.abs(anchor.offset - focus.offset);
        const text = selection.contains(point.keys) ? VOID_CHAR : '';
        change[actions.REPLACE_TEXT](point, text, length);
    }
}
