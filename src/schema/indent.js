import { sibify } from '../utils/node';
import * as actions from '../meta/actions';

export function format (change, start, end, level) {
    const type = 'indent';
    const keys = sibify(
        start.keys.slice(0, start.blocks.length),
        end.keys.slice(0, end.blocks.length)
    );
    const root = change.state.find(keys.root);
    let node, nindex = root.indexOf(keys.a[0]);
    while (node = root.nodes[nindex++]) {
        const index = !node.formats ? -1 :
            node.formats.findIndex(f => f.type === type);
        const value = index === -1 ? level :
            level + node.formats[index].value;

        if (index === -1 && value < 1) continue;

        const target = node.clone(false);
        target.formats = [...(target.formats || [])];
        if (index !== -1 && value < 1) {
            target.formats.splice(index, 1);
        } else if (index !== -1) {
            target.formats[index] = { type, value };
        } else {
            target.formats.push({ type, value });
        }

        const at = keys.root.concat(target.key);
        change[actions.REPLACE_NODES]({ at, data: [target] });

        if (node.key === keys.b[0]) break;
    }
}
