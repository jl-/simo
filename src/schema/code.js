import * as actions from '../meta/actions';

export function lineFeedLeaf (change, focus) {
    const text = focus.nodes[0].text;
    const isAtEnd = focus.offset === text.length ||
        /^\u200B?$/.test(text.slice(focus.offset));
    if (isAtEnd && /(\n\u200B?){2}$/.test(text.slice(0, focus.offset))) {
        console.log('xx');
    } else {
        change[actions.REPLACE_TEXT](focus, '\n');
    }
}
