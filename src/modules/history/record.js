export default class Record {
    constructor (change) {
        this.state = change.state;
        this.operations = change.operations;
    }
}
