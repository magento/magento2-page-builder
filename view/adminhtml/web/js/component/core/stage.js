/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/hook',
    'bluefoot/jquery',
    'bluefoot/renderer',
    'bluefoot/cms-config',
    'bluefoot/config',
    'bluefoot/structural',
    'bluefoot/modal',
    'bluefoot/stage/panel',
    'bluefoot/stage/save',
    'bluefoot/stage/build',
    'bluefoot/plugins',
    'bluefoot/template',
    'ko'
], function (Hook, jQuery, Render, InitConfig, Config, StructuralClass, Modal, PanelClass, SaveClass, StageBuild, Plugins, TemplateClass, ko) {

    /**
     * The stage is the main hub for any 'page builder' element. It handles all interactions between the sub modules,
     * along side initializing the configuration and other things
     *
     * @constructor
     */
    function Stage() {
        this.wysiwyg = false;
        this.textarea = false;
        this.originalContent = false;
        this.container = false;
        this.structural = false;
        this.stageHtml = false;
        this.panel = false;
        this.config = false;
        this.disabled = false;
        this.originalFullscreenCss = {};

        this.emptyFieldText = 'TEMPORARY_BLUEFOOT_STRING';
    }

    /**
     * Event callback for stage init
     *
     * @param button
     * @param buildInstance
     */
    Stage.prototype.init = function (button, buildInstance) {

        this.build = buildInstance;

        // Add a loading class to the button
        jQuery(button).addClass('loading stage-init');
        this.namespace = jQuery(button).data('namespace');
        if (jQuery(button).data('stage')) {
            var stage = jQuery(button).data('stage');
            jQuery(button).removeClass('loading');
            return stage.enableStage();
        }

        // Retrieve the container
        this.id = jQuery(button).attr('id').replace('gene-bluefoot', '');
        var container = jQuery(button).parents('.buttons-set').nextAll('.gene-bluefoot-stage-container');

        // Fire a trigger
        Hook.trigger('gene-bluefoot-before-stage-init', {
            button: jQuery(button),
            id: this.id,
            container: container
        }, function () {

            // Verify the container exists
            if (!container) {
                throw Error('Unable to load container: ' + container);
            }

            // Load any plugins that require to be available onPageLoad
            Plugins.load('onStageInit', function () {

                // Build the stage
                this.stageInit(container, function () {

                    // If we have an instance of build, we need to rebuild the screen
                    if (this.build) {
                        this.build.rebuild();
                    }

                    // Add class to parent div
                    container.parents('.admin__field').addClass('gene-bluefoot-admin__field');

                    // Fire an event as early on as possible
                    Hook.trigger('gene-bluefoot-after-stage-init', {
                        button: jQuery(button),
                        id: this.id,
                        container: container,
                        stage: this
                    }, function () {
                        jQuery(button).data('stage', this).removeClass('loading');
                    }.bind(this), this);

                }.bind(this));

            }.bind(this));

        }.bind(this), this);

    };

    /**
     * Build up the stage configuration
     *
     * @param config
     * @returns {{}}
     */
    Stage.prototype.getStageConfig = function (config) {
        return {
            id: this.id
        };
    };

    /**
     * Init the stage
     *
     * @param container
     * @param callback
     */
    Stage.prototype.stageInit = function (container, callback) {

        // Verify the container exists
        if (!container || (container && container instanceof jQuery && container.length == 0)) {
            throw new Error('No valid container present');
        }

        // Generate a token so we can ensure we're building the same page builder after the config load
        var _initToken = Math.random().toString(36).slice(-5),
            categoryId = false;

        this.container = container;
        this.container.data('_initToken', _initToken);
        this.textarea = this.container.next('textarea');
        this.originalContent = this.textarea.val();
        this.textarea.hide();

        // Resolve issue with initialization within categories
        if (typeof window.categoryForm !== 'undefined') {
            categoryId = window.categoryForm.getCategoryId();
        }

        // Retrieve the configuration from the server
        Config.initConfig(function (config) {

            // If the DOM has changed, stop building the stage
            if (this.container.data('_initToken') != _initToken) {
                return false;
            }

            // Ensure, if we're on a category, that we still have the same category ID
            if (categoryId && typeof window.categoryForm !== 'undefined') {
                if (categoryId != window.categoryForm.getCategoryId()) {
                    return false;
                }
            }

            this.config = config;

            // Get the stages configuration
            var stageConfig = this.getStageConfig(config);

            // Build and include the panel
            this.panel = new PanelClass(this, config);
            stageConfig.panel = this.panel.panelHtml;

            // Store the stage HTML in the module
            var stageHtml = Render.renderFromConfig('stage_template', stageConfig);

            // Update the container with it's stage
            container.html(stageHtml);
            container.show();

            // Is there an attached WYSIWYG editor?
            this.wysiwyg = window['wysiwyg' + this.id];
            if (typeof this.wysiwyg === 'object') {
                // Disable the WYSIWYG editor
                this.wysiwyg.turnOff();
            }
            
            this.textarea.hide();

            // If the text area is currently empty, populate it to fool the validation
            if (this.originalContent == '') {
                this.textarea.val(this.emptyFieldText);

                // Ensure any attached events are processed
                this.textarea.trigger('keyup').trigger('keydown').trigger('change');
            }

            // Handle the buttons
            this.handleButtons();

            // Init the structural elements
            this.structural = new StructuralClass(this);

            // Start an instance of the save class
            this.save = new SaveClass(this);

            // Start an instance of the template system
            this.template = new TemplateClass(this);

            // Add in the active class
            setTimeout(function () {
                this.container.addClass('active');
                this.triggerVisible();
            }.bind(this), 0);

            // Should we create a HTML element with the default content in?
            if (this.originalContent && this.originalContent != '' && !this.build) {
                this.importExistingContent();
            }

            // Remove the build class
            this.textarea.removeClass('bluefoot-init');

            if (typeof callback === 'function') {
                callback(this);
            }

        }.bind(this), (this.build ? this.build.retrieveEntityIds() : false), this.getStoreId());
    };

    /**
     * Trigger various events when the stage becomes visible
     */
    Stage.prototype.triggerVisible = function () {
        // Is the stage currently visible?
        if (!this.container.find('.gene-bluefoot-stage').is(':visible')) {
            // If the container isn't visible poll the page every 50ms to see if the container has become visible, if so trigger various events
            this.container.find('.gene-bluefoot-stage').data('hidden', true).css({opacity: 0});
            var visibleInterval = setInterval(function () {
                if (this.container.find('.gene-bluefoot-stage').is(':visible')) {
                    this.container.find('.gene-bluefoot-stage').data('hidden', false).animate({opacity: 1}, 250);
                    this.triggerInitHooks();
                    clearInterval(visibleInterval);
                }
            }.bind(this), 50);
        } else {
            this.triggerInitHooks();
        }
    };

    /**
     * Trigger hooks on init of the application
     */
    Stage.prototype.triggerInitHooks = function () {
        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this);
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this);
        Hook.trigger('gene-bluefoot-entity-update-previews', false, false, this);
        Hook.trigger('gene-bluefoot-stage-visible', false, false, this);
    };

    /**
     * If there is a HTML content type, and a row add a new entity with the original content in
     */
    Stage.prototype.importExistingContent = function () {
        if (Config.getContentTypeConfig('textarea')) {
            var firstRow = this.structural.getRows().first();
            this.addEntity('textarea', false, firstRow, false, function (entityClass) {
                entityClass.setData({
                    textarea: this.originalContent
                });
            }.bind(this));
        }
    };

    /**
     * Handle hiding and showing the buttons
     */
    Stage.prototype.handleButtons = function () {

        // Show and hide the correct buttons
        var buttonsContainer = this.container.prevAll('.buttons-set');
        buttonsContainer.find('button').hide();

        var disableButton = buttonsContainer.find('.disable-gene-bluefoot');
        disableButton.off('click').on('click', function () {
            require('bluefoot/modal').confirm('Are you sure you want to disable the BlueFoot?', 'Are you sure?', function () {
                return this.disableStage();
            }.bind(this));
        }.bind(this));
        disableButton.data('gene-bluefoot-hidden', '').show();
    };

    /**
     * Disable a stage, this will hide the stage in the background just in case the user wishes to re-enable the stage
     */
    Stage.prototype.enableStage = function () {

        // Show and hide the correct buttons
        var buttonsContainer = this.container.parent().find('.buttons-set');
        buttonsContainer.find('button.disable-gene-bluefoot').show();
        buttonsContainer.find('button.init-gene-bluefoot').hide();
        buttonsContainer.find('#toggle' + this.id).hide();

        this.save.enable();
        this.container.addClass('stage-init').show();
        buttonsContainer.parents('.admin__field').addClass('gene-bluefoot-admin__field');
        if (typeof this.wysiwyg === 'object') {
            this.wysiwyg.turnOff();
            buttonsContainer.find('.plugin').hide();
        }
        this.textarea.hide();
    };

    /**
     * Disable a stage, this will hide the stage in the background just in case the user wishes to re-enable the stage
     */
    Stage.prototype.disableStage = function () {

        // Show and hide the correct buttons
        var buttonsContainer = this.container.parent().find('.buttons-set');
        buttonsContainer.find('button.disable-gene-bluefoot').hide();
        buttonsContainer.find('button.init-gene-bluefoot').show();
        buttonsContainer.find('#toggle' + this.id).show();

        this.disabled = true;
        this.save.disable();
        this.container.removeClass('stage-init').hide();
        buttonsContainer.parents('.admin__field').removeClass('gene-bluefoot-admin__field');
        if (this.textarea.val() == this.emptyFieldText) {
            this.textarea.val('');
        }
        this.textarea.show();
        if (typeof this.wysiwyg === 'object') {
            this.wysiwyg.turnOn();
        }
        jQuery('.mceEditor').width('100%');
    };

    /**
     * Add an entity from a cloned element
     *
     * @param cloned
     */
    Stage.prototype.addEntityFromClone = function (cloned) {

        // Retrieve the content type
        var contentType = cloned.data('type');
        if (!contentType) {
            Modal.alert('Unable to determine the content type you\'re trying to add to the page.');
            return false;
        }

        // Stop the cloned element from being a preview
        cloned.addClass('active gene-bluefoot-preview-dropped gene-bluefoot-entity').removeClass('gene-bluefoot-preview');

        // Detect if we need to remove any empty text, this should of already been hidden
        cloned.parents('.gene-bluefoot-droppable').find('>.empty-text').removeClass('hidden-by-placeholder').hide();

        // Add the entity and automatically open the configure tab
        return this.addEntity(contentType, cloned, false, false, function (entity) {
            if (typeof entity.configure === 'function') {
                entity.configure();
            }
        });
    };

    /**
     * Add an entity by content type
     *
     * @param contentType
     * @param cloned
     * @param parent
     * @param config
     * @param callbackFn
     * @param manualInit
     *
     * @returns {boolean}
     */
    Stage.prototype.addEntity = function (contentType, cloned, parent, config, callbackFn, manualInit) {
        // Retrieve the content type config
        var contentTypeConfig = Config.getContentTypeConfig(contentType);
        if (contentTypeConfig) {
            var contentTypeClassName = contentTypeConfig.contentType || 'abstract';
            require(['bluefoot/content-type/' + contentTypeClassName], function (ContentTypeClass) {
                var entity = new ContentTypeClass(this, contentTypeConfig, cloned, parent, false, manualInit);

                // Does the caller want a call back function?
                if (typeof callbackFn === 'function') {
                    callbackFn(entity);
                }
            }.bind(this));
        } else {
            console.warn('The content block \'' + contentType + '\' is present within the page builder, however the content type doesn\'t exist in Magento. This content block will be ignored.');
            // Does the caller want a call back function?
            if (typeof callbackFn === 'function') {
                callbackFn(false);
            }
            return false;
        }
    };

    /**
     * Assign unique ID's to elements as they're added to the stage
     *
     * @param element
     * @param elementClass
     */
    Stage.prototype.recordElement = function (element, elementClass) {
        var id = this.generateElementId();
        jQuery(element).data('class', elementClass).attr('id', id).addClass('gene-bluefoot-entity-container').attr('data-flagged', 'true');
    };

    /**
     * Generate a random 32 character element ID
     *
     * @returns {string}
     */
    Stage.prototype.generateElementId = function () {
        var elementId = '';
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++)
            elementId += possible.charAt(Math.floor(Math.random() * possible.length));
        return elementId;
    };

    /**
     * Empty the stages content
     */
    Stage.prototype.empty = function () {
        jQuery.each(this.structural.getRows(), function (index, row) {
            jQuery(row).remove();
        });
        Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this);
        Hook.trigger('gene-bluefoot-stage-updated', false, false, this);
    };

    /**
     * Full screen the stage, only can be called from the panel
     */
    Stage.prototype.fullscreen = function () {
        var container = this.stage.container;
        if (this.stage.container.hasClass('full-screen')) {
            jQuery('body').removeClass('bluefoot-locked');
            container.removeClass('full-screen');

            setTimeout(function () {
                jQuery(window).scroll();
            }.bind(this), 0);
        } else {
            jQuery('body').addClass('bluefoot-locked');
            container.addClass('full-screen');

            setTimeout(function () {
                // Trigger scroll to bring the panel to the correct place
                this.stage.container.find('.gene-bluefoot-stage').scroll();
            }.bind(this), 0);
        }
    };

    /**
     * Determine if a store ID is present and set
     *
     * @returns {*}
     */
    Stage.prototype.getStoreId = function () {
        if (jQuery('#store_switcher').length > 0) {
            return jQuery('#store_switcher').val();
        }
    };

    return Stage;
});