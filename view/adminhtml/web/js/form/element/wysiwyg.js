/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'ko',
    'uiRegistry',
    'Magento_Variable/variables'
], function (Wysiwyg, $, ko, registry) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added BlueFoot functionality
     */
    return Wysiwyg.extend({
        bluefoot: {
            stageTemplate: 'Gene_BlueFoot/component/core/stage.html',
            stage: {},
            content: ko.observableArray([]),

            /**
             * Retrieve the panel from the registry
             *
             * @returns {*}
             */
            getBlueFootPanel: function () {
                return registry.get('bluefoot-panel');
            },

            /**
             * Bind a click event to the BlueFoot init button
             *
             * @param node
             */
            bindBlueFootButton: function (node) {
                $(node).prevAll('.buttons-set').find('.init-gene-bluefoot').on('click', this.buildBlueFoot.bind(this));
            },

            /**
             * Handle a click event requesting that we build BlueFoot
             *
             * @param event
             */
            buildBlueFoot: function (event) {
                event.stopPropagation();
                var panel;
                if (panel = this.getBlueFootPanel()) {
                    panel.buildPanel();
                } else {
                    console.warn('Unable to locate the BlueFoot panel for initialization.');
                }
            },

            addRow: function () {
                console.log('addRow');
            }
        },

        /**
         *
         * @param {HTMLElement} node
         */
        setElementNode: function (node) {
            $(node).bindings({
                value: this.value
            });

            // Bind our event to the WYSIWYG editor
            this.bluefoot.bindBlueFootButton(node);
        }

    });
});
