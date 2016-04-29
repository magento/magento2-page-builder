/**
 * - Edit.js
 * Handles the ability to edit a content type within the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/jquery/ui', 'bluefoot/hook', 'bluefoot/config', 'bluefoot/renderer', 'bluefoot/modal', 'jquery/bluefoot-accordion'], function (jQuery, jQueryUi, Hook, Config, Render, Modal) {

    /**
     * Initialize the edit panel against the stage. This is initialized by a user editing a content block within the
     * stage. The edit block can create new child instances of edit, this is to allow child & nested blocks.
     *
     * @param stage
     * @param entity
     * @param fields
     * @param parent
     * @constructor
     */
    function Edit(stage, entity, fields, parent) {
        this.stage = stage;
        this.entity = entity;
        this.fields = fields;

        this.parent = parent || this.stage;

        var timeout = 0;
        if (typeof this.parent.edit !== 'undefined' && this.parent.edit !== false) {
            this.parent.edit.removeClass('active');
            if (this.parent === this.stage) {
                jQuery('body').find('.gene-bluefoot-configure-overlay').removeClass('active');
            }
            if (this.parent.edit.hasClass('active')) {
                timeout = 200;
            } else {
                this.parent.edit.remove();
                this.parent.edit = false;
            }
        }

        this.editElement = false;

        // If we have to remove an old instance wait 200ms
        setTimeout(function () {
            if (timeout > 0) {
                this.parent.edit.remove();
                this.parent.edit = false;
            }
            this.init();
        }.bind(this), timeout);

        if (parent) {
            this.pushParents();
        }
    }

    /**
     * Init the edit panel
     */
    Edit.prototype.init = function () {
        var view = this.getView();

        Hook.trigger('gene-bluefoot-after-edit-view', {view: view}, function (params) {

            view = params.view;

            var editHtml = Render.renderFromConfig('configure_template', view);
            this.editElement = jQuery(editHtml);

            // Insert the edit element into the DOM
            jQuery('body').append(this.editElement);
            if (jQuery('body').find('.gene-bluefoot-configure-overlay').length == 0) {
                jQuery('body').append(jQuery('<div />').addClass('gene-bluefoot-configure-overlay'));
            }
            setTimeout(function () {
                this.editElement.addClass('active');
                jQuery('body').find('.gene-bluefoot-configure-overlay').addClass('active');
            }.bind(this), 0);

            // Render the fields
            this.renderFields();

            // Bind various events onto the edit panel
            this.bindEvents();

            Hook.trigger('gene-bluefoot-after-edit-init', {editElement: this.editElement}, false, this.stage);

            // Record the edit element against the stage
            this.parent.edit = this.editElement;
            jQuery(this.editElement).data('class', this);

            // Bind a click event to the overlay
            jQuery('body').find('.gene-bluefoot-configure-overlay').off('click').on('click', function (event) {
                event.stopPropagation();
                this.closeAll();
            }.bind(this));

            //this.handleNavigation();

            jQuery(this.editElement).find('.gene-bluefoot-configure-sidebar-container').tabs();

        }.bind(this), this.stage);
    };

    /**
     * Handle a user navigating back to an edit panel
     *
     * @todo this causes lots of glitches, needs a rebuild
     */
    Edit.prototype.handleNavigation = function () {
        // Handle users navigating back to a previous edit panel
        if (this.parent !== this.stage) {
            jQuery(this.parent.editElement).off('click').on('click', function (event) {

                // If the edit element is no longer inactive we shouldn't handle navigation
                if (!this.parent.editElement.hasClass('gene-bluefoot-inactive')) {
                    return false;
                }

                var activeEdits = jQuery(this.parent.editElement).nextAll('.gene-bluefoot-configure-sidebar');
                if (activeEdits.length > 0) {
                    jQuery.each(activeEdits, function (index, element) {
                        if (jQuery(element).data('class')) {
                            var editClass = jQuery(element).data('class');
                            if (typeof editClass.closeConfigure === 'function') {
                                editClass.closeConfigure(false, true);
                                this.removeInstance(element);
                            }
                        }
                    }.bind(this));
                }

                // Fix issues with positions
                this.parent.editElement.css({right: 0}).removeClass('gene-bluefoot-inactive');
                var priorEdits = jQuery(this.parent.editElement).prevAll('.gene-bluefoot-configure-sidebar');
                if (priorEdits.length > 0) {
                    var fromRight = 30;
                    jQuery.each(priorEdits, function (index, element) {
                        jQuery(element).css({right: fromRight});
                        fromRight += 30;
                    });
                }

            }.bind(this));
        }
    };

    /**
     * Push the parents to the right
     */
    Edit.prototype.pushParents = function () {
        if (typeof this.parent !== 'undefined' && this.parent.editElement) {
            this.parent.editElement.css({
                right: parseInt(this.parent.editElement.css('right')) + 30
            }).addClass('gene-bluefoot-inactive');

            // Push all the parents
            if (typeof this.parent.pushParents === 'function') {
                this.parent.pushParents();
            }
        }
    };

    /**
     * Retract the parents
     */
    Edit.prototype.retractParents = function () {
        if (typeof this.parent !== 'undefined' && this.parent.editElement) {
            var newRight = parseInt(this.parent.editElement.css('right')) - 30;
            if (newRight <= 0) {
                newRight = 0;
            }

            this.parent.editElement.css({
                right: newRight
            });

            // Push all the parents
            if (typeof this.parent.retractParents === 'function') {
                this.parent.retractParents();
            }
        }
    };

    /**
     * Bind events onto the sidebar
     */
    Edit.prototype.bindEvents = function () {
        this.editElement.find('.gene-bluefoot-close-configure').off('click').on('click', this.closeConfigure.bind(this));
        this.editElement.find('form').off('submit').on('submit', this.submitConfigure.bind(this));
    };

    /**
     * What should happen when the edit form is submitted?
     *
     * @param event
     */
    Edit.prototype.submitConfigure = function (event) {
        event.preventDefault();
        var form = jQuery(event.target);
        var data = this.serializeForm(form);

        // Validate the data in the form
        this.validateForm(data, function (data) {
            Hook.trigger('gene-bluefoot-save-configure-entity', {data: data, entity: this.entity}, function (params) {
                // Set the data on the entity
                this.entity.setData(params.data);
                Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
                return this.closeConfigure();
            }.bind(this), this.stage);
        }.bind(this), function (errorMsg) {
            return Modal.alert(errorMsg, 'Validation Error:');
        });
    };

    /**
     * Return an associative object of serialized form data
     *
     * @param form
     * @returns {{}}
     */
    Edit.prototype.serializeForm = function (form) {
        var elements = jQuery(form).find('input,select,textarea');
        var serialized = {};
        jQuery.each(elements, function (index, element) {
            if (!jQuery(element).data('no-serialize')) {
                serialized[jQuery(element).attr('name')] = jQuery(element).val();
                var serializeFn = jQuery(element).data('serialize');
                if (serializeFn && typeof serializeFn === 'function') {
                    serializeFn(jQuery(element), this.entity, serialized);
                }
            }
        }.bind(this));
        return serialized;
    };

    /**
     * Validate the form
     *
     * @param data
     * @param callback
     * @param failedCallback
     */
    Edit.prototype.validateForm = function (data, callback, failedCallback) {
        var passed = true,
            errorMsgs = [],
            failedFields = [];

        Hook.trigger('gene-bluefoot-validate-form', {
            data: data,
            passed: passed,
            errorMsgs: errorMsgs,
            failedFields: failedFields
        }, function (params) {
            data = params.data;
            errorMsgs = params.errorMsgs;
            failedFields = params.failedFields;

            // Check to see if the event failed the validation already
            passed = params.passed;
            if (passed === false) {
                return failedCallback(passed);
            }

            // Reset tab error classes
            jQuery(this.editElement).find('.gene-bluefoot-tab-error').removeClass('gene-bluefoot-tab-error');

            // Validate all required attributes are completed
            jQuery.each(this.getFields(), function (index, field) {
                if (typeof field.required !== 'undefined' && field.required) {
                    var fieldElement = jQuery(this.editElement).find('[name="' + field + '"]');
                    if (fieldElement.length > 0) {
                        fieldElement.removeClass('gene-bluefoot-field-failed');
                    }
                    if (typeof data[field.code] === 'undefined' || typeof data[field.code] !== 'undefined' && (data[field.code] == null || data[field.code].length == 0)) {
                        passed = false;
                        errorMsgs.push(field.label + ' is a required field.');
                        failedFields.push(field.code);
                    }
                }
            }.bind(this));

            // If the required validation failed call the failed callback
            if (passed === false) {
                this.failedFields(failedFields);
                return failedCallback(errorMsgs.join("<br />"));
            }

            // Otherwise the validation was a success
            callback(data);

        }.bind(this), this.stage);
    };

    /**
     * Add classes to fields which have failed validation
     *
     * @param failedFields
     */
    Edit.prototype.failedFields = function (failedFields) {
        jQuery.each(failedFields, function (index, field) {
            var fieldElement = jQuery(this.editElement).find('[name="' + field + '"]');
            if (fieldElement.length > 0) {
                fieldElement.addClass('gene-bluefoot-field-failed');
                if (!fieldElement.is(':visible')) {
                    var tabWrapper = fieldElement.parents('.gene-bluefoot-configure-group');
                    var tab = jQuery(this.editElement).find('[href="#' + tabWrapper.attr('id') + '"]');
                    if (tab.length > 0) {
                        tab.addClass('gene-bluefoot-tab-error');
                    }
                    if (failedFields.length == 1) {
                        tab.click();
                        fieldElement.focus();
                    }
                }
            }
        }.bind(this));
    };

    /**
     * Close the configure panel
     *
     * @param event
     * @param noRetract
     */
    Edit.prototype.closeConfigure = function (event, noRetract) {
        if (event) {
            event.preventDefault();
        }
        this.editElement.css({right: ''}).removeClass('active');
        this.removeInstance(this.editElement);
        if (this.parent === this.stage) {
            jQuery('body').find('.gene-bluefoot-configure-overlay').removeClass('active');
        }
        if (!noRetract && typeof this.parent.editElement !== 'undefined' && this.parent.editElement) {
            this.parent.editElement.removeClass('gene-bluefoot-inactive');
            this.retractParents();
        }

        // Reset the parent edit
        this.parent.edit = undefined;
    };

    /**
     * Close all instances of edit
     */
    Edit.prototype.closeAll = function () {
        var editInstances = jQuery('body').find('.gene-bluefoot-configure-sidebar');
        if (editInstances.length > 0) {
            jQuery.each(editInstances, function (index, element) {
                var editClass = jQuery(element).data('class');
                if (typeof editClass.closeConfigure === 'function') {
                    editClass.closeConfigure(false, true);
                    this.removeInstance(element);
                }
            }.bind(this));
        }
    };

    /**
     * Remove an instance
     *
     * @param instance
     */
    Edit.prototype.removeInstance = function (instance) {
        jQuery(instance).css({right: ''}).removeClass('active');
        jQuery(instance).on(
            'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
            function () {
                jQuery(instance).remove();
            }.bind(this)
        );
    };

    /**
     * Return the view for this edit instance
     *
     * @returns {{icon: *, name: *, color: *, groups: []}}
     */
    Edit.prototype.getView = function () {
        var fields = this.getFields();
        var view = {
            icon: this.entity.config.icon,
            name: this.entity.config.name,
            color: this.entity.config.color,
            groups: []
        };

        // Start building up our field groups
        var fieldGroups = {};
        var count = 0;
        jQuery.each(fields, function (code, field) {
            count++;
            var group = field.group || 'General';
            var id = (field.attribute_id ? field.attribute_id : count);
            if (typeof fieldGroups[group] === 'undefined') {
                fieldGroups[group] = {
                    name: group,
                    id: id,
                    fields: []
                };
            }

            // Render the field
            fieldGroups[group].fields.push({
                code: code
            });
        }.bind(this));

        var groups = [];
        // Remove the keys
        jQuery.each(fieldGroups, function (label, group) {
            groups.push(group);
        });

        view.groups = groups;

        return view;
    };

    /**
     * Render the fields within the form
     */
    Edit.prototype.renderFields = function () {
        jQuery(this.editElement).find('[data-field]').each(function (index, element) {
            var fieldType = jQuery(element).data('field');
            this.renderField(fieldType, jQuery(element));
        }.bind(this));
    };

    /**
     * Render a field
     *
     * @param fieldType
     * @param element
     */
    Edit.prototype.renderField = function (fieldType, element) {

        // Check we have a configuration for this field
        if (!this.getField(fieldType)) {
            console.error('Unable to find configuration for field: ' + fieldType);
            return false;
        }
        var field = this.getField(fieldType);
        field.fieldType = fieldType;

        Hook.trigger('gene-bluefoot-before-render-field', {field: field}, function (params) {

            // Update the field with any changes from the event
            field = params.field;

            var fieldClass;

            // Detect how we should render this field
            if (typeof field.widget !== 'undefined') {
                fieldClass = 'bluefoot/widget/' + field.widget;
            } else {
                fieldClass = 'bluefoot/field/' + field.type;
            }

            // Load the field renderer
            require([fieldClass], function (FieldClass) {

                // Use the field class to build up the field
                var fieldClass = new FieldClass(field, this.entity.getData(field.code), this);
                if (typeof fieldClass.buildHtml === 'function') {
                    jQuery(element).html(fieldClass.buildHtml());
                } else {
                    return this.fieldFailed(field, element);
                }

                // Trigger an event after the fields been rendered and placed into the DOM
                Hook.trigger('gene-bluefoot-after-render-field-' + field.fieldType, {
                    element: jQuery(element),
                    field: field,
                    fieldClass: fieldClass
                }, false, this.stage);

            }.bind(this), function () {
                this.fieldFailed(field, element);
            }.bind(this));

        }.bind(this), this.stage);
    };

    /**
     * Call this when a field fails to render
     *
     * @param field
     * @param element
     */
    Edit.prototype.fieldFailed = function (field, element) {
        jQuery(element).html(jQuery('<div />').addClass('gene-bluefoot-field-failed').html('\'' + field.label + '\' has failed to load'));
    };

    /**
     * Get a single field
     *
     * @param key
     * @returns {*}
     */
    Edit.prototype.getField = function (key) {
        return this.getFields(key);
    };

    /**
     * Return the fields associated with this edit instance
     *
     * @param key
     * @returns {*}
     */
    Edit.prototype.getFields = function (key) {
        var fields = null;
        if (this.fields) {
            fields = this.fields;
        } else if (typeof this.entity.config !== 'undefined' && typeof this.entity.config.fields !== 'undefined') {
            fields = this.entity.config.fields;
        }

        // Add in global fields, if they exist
        if (Config.getValue('globalFields')) {
            jQuery.extend(fields, Config.getValue('globalFields'));
        }

        // Return a specific key
        if (key && fields !== null && typeof fields[key] !== 'undefined') {
            return fields[key];
        } else if (!key && fields) {
            return fields;
        }

        return null;
    };

    return Edit;
});