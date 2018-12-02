const isPassiveEventSupported = (() => {
    let isSupported = false;
    try {
        window.addEventListener('passive', null, {
            get passive () {
                return isSupported = true;
            }
        });
    } catch (err) {
        //
    }
    return () => isSupported;
})();

function coerceEventOptions (options = {}) {
    const passive = isPassiveEventSupported();
    return passive ? options : Boolean(options.capture);
}

export function on (el, evtn, func, options) {
    el.addEventListener(evtn, func, coerceEventOptions(options));
}

export function off (el, evtn, func, options) {
    el.removeEventListener(evtn, func, coerceEventOptions(options));
}
