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

function sanitizeEventOptions (options = {}) {
    const passive = isPassiveEventSupported();
    return passive ? options : Boolean(options.capture);
}

export function on (el, evtn, func, options) {
    el.addEventListener(evtn, func, sanitizeEventOptions(options));
}

export function off (el, evtn, func, options) {
    el.removeEventListener(evtn, func, sanitizeEventOptions(options));
}
