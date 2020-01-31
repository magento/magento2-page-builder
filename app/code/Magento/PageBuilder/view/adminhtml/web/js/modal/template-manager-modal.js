/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Ui/js/modal/modal-component',
    'Magento_PageBuilder/js/events',
    'underscore',
    'Magento_PageBuilder/js/stage-builder'
], function ($, ModalComponent, events, _, stageBuilder) {
    'use strict';

    return ModalComponent.extend({
        defaults: {
            stage: null,
            modules: {
                messageContainer: '${ $.messageContainerProvider }',
                listing: '${ $.listingProvider }'
            }
        },

        /** @inheritdoc */
        initialize: function () {
            this._super();
            _.bindAll(this, 'closeModal');

            events.on('stage:templateManager:open', function (params) {
                this.openModal();
                this.stage = params.stage;
            }.bind(this));

            return this;
        },

        /**
         * Apply selected template
         *
         * @param {String} template
         */
        applySelected: function (template) {
            if (template) {
                // Destroy the old content in the stage
                this.stage.pageBuilder.destroy();
                $('body').trigger('processStart');

                stageBuilder(this.stage, template).then(function () {
                    $('body').trigger('processStop');
                    this.closeModal();
                }.bind(this));
            }
        }
    });
});
