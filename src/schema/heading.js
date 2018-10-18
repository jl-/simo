import * as actions from '../meta/actions';

export function instruct (change, at, level) {
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
