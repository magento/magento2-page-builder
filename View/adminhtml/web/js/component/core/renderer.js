/**
 * - Renderer.js
 * Creates an interface between the CMS and mustache.js
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/mustache', 'bluefoot/jquery', 'bluefoot/config'], function (Mustache, jQuery, Config) {
    return {

        /**
         * Render a template using Mustache
         *
         * @param text
         * @param data
         * @returns {*}
         */
        render: function (text, data) {
            return Mustache.render(text, data);
        },

        /**
         * Return rendered HTML from a config value and view
         *
         * @param code
         * @param view
         * @returns {string}
         */
        renderFromConfig: function (code, view) {
            var selector;
            if (selector = Config.getValue(code)) {
                var template = jQuery(selector);
                if (template) {
                    return this.render(template.html(), view);
                }
            }

            return '';
        }
    }
});