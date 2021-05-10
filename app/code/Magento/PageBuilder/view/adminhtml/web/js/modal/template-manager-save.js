/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'jquery',
    'underscore',
    'mage/translate',
    'Magento_Ui/js/modal/prompt'
], function ($, _, $t) {
    'use strict';

    $.widget('mage.templateManagerSave', $.mage.prompt, {
        options: {
            createdForField: '[data-role="createdForField"]',
            previewImage: '[data-role="preview-image"]',
            previewImageSpinner: '[data-role="preview-image-spinner"]',
            saveButton: '[data-role="action"].action-save',
            form: 'form',
            buttons: [{
                text: $.mage.__('Cancel'),
                class: 'action-secondary action-dismiss',

                /**
                 * Click handler.
                 */
                click: function () {
                    this.closeModal();
                }
            }, {
                text: $.mage.__('Save'),
                class: 'action-primary action-save',

                /**
                 * Click handler.
                 */
                click: function () {
                    this.submit();
                }
            }]
        },

        /**
         * Create widget
         *
         * @private
         */
        _create: function () {
            this._super();

            this.modal.find(this.options.saveButton).prop('disabled', 'disabled');
            // Ensure if the form is submitted through hitting enter we handle it correctly
            this.modal.find(this.options.form).on('submit', function (event) {
                event.preventDefault();
                this.submit();
            }.bind(this));
        },

        /**
         * Validate prompt contains a template name
         *
         * @returns {Boolean}
         */
        validate: function () {
            return this.modal.find(this.options.promptField) &&
                !_.isEmpty(this.modal.find(this.options.promptField).val());
        },

        /**
         * Save the values within the prompt
         */
        submit: function () {
            var name,
                createdFor;

            if (this.options.validation && !this.validate()) {
                return false;
            }

            $('body').trigger('processStart');

            name = this.modal.find(this.options.promptField).val();
            createdFor = this.modal.find(this.options.createdForField).val();

            this.options.actions.confirm.call(this, name, createdFor).then(function () {
                this.closeModal(true);
                $('body').trigger('processStop');
            }.bind(this)).catch(function () {
                $('body').trigger('processStop');
            });
        },

        /**
         * Set the preview image
         *
         * @param {String} image
         */
        setPreviewImage: function (image) {
            var previewImage = this.modal.find(this.options.previewImage),
                previewImageSpinner = this.modal.find(this.options.previewImageSpinner);

            // Update the preview image within the modal
            previewImageSpinner.hide();
            previewImage.append(
                $('<img />').prop('src', image).prop('alt', $t('Template Preview'))
            ).show();

            // Enable the button so the user can save
            this.modal.find(this.options.saveButton).removeProp('disabled');
        },

        /**
         * Close modal window
         */
        closeModal: function (saved) {
            if (!saved) {
                this.options.actions.cancel.call(this, saved);
            }

            this.options.actions.always();
            this.element.on('promptclosed', _.bind(this._remove, this));

            return this._super();
        }
    });

    return function (config) {
        return $('<div class="prompt-message"></div>').html(config.content).templateManagerSave(config);
    };
});
