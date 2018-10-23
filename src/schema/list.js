import Node from '../models/node';
import * as actions from '../meta/actions';

export function create (props) {
    return new Node({ type: 'list', ...props });
}

export function format (change, at, ordered) {
    const node = change.state.find(at);
    const attrs = { type: 'list', meta: { ordered }};

    const op = change[actions.CAST_NODE](at, node, attrs);
    change[actions.EXTEND_NODE](at, op.data, 'li');
}
