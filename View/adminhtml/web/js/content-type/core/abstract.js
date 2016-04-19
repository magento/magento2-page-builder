/**
 * - abstract.js
 * The abstract class for elements
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/hook', 'bluefoot/jquery', 'bluefoot/renderer', 'bluefoot/dragdrop', 'bluefoot/config', 'bluefoot/modal', 'bluefoot/edit', 'bluefoot/ajax'], function (Hook, jQuery, Render, DragDropClass, Config, Modal, EditClass, AjaxClass) {

    /**
     * The abstract content type class handles the basic operations of any content type. This includes building its
     * mark up, initializing various options and configuring
     *
     * @param stage
     * @param config
     * @param dragClone
     * @param parent
     * @param editParent
     * @param manualInit
     * @constructor
     */
    function ContentTypeAbstract(stage, config, dragClone, parent, editParent, manualInit) {
        editParent = editParent || false;

        this.stage = stage;
        this.config = config;
        this.dragClone = (dragClone ? jQuery(dragClone) : false);
        this.parent = parent;

        this.editParent = editParent;

        this.entity = false;

        this.runScripts = [];

        this.disablePreview = false;

        this.data = {};

        if (manualInit !== true) {
            this.init();
        }

        Hook.attach('gene-bluefoot-entity-update-previews', this.updatePreview.bind(this), this.stage);
    }

    /**
     * Initialize the content type
     */
    ContentTypeAbstract.prototype.init = function () {

        this.entity = this.buildElementHtml();

        if (this.dragClone) {
            this.entity.insertAfter(this.dragClone);
            this.dragClone.remove();
        } else if (this.parent) {
            if (!this.parent.hasClass('gene-bluefoot-droppable')) {
                this.parent = this.parent.find('>.gene-bluefoot-droppable');
            }
            this.parent.append(this.entity);
        }

        // Set timeout to ensure CSS transitions fire correctly
        setTimeout(function () {
            // Reset various CSS variables
            this.entity.addClass('active').css({
                top: '',
                left: '',
                opacity: '',
                width: '',
                height: ''
            });

            // Do we have any scripts to run?
            if (this.runScripts.length > 0) {
                jQuery.each(this.runScripts, function (index, script) {
                    try {
                        eval(script);
                    } catch (e) {
                        console.error('Issue whilst eval\'ing script, see log for script:' + e.message);
                        console.log(e);
                        console.log(script);
                    }
                }.bind(this));
                this.runScripts = [];
            }
        }.bind(this), 0);

        // Init the options for the entity
        this.initOptions();

        // Record the element upon the stage
        this.stage.recordElement(this.entity, this);
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);

        // Click on entity to configure
        jQuery(this.entity).on('click', function (event) {
            if (!jQuery(event.target).is('a') && !jQuery(event.target).hasClass('no-edit')) {
                this.configure();
            }
        }.bind(this));
    };

    /**
     * Build the elements html
     *
     * @returns {*}
     */
    ContentTypeAbstract.prototype.buildElementHtml = function () {
        var view = {
            code: this.config.code,
            icon: this.config.icon,
            color: this.config.color,
            color_theme: this.config.color_theme,
            name: this.config.name
        };

        var entityHtml;
        if (!this.disablePreview && typeof this.config.preview_template !== 'undefined' && this.config.preview_template && this.getData('preview_view')) {
            entityHtml = this.buildPreviewHtml(view);
        } else {
            // If the content block has a preview field associated, pass through the data
            if (typeof this.config.preview_field !== 'undefined' && this.getData(this.config.preview_field)) {
                view.preview_text = this.getData(this.config.preview_field);
            }
            entityHtml = jQuery(Render.renderFromConfig('entity_template', view));
        }

        return entityHtml;
    };

    /**
     * Build the preview HTML
     *
     * @param view
     * @returns {*}
     */
    ContentTypeAbstract.prototype.buildPreviewHtml = function (view) {
        var previewView = this.getData('preview_view');

        // Does this content type have already children?
        if (typeof this.children !== 'undefined') {
            this.buildChildPreviewView(previewView);
        }

        view.preview = Render.render(this.config.preview_template, previewView);
        var renderedPreview = jQuery(Render.renderFromConfig('entity_preview_template', view));

        // Do we need to run any script?
        if (renderedPreview.find('script').length > 0) {
            jQuery.each(renderedPreview.find('script'), function (index, element) {
                this.runScripts.push(jQuery(element).html());
            }.bind(this));
            renderedPreview.find('script').remove();
        }

        // Block click events on certain elements
        renderedPreview.find('a,button,input').each(function (index, element) {
            jQuery(element).on('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                this.configure();
                return false;
            }.bind(this));
        }.bind(this));

        // Fire the event once each image is fully loaded
        renderedPreview.find('img').each(function (index, element) {
            jQuery(element).on('load', function (event) {
                Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
            });
        });

        return renderedPreview;
    };

    /**
     * Build the HTML for any child blocks
     *
     * @param previewView
     * @returns {*}
     */
    ContentTypeAbstract.prototype.buildChildPreviewView = function (previewView) {
        previewView.child_blocks = {};
        jQuery.each(this.children, function (key, children) {
            if (typeof previewView.child_blocks[key] === 'undefined') {
                previewView.child_blocks[key] = [];
            }
            jQuery.each(children, function (index, contentType) {
                contentType.disablePreview = false;
                var childHtml = contentType.buildElementHtml();

                // Do we need to run any script?
                if (childHtml.find('script').length > 0) {
                    jQuery.each(childHtml.find('script'), function (index, element) {
                        this.runScripts.push(jQuery(element).html());
                    }.bind(this));
                    childHtml.find('script').remove();
                }

                previewView.child_blocks[key].push({
                    html: childHtml.html()
                });
                contentType.disablePreview = true;
            }.bind(this));
        });
        return previewView;
    };

    /**
     * Init the options on the entity
     */
    ContentTypeAbstract.prototype.initOptions = function () {
        return this.stage.structural.initOptions(this.entity, this.getOptions());
    };

    /**
     * Serialize the current element
     *
     * @returns {{contentType: *}}
     */
    ContentTypeAbstract.prototype.serialize = function () {
        var serialized = {
            contentType: this.config.code
        };

        // Include any form data
        var formData = this.getData();
        if (!jQuery.isEmptyObject(formData)) {
            serialized.formData = formData;
        }

        return serialized;
    };

    /**
     * Return the options for the content type
     *
     * @returns {{options: *[]}}
     */
    ContentTypeAbstract.prototype.getOptions = function () {

        // Declare the configuration for our rows
        var view = {
            options: [
                {
                    code: 'configure',
                    label: 'Configure',
                    icon: '<i class="fa fa-cog"></i>',
                    onClick: function () {
                        this.configure();
                    }.bind(this)
                },
                {
                    code: 'duplicate',
                    label: 'Duplicate',
                    icon: '<i class="fa fa-files-o"></i>',
                    onClick: this.stage.structural.duplicate.bind(this)
                },
                {
                    code: 'delete',
                    label: 'Delete',
                    icon: '<i class="fa fa-trash-o"></i>',
                    onClick: this.remove.bind(this)
                }
            ],
            color: this.config.color
        };

        // Allow modification of the view
        Hook.trigger('gene-bluefoot-get-options-' + this.config.code, {view: view, entity: this}, false, this.stage);

        return view;
    };

    /**
     * Allow configuration of the content type
     */
    ContentTypeAbstract.prototype.configure = function () {
        // Start a new instance of the edit class
        return new EditClass(this.stage, this, false, this.editParent);
    };

    /**
     * Allow the removal of entities
     */
    ContentTypeAbstract.prototype.remove = function () {
        Modal.confirm('Are you sure you want to delete this ' + this.config.name.toLowerCase() + ' block?', false, function () {
            // Store the entity ID to be deleted upon save
            if (this.getData('entity_id')) {
                this.stage.save.delete(this.getData('entity_id'));
            }

            this.entity.remove();
            Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
            Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);
        }.bind(this));
    };

    /**
     * Set the data of the entity
     *
     * @param data
     * @param key
     */
    ContentTypeAbstract.prototype.setData = function (data, key) {
        if (key) {
            this.data[key] = data;
        } else {
            this.data = jQuery.extend(this.data, data);
        }

        if (!this.building && typeof this.config.preview_template !== 'undefined' && this.config.preview_template) {
            this.updatePreview();
        }
    };

    /**
     * Update the preview on sort
     */
    ContentTypeAbstract.prototype.onSortComplete = function () {
        return this.updatePreview();
    };

    /**
     * Update the preview data
     */
    ContentTypeAbstract.prototype.updatePreview = function () {
        var previewView = (this.getData('preview_view') || {});
        var dataModelFields = [];
        jQuery.each(this.data, function (key, value) {
            // Never copy these fields over to the preview
            if (key == 'preview_view' || key == 'undefined') {
                return;
            }

            // Use the field config to get any labels for select options
            if (typeof this.config.fields !== 'undefined' && typeof this.config.fields[key] !== 'undefined') {
                var fieldConfig = this.config.fields[key];
                if (typeof fieldConfig.options === 'object') {
                    var newValue = jQuery.grep(fieldConfig.options, function (option) {
                        return option.value == value;
                    });
                    if (typeof newValue[0] !== 'undefined') {
                        value = newValue[0].label;
                    }
                }

                // @todo detect if data has actually changed
                if (typeof fieldConfig.data_model !== 'undefined') {
                    dataModelFields.push(key);
                }
                previewView[key] = value;
            }
        }.bind(this));

        // Update any preview fields via Ajax
        this.updatePreviewAjax(dataModelFields, previewView, function (previewView) {

            this.data['preview_view'] = previewView;

            // Don't update the preview if we're within a configuration sidebar
            if (this.entity && this.entity.parents('.gene-bluefoot-configure-sidebar').length > 0) {
                return false;
            }

            // Build the new element HTML
            var newElementHtml = this.buildElementHtml();

            // Update the original entity HTML with the new HTML
            this.entity.html(newElementHtml.html());
            this.initOptions();

            // Do we have any scripts to run?
            if (this.runScripts.length > 0) {
                jQuery.each(this.runScripts, function (index, script) {
                    // Eval inside of scope to ensure the script has access to jQuery etc
                    eval(script);
                }.bind(this));
                this.runScripts = [];
            }

            // Trigger the event 10ms afterwards to let the system update
            setTimeout(function () {
                Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
            }.bind(this), 0);

            // Fire the event once each image is fully loaded
            newElementHtml.find('img').each(function (index, element) {
                jQuery(element).on('load', function (event) {
                    Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
                });
            });

        }.bind(this));
    };

    /**
     * If any fields are using data models we'll need to ping the server for the new data
     *
     * @param fields
     * @param previewView
     * @param callbackFn
     * @returns {*}
     */
    ContentTypeAbstract.prototype.updatePreviewAjax = function (fields, previewView, callbackFn) {

        // If we don't need to update any fields no need to do an ajax request
        if (fields.length == 0) {
            return callbackFn(previewView);
        }

        this.entity.addClass('gene-bluefoot-loading');

        // Build up the data for our ajax request
        var request = {
            code: this.config.code,
            fields: fields,
            data: this.data
        };

        // Make the ajax request to retrieve the data model data
        var Ajax = new AjaxClass();
        Ajax.get(Config.getValue('data_update_url'), request, function (data) {
            if (data.success && data.fields) {
                var dataModelPreview = jQuery.extend(previewView, data.fields);
                callbackFn(dataModelPreview);
            } else {
                callbackFn(previewView);
            }
        });
    };

    /**
     * Return the form data from the entity
     *
     * @param key
     * @returns {*}
     */
    ContentTypeAbstract.prototype.getData = function (key) {
        if (key) {
            if (typeof this.data[key] !== 'undefined') {
                return this.data[key];
            }
            return null;
        } else {
            return this.data;
        }
    };

    /**
     * Clone the current content type
     *
     * @param parent
     * @returns {ContentTypeAbstract}
     */
    ContentTypeAbstract.prototype.clone = function (parent) {
        parent = parent || this.parent;
        var clone = new ContentTypeAbstract(this.stage, this.config, false, parent, this.editParent);

        // Set across the data, removing any entity ID's
        clone.data = jQuery.extend({}, this.data);
        delete clone.data['entity_id'];
        delete clone.data.preview_view['entity_id'];

        // Handle the cloning of child elements
        if (typeof this.children !== 'undefined' && !jQuery.isEmptyObject(this.children)) {
            clone.children = {};
            jQuery.each(this.children, function (name, children) {
                clone.children[name] = [];
                jQuery.each(children, function (index, child) {
                    clone.children[name].push(child.clone());
                });
            });
        }

        // Update the preview after cloning
        clone.updatePreview();
        return clone;
    };

    /**
     * Return the fields associated with this edit instance
     *
     * @param key
     * @returns {*}
     */
    ContentTypeAbstract.prototype.getFields = function (key) {
        var fields = null;
        if (this.fields) {
            fields = this.fields;
        } else if (typeof this.config !== 'undefined' && typeof this.config.fields !== 'undefined') {
            fields = this.config.fields;
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

    return ContentTypeAbstract;
});