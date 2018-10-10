export default class Formatter {
    constructor (editor, formats = {}) {
        this.formats = new Map();
        editor.hook('format', ::this.handle);

        for (const name of Object.keys(formats)) {
            const { Ctor, ...options } = formats[name];
            if (typeof Ctor === 'function') {
                this.formats.set(name, new Ctor(options, editor));
            }
        }
    }

    handle (type, ...params) {
        return this.formats.get(type).handle(...params);
    }

    toggle (type, ...params) {
        return this.formats.get(type).toggle(...params);
    }
}
