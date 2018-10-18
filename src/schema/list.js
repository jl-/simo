import * as actions from '../meta/actions';

export function instruct (change, at, ordered) {
    const node = change.state.find(at);
    const attrs = { type: 'list' };
    attrs.data = node.data ? { ...node.data, ordered } : { ordered };

    const op = change[actions.CAST_NODE](at, node, attrs);
    change[actions.EXTEND_NODE](at, op.data, 'li');
}
