/**
 * - Template.js
 * Handles saving and loading of templates
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/hook', 'bluefoot/jquery', 'bluefoot/config', 'bluefoot/renderer', 'bluefoot/stage/save', 'bluefoot/ajax', 'bluefoot/stage/build','bluefoot/html2canvas'], function (Hook, jQuery, Config, Render, SaveClass, AjaxClass, StageBuild, Html2Canvas) {

    /**
     * This handles any structural elements, this includes rows and columns.
     *
     * @param stage
     * @constructor
     */
    function Template(stage) {
        this.stage = stage;

        this.save = this.stage.save;

        this.removeData = false;

        this.init();
    }

    /**
     * Init the template system
     */
    Template.prototype.init = function () {

        var view = {
            templates: Config.getValue('templates')
        };
        //Store the stage HTML in the module
        var templateHtml = Render.renderFromConfig('template_template', view);
        var templateHtmljQuery = jQuery(templateHtml);

        this.stage.container.find('.gene-bluefoot-template').html(templateHtmljQuery);

        this.bindEvents();
    };

    /**
     * Bind events into the template system
     */
    Template.prototype.bindEvents = function () {
        this.stage.container.find('.gene-bluefoot-template [name="save-template"]').off('click').on('click', this.saveTemplate.bind(this));
        this.stage.container.find('.gene-bluefoot-template [name="template-selection"]').off('click').on('click', this.showTemplateSelection.bind(this));

    };

    /**
     * Prompt the user on whether or not they want to save the template with data
     *
     * @param event
     */
    Template.prototype.saveTemplate = function (event) {
        if (event) {
            event.stopPropagation();
        }

        // Force the save system to update it's data
        this.save.onStageUpdated();

        var config = {
            buttons: [
                {
                    code: 'with-data',
                    class: 'gene-bluefoot-with-data',
                    label: 'With Content',
                    onClick: function () {
                        this.removeData = false;
                        this._saveTemplate(jQuery('[name="template-name"]').val());
                    }.bind(this)
                },
                {
                    code: 'without-data',
                    class: 'gene-bluefoot-without-data',
                    label: 'Without Content',
                    onClick: function () {
                        this.removeData = true;
                        this._saveTemplate(jQuery('[name="template-name"]').val());
                    }.bind(this)
                },
                {
                    code: 'cancel',
                    class: 'gene-bluefoot-close',
                    label: 'Cancel'
                }
            ],
            fields: [
                {
                    label: 'Template Name<sup>*</sup>',
                    input: '<input type="text" name="template-name" />',
                    required: true
                }
            ]
        };

        require('bluefoot/modal').custom('Do you want to store the current pages templates with or without it\'s attached data?', 'Saving Template', config);
    };

    /**
     * Private function called on interaction with the previous modal
     *
     * @private
     */
    Template.prototype._saveTemplate = function (name) {
        if (!name || name && name == '') {
            this.saveTemplate();
            return false;
        }

        //Get our screen shot of the template.
        var templateData = this.processSaveData(this.save.getData()),
            dom = jQuery('.gene-bluefoot-stage-content-inner'),
            templatePreview = '';

        html2canvas(dom, {
            useCORS: true,
            onrendered: function(canvas) {

                //Shrink the canvas a bit to save space.
                var scaleCan = document.createElement('canvas');
                var w = canvas.width,
                    h = canvas.height;
                scaleCan.width = w/2.5;
                scaleCan.height = h/2.5;

                var ctx = scaleCan.getContext('2d');
                ctx.drawImage(canvas, 0, 0, canvas.width/2.5, canvas.height/2.5);
                templatePreview = scaleCan.toDataURL();

                var Ajax = new AjaxClass();
                Ajax.post(Config.getValue('template_save_url'), {
                    name: name,
                    structure: templateData,
                    preview: templatePreview,
                    has_data: !this.removeData
                }, function (data) {
                    if (data.success) {
                        //Add our new saved template to our list of templates.
                        Config.mergeValues('templates',data.template);
                        require('bluefoot/modal').alert('Your template has been saved under ' + name);
                    }
                });
            }.bind(this)
        });
    };
    /**
     * Send request to favourite a template.
     * @param templateId
     * @param pinnedVal
     * @returns {boolean}
     */
    Template.prototype.pinTemplate = function (templateId,pinnedVal) {
        if (!templateId || templateId && templateId == '') {
            return false;
        }
        var Ajax = new AjaxClass();
        Ajax.post(Config.getValue('template_pin_url'), {
            id: templateId,
            pinned: pinnedVal
        }, function (data) {
            if (data.success) {
                //Update our config
                Config.updateTemplateValue('id',data.id,'pinned',data.pinned);
            }
        });
    };
    /**
     * Send ajax request to delete template from server then unset the config.
     *
     * @param name
     * @returns {boolean}
     * @private
     */
    Template.prototype._deleteTemplate = function (templateId) {
        if (!templateId || templateId && templateId == '') {
            return false;
        }
        var Ajax = new AjaxClass();
        Ajax.post(Config.getValue('template_delete_url'), {
            id: templateId
        }, function (data) {
            if (data.success) {
                Config.deleteValue('templates','id',templateId);
                this.showTemplateSelection();
                require('bluefoot/modal').alert('Template has been deleted');
            }
        }.bind(this));
    };
    /**
     * Process the saved data
     *
     * @param data
     */
    Template.prototype.processSaveData = function (data) {
        // Loop through the data and clean it up ready to be saved as a template
        jQuery.each(data, function (index, entityData) {

            // Remove any data from the entities
            if (typeof entityData.contentType !== 'undefined') {
                if (this.removeData && typeof entityData.formData !== 'undefined') {
                    delete entityData.formData;
                } else if (typeof entityData.formData !== 'undefined' && typeof entityData.formData.entity_id !== 'undefined') {
                    delete entityData.formData.entity_id;
                }

                // Process any children
                if (typeof entityData.children !== 'undefined') {
                    jQuery.each(entityData.children, function (name, children) {
                        this.processSaveData(children);
                    }.bind(this));
                }
            } else {
                // Process any children
                if (typeof entityData.children !== 'undefined') {
                    this.processSaveData(entityData.children);
                }
            }
        }.bind(this));

        return JSON.stringify(data);
    };

    /**
     * Get a template from an ID
     *
     * @param id
     * @returns {*|Array}
     */
    Template.prototype.getTemplate = function (id) {
        var templates = Config.getValue('templates');
        var foundTemplate = jQuery.grep(templates, function (template, i) {
            return template.id == id;
        });
        if (foundTemplate) {
            return foundTemplate.first();
        }

        return false;
    };

    /**
     * Delete a template
     *
     * @param templateId
     */
    Template.prototype.deleteTemplate= function (templateId)
    {
        require('bluefoot/modal').confirm('Are you sure you want to delete this template?', false, function () {
            this._deleteTemplate(templateId);
        }.bind(this));
    };

    /**
     * Show the template selection modal
     * @returns {*}
     */
    Template.prototype.showTemplateSelection = function ()
    {
        var callbacks =
        {
            load: function (templateId){this.loadTemplate(templateId);}.bind(this),
            delete: function (templateId) {this.deleteTemplate(templateId);}.bind(this),
            pin: function (templateId,pinned) {this.pinTemplate(templateId,pinned);}.bind(this)
        };
        require('bluefoot/modal').templateSelectionGrid(Config.getValue('templates'),callbacks);
    };
    /**
     * Load a template into the page
     *
     * @param templateId
     */
    Template.prototype.loadTemplate = function (templateId) {
        if (templateId) {
            var templateData = this.getTemplate(templateId);
            if (templateData) {
                require('bluefoot/modal').confirm('Loading this template will override the current content. Are you sure you wish to load this template?', false, function () {
                    this._loadTemplate(templateData);
                }.bind(this));
            } else {
                return require('bluefoot/modal').alert('We\'re currently unable to load the requested template.');
            }
        }
    };
    /**
     * Use the build system to rebuild from a template
     *
     * @param templateData
     * @private
     */
    Template.prototype._loadTemplate = function (templateData) {
        if (typeof templateData.structure === 'undefined') {
            return require('bluefoot/modal').alert('The selected template does not have a valid structure to rebuild the content from.');
        }

        this.stage.empty();

        // Does the stage have a build instance associated with it?
        if (!this.stage.build || this.stage.build && typeof this.stage.build !== 'object') {
            this.stage.build = StageBuild.init(true);
            this.stage.build.stage = this.stage;
        }

        this.stage.build.rebuild(JSON.parse(templateData.structure));
    };

    return Template;
});