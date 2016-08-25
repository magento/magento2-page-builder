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
        }

        if (closeModal) {
            this.modal.closeModal();
        }
        return false;
    };

    return Edit;
});