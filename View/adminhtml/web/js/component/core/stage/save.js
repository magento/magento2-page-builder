/**
 * - Save.js
 * Handles saving the data from within the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/hook', 'bluefoot/jquery'], function (Hook, jQuery) {

    /**
     * Our Stage class
     *
     * @constructor
     */
    function Save(stage) {
        this.stage = stage;
        this.input = false;
        this.stageData = false;

        this.deleted = [];

        this.initInput();
        this.initEvents();
    }

    /**
     * Add an input to the page to store the pages structure
     */
    Save.prototype.initInput = function () {
        var inputName = this.stage.textarea.attr('name');
        this.input = jQuery('<input />').attr('type', 'hidden').attr('name', 'gene-bluefoot[' + inputName + ']');
        this.input.insertBefore(this.stage.container);
    };

    /**
     * When an entity is deleted we need to clean up by removing it's entry in the database
     *
     * @param entityId
     */
    Save.prototype.delete = function (entityId) {
        this.deleted.push(entityId);
    };

    /**
     * Disable the save functionality of the system
     */
    Save.prototype.disable = function () {
        this.input.attr('disabled', 'disabled');
    };

    /**
     * Enable the save functionality of the system
     */
    Save.prototype.enable = function () {
        this.input.removeAttr('disabled');
    };

    /**
     * Init any events needed for updating the save information
     */
    Save.prototype.initEvents = function () {
        Hook.attach('gene-bluefoot-stage-updated', this.onStageUpdated.bind(this), this.stage);
    };

    /**
     * Whenever the stage is updated we need to re-generate the JSON
     *
     * @param $hook
     */
    Save.prototype.onStageUpdated = function ($hook) {
        this.serializeStage(function (stageData) {
            this.stageData = stageData;

            this.input.val(JSON.stringify(this.stageData));
            if ($hook && typeof $hook.done === 'function') {
                $hook.done();
            }
        }.bind(this));
    };

    /**
     * Return the JSON data
     * @returns {*}
     */
    Save.prototype.getData = function () {
        return JSON.parse(this.input.val());
    };

    /**
     * Serialize the current stage
     */
    Save.prototype.serializeStage = function (callbackFn) {
        // Retrieve all the rows
        var elements = this.getElementsForSave();
        if (elements.length) {
            var serialized = this.serializeElements(elements);
            if (serialized) {
                var extra = {
                    type: 'extra',
                    deleted: this.deleted
                };

                // Include the store ID if the user has filtered
                var storeId;
                if (storeId = this.stage.getStoreId()) {
                    extra.storeId = storeId;
                }

                Hook.trigger('gene-bluefoot-stage-save-extra', {
                    serialized: serialized,
                    extra: extra
                }, function (params) {
                    params.serialized.push(params.extra);
                    if (typeof callbackFn === 'function') {
                        callbackFn(params.serialized);
                    }
                }, false, this.stage);
            }
        }

        return false;
    };

    /**
     * Serialize elements
     *
     * @param elements
     * @returns []
     */
    Save.prototype.serializeElements = function (elements) {
        var serialized = [];
        jQuery.each(elements, function (index, element) {
            serialized.push(this.serializeIndividual(element));
        }.bind(this));
        return serialized;
    };

    /**
     * Serialize an individual element
     *
     * @param element
     * @returns {*}
     */
    Save.prototype.serializeIndividual = function (element) {
        var serialized = {};
        if (typeof element.serialize === 'function' || jQuery(element).data('class')) {
            var elementClass = (typeof element.serialize === 'function' ? element : jQuery(element).data('class'));
            if (typeof elementClass.serialize === 'function') {
                serialized = elementClass.serialize();
            }

            // Does this element have any children?
            if (typeof elementClass.children !== 'undefined') {
                jQuery.each(elementClass.children, function (name, children) {
                    if (typeof serialized.children === 'undefined') {
                        serialized.children = {};
                    }
                    serialized.children[name] = this.serializeElements(children);
                }.bind(this));
            }
        } else if (jQuery(element).data('type')) {
            serialized = {
                type: jQuery(element).data('type')
            };
            if (jQuery(element).data('formData')) {
                serialized.formData = jQuery(element).data('formData');
            }

            // Does the element have any children?
            var children = this.getElementsForSave(jQuery(element));
            if (children) {
                if (typeof serialized.children === 'undefined') {
                    serialized.children = [];
                }
                serialized.children = this.serializeElements(children);
            }
        }

        return serialized;
    };

    /**
     * Return any elements with data-flagged upon them
     *
     * @returns {*}
     */
    Save.prototype.getElementsForSave = function (parent) {
        var elements;
        if (!parent) {
            elements = jQuery(this.stage.container.find('.gene-bluefoot-stage-content-inner')).find('>[data-flagged]');
        } else {
            elements = jQuery(parent).find('>.gene-bluefoot-droppable >[data-flagged]');
        }

        if (elements.length > 0) {
            return elements;
        }

        return false;
    };

    return Save;
});
