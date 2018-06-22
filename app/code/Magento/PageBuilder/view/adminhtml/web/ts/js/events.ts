import uiEvents from "uiEvents";

export default {
    /**
     * Calls callback when name event is triggered
     *
     * @param {string} events
     * @param {Function} callback
     * @param {Function} ns
     * @return {object}
     */
    on(events, callback, ns) {
        uiEvents.on(events, callback, ns);
        return this;
    },

    /**
     * Removed callback from listening to target event
     *
     * @param {string} ns
     * @return {object}
     */
    off(ns) {
        uiEvents.off(ns);
        return this;
    },

    /**
     * Triggers event and executes all attached callbacks
     *
     * @param {string} name
     * @returns {boolean}
     */
    trigger(name) {
        return uiEvents.trigger(name);
    },
};
