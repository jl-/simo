import * as actions from '../meta/actions';

export function lineFeedLeaf (change, focus) {
    // const text = focus.nodes[0].text;
    // const isAtEnd = focus.offset === text.length ||
    //     /^\n?$/.test(text.slice(focus.offset));
    change[actions.REPLACE_TEXT](focus, '\n');
}
