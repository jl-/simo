import prism from 'prismjs';
import Format from './format';
import * as actions from '../meta/actions';
import { nodeTypes, VOID_CHAR } from '../meta/node';
import { h, keyAttrs, sibling, edgeText } from '../utils/dom';
import 'prismjs/themes/prism.css';

export const Options = {
    tag: 'code',
    language: 'javascript'
};

export class Code extends Format {
    isInline (node) {
        return !node.meta || node.meta.inline !== false;
    }

    pointOf ($node, offset, node) {
        const $root = this.renderer.$nodeOf(node.key);
        while ($node && $node !== $root) {
            let $n = $node;
            if ($n.textContent === VOID_CHAR && offset === 1) {
                offset -= 1;
            }
            while ($n = sibling($n, false, null)) {
                offset += $n.textContent.length;
                if ($n.tagName === 'DIV' && $n.textContent !== VOID_CHAR) {
                    offset += 1;
                }
            }
            $node = $node.parentElement;
        }
        return { offset };
    }

    $pointOf (node, _offset, $node) {
        let $n, $nodes = [$node], line;
        let offset = _offset < 0 ? $node.textContent.length : _offset;
        while ($n = $nodes.shift()) {
            if ($n.nodeType === nodeTypes.TEXT) {
                if (offset <= $n.textContent.length) {
                    break;
                } else {
                    offset -= $n.textContent.length;
                }
            } else if ($n.tagName.toUpperCase() === 'DIV') {
                if (line && $n.textContent !== VOID_CHAR) {
                    offset -= 1;
                } else {
                    line = true;
                }
            }
            if ($n.childNodes.length) $nodes.unshift(...$n.childNodes);
        }
        if (!$n) {
            $n = edgeText($node, true);
            offset = $n.textContent.length;
        }

        return { node: $n, offset: Math.min(offset, $n.textContent.length) };
    }

    grammerOf (node) {
        const lang = node.meta && node.meta.language;
        return prism.languages[lang || this.language];
    }

    render (node, mode, context) {
        if (this.isInline(node)) {
            return super.render(node, mode, context);
        }

        const $code = h(this.tag());
        const grammer = this.grammerOf(node);
        $code.appendChild(h('div'));
        for (const token of prism.tokenize(node.text, grammer)) {
            if (typeof token === 'string') {
                for (const str of token.split(/(\n)/)) {
                    if (str === '\n') {
                        $code.appendChild(h('div'));
                    } else if (str) {
                        $code.lastChild.appendChild(h('span', null, str));
                    }
                }
            } else {
                const attrs = { class: `token ${token.type}` };
                $code.lastChild.appendChild(h('span', attrs, token.content));
            }
        }
        for (const $line of [...$code.childNodes]) {
            if (!$line.lastChild) {
                $line.appendChild(h('span', null, VOID_CHAR));
            }
        }

        const $pre = h('pre', keyAttrs(node.key, node.attrs));
        $pre.appendChild($code);
        return $pre;
    }

    [actions.REPLACE_TEXT] (operation) {
        const node = operation.to;
        const $node = this.renderer.$nodeOf(node.key);
        $node.replaceWith(this.render(node));
    }
}

export default { ...Options, Ctor: Code };
