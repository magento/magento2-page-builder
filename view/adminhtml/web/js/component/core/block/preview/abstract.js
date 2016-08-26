/**
 * - Abstract.js
 * Abstract class for preview areas of a block
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'underscore'
], function (ko, _) {

    /**
     * PreviewAbstract block
     *
     * @constructor
     */
    function AbstractPreview(parent, config) {
        this.parent = parent;
        this.config = config;

        this.setupFields();
    }

    /**
     * Setup dyanmic fields for preview template
     */
    AbstractPreview.prototype.setupFields = function () {
        _.forEach(this.config.fields_list, function (field) {
            this[field] = ko.observable(false);
        }.bind(this));
    };

    /**
     * Return the preview template
     *
     * @returns {*}
     */
    AbstractPreview.prototype.getPreviewTemplate = function () {
        if (typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
            return this.config.preview_template;
        }

        return false;
    };

    /**
     * Update our preview object
     *
     * @param data
     */
    AbstractPreview.prototype.update = function (data) {
        _.forEach(data, function (value, key) {
            if (typeof this[key] !== 'undefined') {
                this[key](value);
            }
        }.bind(this));
    };

    return AbstractPreview;
});