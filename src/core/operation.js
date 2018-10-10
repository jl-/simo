export default class Operation {
    constructor (data = {}) {
        this.type = data.type;
        this.data = data.data;
        this.meta = data.meta;
        this.focus = data.focus;
        this.anchor = data.anchor;
        this.from = data.from;
        this.to = data.to;
        this.initiator = data.initiator || this.type;
    }
}
