/**
 * Live Edit system
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'jquery'
], function (ko, $) {

    /**
     * An option within the live edit system
     *
     * @param key
     * @param config
     * @param context
     * @constructor
     */
    function LiveEditOption(key, config, context) {
        this.key = key;
        this.config = config;
        this.context = context;
    }

    /**
     * Retrieve the template for
     * @returns {*}
     */
    LiveEditOption.prototype.getTemplate = function () {
        if (this.config.type) {
            return 'Gene_BlueFoot/component/block/live-edit/options/' + this.config.type;
        }

        return false;
    };

    /**
     * Update a value on the parent context
     *
     * @param value
     */
    LiveEditOption.prototype.updateValue = function (value) {
        var data = this.context.data();
        data[this.key] = value;
        this.context.data(data);
    };

    /**
     * Live Edit class
     *
     * @param element
     * @param fields
     * @param context
     * @constructor
     */
    function LiveEdit(element, fields, context) {
        this.options = ko.observableArray([]);
        this.element = $(element);
        this.fields = fields;
        this.context = context;

        this.init();
    }

    /**
     * Init the live edit functionality
     */
    LiveEdit.prototype.init = function () {
        this.element.addClass('bluefoot-ko-live-edit');

        // Add our live edit template to the context
        this.context.liveEditTemplate = 'Gene_BlueFoot/component/block/live-edit/options';
        this.context.liveEdit = this;

        // Populate our options from the provided fields
        ko.utils.arrayForEach(this.fields, function (field) {
            this.options.push(new LiveEditOption(field.code, field, this.context));
        }.bind(this));
    };

    /**
     * Create a binding for KO
     *
     * @type {{init: ko.bindingHandlers.liveEdit.init}}
     */
    ko.bindingHandlers.liveEdit = {

        /**
         * Init live editing on the item
         *
         * @param element
         * @param valueAccessor
         * @param allBindingsAccessor
         * @param context
         * @param bindingContext
         * @returns {boolean}
         */
        init: function (element, valueAccessor, allBindingsAccessor, context, bindingContext) {
            if (typeof valueAccessor().fields === 'undefined') {
                return false;
            }

            // Retrieve valid fields
            var fields = valueAccessor().fields,
                validFields = [];

            ko.utils.arrayForEach(fields, function (field) {
                if (typeof context.config.fields[field] === 'object') {
                    validFields.push(context.config.fields[field]);
                }
            });

            if (validFields.length > 0) {
                new LiveEdit(element, validFields, context);
            }
        }
    }

});