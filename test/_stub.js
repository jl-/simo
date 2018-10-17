const origins = new Map();

const depId = dep => `${dep}.js`;

function stub (mod, dep, fake) {
    const id = depId(dep);
    const target = mod.bundle(id);
    origins.set(id, mod.bundle.cache[id]);

    const stubed = new mod.bundle.Module(id);
    Object.defineProperty(stubed.exports, '__esModule', {
        value: true
    });

    if (fake && Object.prototype.toString.call(fake) === '[object Object]') {
        Object.assign(stubed.exports, target, fake);
    } else {
        stubed.exports.default = fake;
    }

    return mod.bundle.cache[id] = stubed;
}

stub.restore = function (mod, dep) {
    const id = depId(dep);
    mod.bundle.cache[id] = origins.get(id);
};

export default stub;
