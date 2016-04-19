/**
 * - Hook.js
 * Handles observer event (pub/sub) magic
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([], function () {

    /**
     * Store all hooks within the object
     *
     * @type {{}}
     */
    var hooks = {};

    return {

        /**
         * Attach a function to a hook, this will get called when the events name is triggered. Once the operation within
         * an attached hook is completed it MUST call $hook.done(). Failing to do so will break functionality
         *
         * @param name
         * @param fn
         * @param context
         */
        attach: function (name, fn, context) {
            context = context || hooks;
            if (typeof context.hooks === 'undefined') {
                context.hooks = {};
            }
            if (typeof context.hooks[name] === 'undefined') {
                context.hooks[name] = [];
            }
            context.hooks[name].push(fn);
        },

        /**
         * Trigger a hook, this will iterate through all hooks, execute them and then run any complete functions associated
         * with the trigger
         *
         * @param name
         * @param params
         * @param completeFn
         * @param context
         */
        trigger: function (name, params, completeFn, context) {
            context = context || hooks;
            params = params || {};
            if (typeof context.hooks !== 'undefined' && typeof context.hooks[name] !== 'undefined') {

                // Store the original events for this name so we can restore after they've been triggered
                var runHooks = context.hooks[name].slice(0);

                // Trigger the next event and loop
                this.triggerNextEvent(runHooks, params, completeFn, context);

            } else if (typeof context.hooks === 'undefined' || typeof context.hooks[name] === 'undefined' || !this.hasHooks(name, context)) {
                // Handle events that have no subscribers
                if (typeof completeFn === 'function') {
                    return completeFn(params);
                }
                return true;
            }
        },

        /**
         * Determine whether there are any hooks under a certain name, avoided using jQuery
         *
         * @param name
         * @param context
         * @returns {boolean}
         */
        hasHooks: function (name, context) {
            for (var prop in context.hooks[name]) {
                if (context.hooks[name].hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        /**
         * Loop back function that calls each hook, waits for the hook to call $hook.done() and then runs the next
         * hook in the chain. Once the chain is completed it runs any complete functions and restores the hook arrays
         *
         * @note all attached events must run $hook.done()
         *
         * @param hooks
         * @param params
         * @param completeFn
         * @param context
         * @returns {*}
         */
        triggerNextEvent: function (hooks, params, completeFn, context) {
            context = context || hooks;
            if (typeof hooks === 'object') {

                // Run the complete function
                if (hooks.length == 0) {
                    if (typeof completeFn === 'function') {
                        return completeFn(params);
                    }
                    return true;
                }

                // Declare the $hook done function
                var $hook = {
                    done: function () {
                        return this.triggerNextEvent(hooks, params, completeFn);
                    }.bind(this),
                    params: params
                };

                // Grab the next event
                var nextEvent = hooks.shift();
                nextEvent.call(context, $hook);
            }
        }
    }
});