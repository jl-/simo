export default class Format {
    constructor (options = {}) {
        this.active = false;
        Object.assign(this, options);
    }

    update (selection) {
        const { isCollapsed, focus } = selection;
        if (isCollapsed && focus.nodes.length) {
            const formats = focus.nodes[0].formats;
            this.active = formats && formats.indexOf(this.name) !== -1;
        } else {
            this.active = false;
        }
        this.$control.classList[this.active ? 'add' : 'remove']('toolbar__icon--active');
    }
}
