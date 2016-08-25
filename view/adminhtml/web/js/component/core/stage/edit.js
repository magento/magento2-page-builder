/**
 * - Edit.js
 * Allows users to edit elements within the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'uiClass',
    'ko',
    'jquery',
    'uiRegistry'
], function (Class, ko, $, registry) {

    /**
     * Edit class constructor
     *
     * @constructor
     */
    function Edit(entity) {
        this.parent = entity;
        this.entity = entity.config;
        this.modal = false;
    }

    /**
     * Return the form
     *
     * @returns {*}
     */
    Edit.prototype.getForm = function () {
        return registry.get('contentblock_entity_form.contentblock_entity_form');
    };

    /**
     * Open an edit panel
     *
     * @returns {*}
     */
    Edit.prototype.open = function () {
        var edit = registry.get('bluefoot_edit'),
            form = registry.get('bluefoot_edit.bluefoot_edit_form');

        // Override the onRender functionality
        this.handleOnRender(form);

        // Pass the save method over
        form.save = this.save.bind(this);
        form.close = function () {
            edit.closeModal();
        };

        // Record the original URL
        if (!form.renderSettings.originalUrl) {
            form.renderSettings.originalUrl = form.renderSettings.url;
        }

        // Only re-render the form completely if the code is different
        if (form.lastCode != this.entity.code) {
            form.renderSettings.url = form.renderSettings.originalUrl.replace('CONTENT_BLOCK_IDENTIFIER', this.entity.code);
            form.destroyInserted();
        }
        form.lastCode = this.entity.code;

        edit.setTitle($.mage.__('Edit ' + this.entity.name));

        form.resetForm();
        form.render();

        this.modal = edit;

        return edit.openModal();
    };

    /**
     * Intercept the onRender of the form to implement further logic
     *
     * @param form
     */
    Edit.prototype.handleOnRender = function (form) {
        var _originalRender = form.onRender,
            that = this;
        form.onRender = function (data) {
            _originalRender.call(form, data);

            // The form.externalSource doesn't appear to be available on initial render, so start a loop
            // waiting for its presence
            var source,
                interval = setInterval(function () {
                if (source = form.externalSource()) {
                    clearInterval(interval);
                    source.set('data.entity', that.parent.data());
                }
                }, 5);
        };
    };

    /**
     * Save the edit contents
     *
     * @param redirect
     * @param closeModal
     */
    Edit.prototype.save = function (redirect, closeModal) {
        var form = this.getForm();
        form.validate();

        if (!form.additionalInvalid && !form.source.get('params.invalid')) {
            var entityData = form.source.get('data.entity');
            this.parent.data(entityData);
            this.parent.data.valueHasMutated();

            // Destroy the original instance of the source
            form.source.destroy();
        }

        if (closeModal) {
            this.modal.closeModal();
        }

        return false;
    };

    return Edit;
});