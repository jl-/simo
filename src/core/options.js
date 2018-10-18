import { sanitizeSchema } from '../schema';

export default function sanitize (options = {}) {
    const modules = options.modules || {};
    const readonly = Boolean(options.readonly);
    const schema = sanitizeSchema(options.schema);

    return Object.freeze({ ...options, schema, modules, readonly });
}
