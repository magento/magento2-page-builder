/**
 * - Save Binder
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'hyperscript',
    'underscore',
    'ko'
], function (h, _, ko) {

    /**
     * Strip all [data-bind] attributes on elements
     *
     * @param element
     * @returns {*}
     */
    function cleanup(elements) {
        _.forEach(elements, function (element) {
            element.removeAttribute('data-bind');
            if (element.children && element.children.length > 0) {
                cleanup(element.children);
            }
        });

        return elements;
    }

    return {
        /**
         * Bind a view model to a domElement, returning the binded HTML
         *
         * @param viewModel
         * @param domElement
         * @returns {HTMLCollection}
         */
        applyBindings: function (viewModel, domElement) {
            if (typeof viewModel !== 'object') {
                throw new Error('You can only bind an object to a dom element.');
            }

            var wrapped = h('div', domElement);

            // If we're unable to applyBindings for any reason we shouldn't throw a hard error
            try {
                ko.applyBindings(viewModel, wrapped);
            } catch (e) {
                console.warn('A failure occurred whilst trying to bind the representation', e);
            }

            return cleanup(wrapped.children);
        }
    }
});