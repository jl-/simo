import State from './state';
import Schema from './schema';
import Change from './change';
import Keyboard from './keyboard';
import Selection from './selection';
import sanitizeOptions from './options';
import { on, off } from '../utils/event';
import { editorEvents, editorHooks } from '../meta/events';

export default class Editor {
    static Renderer;

    static modules = new Map();
    static module (name, Ctor = this.modules.get(name)) {
        return this.modules.set(name, Ctor).get(name);
    }

    constructor (options) {
        this.options = sanitizeOptions(options);

        this.modules = new Map();
        this.hooks = Object.create(null);
        this.selection = new Selection();
        this.schema = new Schema(this.options.schema);
        this.keyboard = new Keyboard(this.options.keyboard);
        this.invokeHooks(editorHooks.CREATED, this);
    }

    mount (renderer, state) {
        const options = this.options;
        this.state = new State(state, this.schema);

        this.renderer = !(renderer instanceof HTMLElement) ? renderer :
            new this.constructor.Renderer(renderer, options.renderer, this);

        this.enable(!options.readonly);

        for (const [name, Ctor] of this.constructor.modules) {
            if (options.modules[name] !== false) {
                this.module(name, Ctor, options.modules[name]);
            }
        }

        this.invokeHooks(editorHooks.BEFORE_MOUNT, this);
        this.renderer.render(this.state);
        this.invokeHooks(editorHooks.MOUNTED, this);
    }

    module (name, Ctor, options) {
        if (typeof Ctor === 'function') {
            this.modules.set(name, new Ctor(this, options));
        }
        return this.modules.get(name);
    }

    enable (value = true) {
        this.readonly = !value;
        for (const hook of editorEvents.keys()) {
            (this.readonly ? off : on)(this.renderer.view, hook, this);
        }
        this.renderer.view.setAttribute('contenteditable', !this.readonly);
    }

    handleEvent (event) {
        const change = new Change(this.state, this.selection);
        change.digestSelection(this.renderer.mapSelection(this.selection));
        for (const instance of this.modules.values()) {
            if (typeof instance.handle === 'function' &&
                instance.handle(change, event, this)) {
                break;
            }
        }
        if (!change.pristine) this.apply(change);
    }

    hook (name, target) {
        if (name && (typeof target === 'function' || (
            target && typeof target.hook === 'function'))) {
            (this.hooks[name] || (this.hooks[name] = new Set())).add(target);
        }
        return this;
    }

    invokeHooks (name, ...params) {
        const hooks = this.hooks[name];
        if (hooks && hooks.size > 0) {
            for (const target of hooks) {
                if (typeof target === 'function') {
                    target(...params);
                } else if (typeof target.hook === 'function') {
                    target.hook(...params);
                }
            }
        }
    }

    dispatch (name, ...params) {
        const hooks = this.hooks[name];
        if (!hooks || hooks.size === 0) return;
        const change = new Change(this.state, this.selection);
        this.invokeHooks(name, change, this, ...params);
        if (!change.pristine) this.apply(change);
    }

    apply (change) {
        this.state = change.state;
        this.renderer.render(this.state, change);
        this.invokeHooks(editorHooks.UPDATED, change, this);
    }

    focus () {
        if (!this.options.readonly) {
            this.renderer.view.focus();
        }
    }
}
