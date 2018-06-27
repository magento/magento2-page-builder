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
    on: (events: string, callback: () => {}, ns: () => {}) => {
        uiEvents.on("pagebuilder:" + events, callback, "pagebuilder:" + ns);
        return this;
    },

    /**
     * Removed callback from listening to target event
     *
     * @param {string} ns
     * @return {object}
     */
    off: (ns: string) => {
        uiEvents.off("pagebuilder:" + ns);
        return this;
    },

    /**
     * Triggers event and executes all attached callbacks
     *
     * @param {string} name
     * @param {any} args
     * @returns {boolean}
     */
    trigger: (name: string, args: any) => {
        return uiEvents.trigger("pagebuilder:" + name, args);
    },
};
