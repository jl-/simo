import * as actions from '../../meta/actions';
import * as hyperkit from '../../core/hyperkit';

export function lineFeedLeaf (change, focus) {
    change[actions.SPLIT_NODE](focus, 1);
    // if (!change.state.schema.isEmpty(focus.block[0])) {
    //     change[actions.SPLIT_NODE](focus, 1);
    // } else {
    //     return hyperkit.insertNormalBlock();
    // }
}

export function backwardsBlock (change, focus) {
    //
}
