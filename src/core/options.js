import * as builtinFmts from '../formats';
import { schema as builtinSchema } from '../meta/node';

export default function sanitize (options = {}) {
    const modules = options.modules || {};
    const readonly = Boolean(options.readonly);
    const formats = options.formats || builtinFmts;
    const schema = options.schema || builtinSchema;

    return Object.freeze({ ...options, schema, formats, modules, readonly });
}
