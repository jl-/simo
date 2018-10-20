import Format from './format';
import { renderModes } from '../meta/node';

export const Options = {
};

export class Indent extends Format {
    [renderModes.DECORATION] (node, $node) {
        $node.style['padding-left'] = `${node.value}em`;
    }
}

export default { ...Options, Ctor: Indent };
