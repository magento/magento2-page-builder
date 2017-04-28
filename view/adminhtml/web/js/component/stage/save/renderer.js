/**
 * - Save Renderer
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'Magento_Ui/js/lib/knockout/template/renderer'
], function (renderer) {

    return {
        /**
         * Retrieve and render a Knockout JS template from the server
         *
         * @param template
         * @return {Promise}
         */
        render: function (template) {
            return renderer.render(template);
        }
    }
});