/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'Magento_Ui/js/form/element/wysiwyg',
    'Magento_Ui/js/lib/view/utils/async',
    'ko',
    'uiRegistry',
    'jquery',
    'bluefoot/stage',
    'bluefoot/common',
    'Magento_Variable/variables'
], function (Wysiwyg, $, ko, registry, jQuery, Stage, Common) {
    'use strict';

    /**
     * Extend the original WYSIWYG with added BlueFoot functionality
     */
    return Wysiwyg.extend({
        defaults: {
            stageActive: false,
            stage: {},
            stageId: Common.guid(),
            stageContent: [],
            showBorders: false,
            links: {
                stageActive: false,
                stage: {},
                stageId: false,
                stageContent: [],
                showBorders: false
            }
        },

        /**
         *
         * @returns {exports}
         */
        initObservable: function () {
            this._super()
                .observe('value stageActive stageContent showBorders');

            return this;
        },

        /**
         *
         * @param {HTMLElement} node
         */
        setElementNode: function (node) {
            $(node).bindings({
                value: this.value
            });

            this.bindBlueFootButton(node);
        },

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

                this.stage = new Stage(this, this.stageId, this.stageContent);

                // Hide the WYSIWYG and display the stage
                jQuery(event.currentTarget).parents('[data-namespace]').hide();

                // Mark the stage as active bringing it into display
                this.stageActive(true);

            } else {
                console.warn('Unable to locate the BlueFoot panel for initialization.');
            }
        },

        /**
         * Return the BlueFoot stage templage
         *
         * @returns {string}
         */
        getStageTemplate: function () {
            return 'Gene_BlueFoot/component/core/stage.html';
        }

    });
});
