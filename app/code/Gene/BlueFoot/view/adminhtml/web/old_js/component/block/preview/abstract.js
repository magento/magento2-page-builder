/**
 * - Abstract.js
 * Abstract class for preview areas of a block
 *
 */
define([
    'ko',
    'underscore',
    'jquery',
    'bluefoot/config',
    'bluefoot/ko-liveedit'
], function (ko, _, $, Config) {

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
            this[field] = ko.observable();
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
                /* @todo re-implement options once new storage format for fields is implemented
                if (typeof field.options !== 'undefined') {
                    value = this.getOptionValue(value, field.options);
                } */
                this[key](value);
            }
        }.bind(this));
    };

    /**
     * Return the option value for a field
     *
     * @param value
     * @param options
     * @returns {*}
     */
    AbstractPreview.prototype.getOptionValue = function (value, options) {
        var findOption = $.grep(options, function (option) {
            return option.value === value;
        });
        if (typeof findOption[0] !== 'undefined') {
            return findOption[0].label;
        }

        return value;
    };

    return AbstractPreview;
});