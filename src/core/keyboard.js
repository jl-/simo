export default class Keyboard {
    constructor () {
        this.hotkeys = {};
    }

    register (name, handler) {
        this.hotkeys[name] = handler;
    }

    matchHotkey (event) {
        return false;
    }

    willProduceChar (event) {
        return event.type === 'keydown' && !event.isComposing && event.key.length === 1;
    }
}
