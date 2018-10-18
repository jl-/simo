import * as actions from '../meta/actions';

export function instruct (change, at) {
    const target = change.state.find(at).clone(false);
    target.type = target.type === 'blockquote' ? 'block' : 'blockquote';
    change[actions.REPLACE_NODES]({ at, data: [target] });
}
