module.exports = function () {
    const renderCallbacks = [];
    const readyCallbacks = [];
    let isReady = false;

    const invokeError = (callbacks, errorMessage) => {
        while(callbacks.length) {
            const [, error] = callbacks.pop();
            error(errorMessage)
        }
    };

    const invokeSuccess = (callbacks, result) => {
        while(callbacks.length) {
            const [success] = callbacks.pop();
            success(result)
        }
    };

    return {
        showBorders: true,
        userSelect: true,
        createErrorHandler() {
            return (errorEvent) => {
                invokeError(renderCallbacks, errorEvent);
                invokeError(readyCallbacks, errorEvent);
            }
        },
        waitForRender(callback, error) {
            renderCallbacks.push([callback, error]);
        },
        waitForReady(callback, error) {
            readyCallbacks.push([callback, error]);
        },
        loading(value) {
            isReady = !value;
            invokeSuccess(readyCallbacks, value);
        },
        alertDialog () {},
        value(value) {
            if (value && isReady) {
                invokeSuccess(renderCallbacks, value);
            }
        }
    };
};
