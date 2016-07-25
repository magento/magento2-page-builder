/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'ko',
    'Magento_Variable/variables'
], function (Wysiwyg, $, ko) {
    'use strict';

    return Wysiwyg.extend({
        /**
         *
         * @param {HTMLElement} node
         */
        setElementNode: function (node) {
            // Store the namespace on the button
            var namespace;
            if (typeof this.ns !== 'undefined' && this.ns) {
                namespace = this.ns;
            } else if (typeof this.namespace !== 'undefined' && this.namespace) {
                namespace = this.namespace;
            }

            $(node).prevAll('.buttons-set').find('.init-gene-bluefoot').attr('data-namespace', namespace);
            $(node).bindings({
                value: this.value
            });
        }
    });
});
