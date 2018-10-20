import Node from '../models/node';
import * as actions from '../meta/actions';

const type = 'block';

export function create (data = {}) {
    const nodes = [{ type: 'text' }];
    return new Node({ nodes, ...data, type });
}

export function cast (change, at) {
    const node = change.state.find(at);
    const target = node.clone(false, false, { type });
    change[actions.REPLACE_NODES]({ at, data: [target] });
}

export function insert (change, at, after) {
    change[actions.INSERT_NODES]({ at, data: [create()], after });
}
