import * as list from './list';
import * as block from './block';
import * as indent from './indent';
import * as heading from './heading';
import * as blockquote from './blockquote';
import { blockTypes, inlineTypes } from '../meta/node';

export const builtinFormats = {
    list, block, indent, heading, blockquote
};

export function sanitizeSchema (schema = {}) {
    return {
        blockTypes, inlineTypes, ...schema,
        formats: mergeFormats(schema.formats)
    };
}

export function mergeFormats (formats = {}) {
    const result = { ...builtinFormats };

    const ts = Object.prototype.toString;
    for (const name of Object.keys(formats)) {
        const format = formats[name];
        const isObj = ts.call(format) === '[object Object]';
        result[name] = isObj ? { ...result[name], ...format } : null;
    }

    return result;
}
