/**
 * - Build.js
 * Handles rebuilding the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define(['bluefoot/jquery', 'bluefoot/cms-config', 'bluefoot/hook'], function (jQuery, InitConfig, Hook) {

    /**
     * The build class handles building the stage with any previously saved content
     *
     * @param disableBuild
     *
     * @constructor
     */
    function Build(disableBuild) {
        disableBuild = disableBuild || false;

        this.stage = false;
        this.previousStructure = false;
        this.globalConfig = false;

        this.builtOnBuild = false;
        this.onBuildFields = {};

        if (!disableBuild) {
            this.buildSavedStages();

            // Register a responder to pick up any ajax actions
            if (typeof Ajax !== 'undefined' && typeof Ajax.Responders !== 'undefined') {
                Ajax.Responders.register({
                    onComplete: function (request) {
                        // Only run when we detect a load of a category
                        if (request.url.indexOf("catalog_category/edit") !== -1) {
                            this.buildSavedStages();
                        }
                    }.bind(this)
                });
            }
        }
    }

    /**
     * Find any page builder buttons on the page that haven't been initialized
     * @returns {*}
     */
    Build.prototype.findButtons = function () {
        var buttons = jQuery(InitConfig.init_button_class).not('.stage-init');
        if (buttons.length) {
            return buttons;
        }

        return false;
    };

    /**
     * Create new instances of stage for previously stored configurations
     */
    Build.prototype.buildSavedStages = function () {
        var buttons = this.findButtons();
        if (buttons) {
            jQuery.each(buttons, function (index, button) {
                // Remove any previous instance of stage instances stored against the button
                jQuery(button).data('stage', false);

                // Try to locate the textarea
                var textarea = jQuery(button).parent().parent().find('textarea');
                if (textarea && !textarea.hasClass('bluefoot-init')) {
                    textarea.addClass('bluefoot-init');
                    var parsedStructure;
                    if (parsedStructure = this.parseStructure(textarea.val())) {
                        // Create a new stage
                        var StageClass = require('bluefoot/stage');

                        // Start a new instance of the build instance to build this stage
                        var buildInstance = new Build(true);
                        buildInstance.stage = new StageClass();
                        buildInstance.previousStructure = parsedStructure;
                        buildInstance.stage.init(button, buildInstance);
                    }
                }
            }.bind(this));
        }
    };

    /**
     * Parse the potential structure
     *
     * @param config
     * @returns {boolean}
     */
    Build.prototype.parseStructure = function (config) {
        var regex = new RegExp('<!--' + InitConfig.encode_string + '="(.*?)"-->', 'g');

        // Test the expression first for performance
        if (regex.test(config)) {
            regex.lastIndex = 0;
            var matches = regex.exec(config);
            if (matches !== null && matches.length >= 2) {
                var jsonConfig = JSON.parse(matches[1]);
                if (typeof jsonConfig === 'object') {
                    return jsonConfig;
                }
            }
        }

        return false;
    };

    /**
     * Retrieve all entity ID's in the current configuration
     *
     * @returns {Array}
     */
    Build.prototype.retrieveEntityIds = function () {
        var entityIds = [];
        this._retrieveEntityIds(this.previousStructure, entityIds);
        return entityIds;
    };

    /**
     * Function to recursively loop through entities
     *
     * @param entities
     * @param entityIds
     * @private
     */
    Build.prototype._retrieveEntityIds = function (entities, entityIds) {
        jQuery.each(entities, function (index, entity) {
            if (entity.entityId) {
                entityIds.push(entity.entityId);
                if (entity.children) {
                    jQuery.each(entity.children, function (name, children) {
                        this._retrieveEntityIds(children, entityIds);
                    }.bind(this));
                }
            } else {
                if (entity.children) {
                    this._retrieveEntityIds(entity.children, entityIds);
                }
            }
        }.bind(this));
    };

    /**
     * Rebuild the page builder contents
     *
     * @param structure
     *
     * @returns {boolean}
     */
    Build.prototype.rebuild = function (structure) {
        // Retrieve the global config for the build instance
        this.globalConfig = require('bluefoot/config');

        structure = structure || this.previousStructure;
        this.stage.container.addClass('loading').find('.gene-bluefoot-stage').css({opacity: 0});

        // Disable the Hook system during build
        Hook.disable();

        return this._rebuild(this._cleanupStructure(structure));
    };

    /**
     * Clean up structures
     *
     * @param structure
     * @private
     */
    Build.prototype._cleanupStructure = function (structure) {
        var newStructure = [];
        jQuery.each(structure, function (index, element) {
            // Reverse logic magic, ignore any extra data
            if (!(typeof element.type !== 'undefined' && element.type == 'extra')) {
                newStructure.push(element);
            }
        });
        return newStructure;
    };

    /**
     * Recursively rebuild the stage, the wait lock included within this function is to ensure that all content is built
     * in the correct order. As the way we build entities is handled by the stage we have no reliable way of waiting
     * for it to be finished
     *
     * @param entities
     * @param parent
     * @param elementBuiltFn
     * @returns {boolean}
     * @private
     */
    Build.prototype._rebuild = function (entities, parent, elementBuiltFn) {

        // Declare a function to be used as a callback when building entities
        var elementBuilt = function () {
            // Grab the next entity to be built
            if (entities.length > 0) {
                var nextEntity = entities.shift();
                this._rebuildIndividual(nextEntity, parent, elementBuilt);
            } else {
                if (typeof elementBuiltFn === 'function') {
                    elementBuiltFn();
                } else {
                    // Re-enable the hook system once the build is complete
                    Hook.enable();

                    // Run hooks to ensure the system is behaving correctly
                    Hook.trigger('gene-bluefoot-build-complete', false, false, this.stage);
                    Hook.trigger('gene-bluefoot-stage-visible', false, false, this.stage);
                    Hook.trigger('gene-bluefoot-stage-ui-updated', false, false, this.stage);
                    Hook.trigger('gene-bluefoot-stage-updated', false, false, this.stage);

                    // If the stage is hidden whilst the system is building content then don't fade the system in just yet
                    if (this.stage.container.find('.gene-bluefoot-stage').data('hidden') != true) {
                        this.stage.container.removeClass('loading').find('.gene-bluefoot-stage').animate({opacity: 1}, 250);
                    } else {
                        this.stage.container.removeClass('loading');
                    }
                }
            }
        }.bind(this);

        // Grab the next entity to be built
        var nextEntity = entities.shift();
        this._rebuildIndividual(nextEntity, parent, elementBuilt);
    };

    /**
     * Rebuild an individual entry
     *
     * @param entity
     * @param parent
     * @param elementBuiltFn
     * @returns {boolean}
     * @private
     */
    Build.prototype._rebuildIndividual = function (entity, parent, elementBuiltFn) {
        var newStructureElement;
        if (entity.contentType) {
            // If an entity has children it will handle looping back onto this function
            return this.stage.addEntity(entity.contentType, false, parent, entity, function (newEntity) {
                // If an entity is returned
                if (newEntity !== false) {
                    return this.entityBuilt(newEntity, entity, elementBuiltFn);
                }

                // Otherwise call the element built function to continue rendering
                if (typeof elementBuiltFn === 'function') {
                    elementBuiltFn();
                }
            }.bind(this), true);
        } else if (entity.type) {
            if (entity.type == 'row') {
                newStructureElement = this.stage.structural.addRow();
            } else if (entity.type == 'column' && typeof entity.formData.width !== 'undefined') {
                newStructureElement = this.stage.structural.addColumns(parent, 1, entity.formData.width);
            }

            // Restore form data to structural elements
            if (entity.formData) {
                this.stage.structural.updateFormData(newStructureElement, entity.formData);
            }

            // Run the on build functions
            this.runOnBuild(this.stage.structural.mockEntity(newStructureElement));

            if (entity.children) {
                return this._rebuild(entity.children, newStructureElement, elementBuiltFn);
            } else {
                if (typeof elementBuiltFn === 'function') {
                    elementBuiltFn();
                }
            }
        }
    };

    /**
     * Callback for an entity being built
     *
     * @param entityClass
     * @param config
     * @param elementBuiltFn
     */
    Build.prototype.entityBuilt = function (entityClass, config, elementBuiltFn) {

        // Inform the entity class that we're currently building saved content
        entityClass.building = true;

        this.updateEntityFormData(entityClass, config);

        // Build any child entities, via looping back to the build instance
        if (config.children) {
            if (typeof entityClass.children === 'undefined') {
                entityClass.children = {};
            }

            var childrenLength = 0;

            // Iterate through the config items in the child
            // @todo handle multiple child blocks in an edit form
            jQuery.each(config.children, function (name, children) {
                entityClass.children[name] = [];
                if (jQuery(children).length == 0) {
                    // Manually call the init function
                    entityClass.init();

                    if (typeof elementBuiltFn === 'function') {
                        elementBuiltFn();
                    }
                } else {
                    childrenLength = (jQuery(children).length - 1);
                    jQuery.each(children, function (index, child) {
                        // If an entity has children it will handle looping back onto this function
                        return this.stage.addEntity(child.contentType, false, false, child, function (newEntity) {

                            // Add the children into the entity class
                            entityClass.children[name].push(newEntity);
                            this.entityBuilt(newEntity, child);

                            // Wait for all children to be built before initializing the original class
                            if (index === childrenLength) {
                                // Manually call the init function
                                entityClass.init();

                                if (typeof elementBuiltFn === 'function') {
                                    elementBuiltFn();
                                }
                            }
                        }.bind(this));
                    }.bind(this));
                }
            }.bind(this));

        } else {
            // Manually call the init function
            entityClass.init();

            if (typeof elementBuiltFn === 'function') {
                elementBuiltFn();
            }
        }

        entityClass.building = false;
    };

    /**
     * Update the entities form data from the config
     *
     * @param entityClass
     * @param config
     */
    Build.prototype.updateEntityFormData = function (entityClass, config) {
        var formData = {};
        // Set any form data within the new entity
        if (config.entityId && typeof this.stage.config.entities !== 'undefined' && typeof this.stage.config.entities[config.entityId] !== 'undefined') {
            formData = this.stage.config.entities[config.entityId];
        } else if (config.formData) {
            formData = config.formData;
        }

        // Ensure we have a basic object with no nasty additions
        var formDataObject = {};
        jQuery.each(formData, function (key, value) {
            formDataObject[key] = value;
        });

        // Merge in any data stored in the JSON string
        if (typeof config.formData === 'object' && !jQuery.isEmptyObject(config.formData)) {
            jQuery.each(config.formData, function (key, value) {
                formDataObject[key] = value;
                if (typeof formDataObject.preview_view !== 'undefined'
                    && typeof formDataObject.preview_view[key] === 'undefined'
                    && key != 'preview_view')
                {
                    formDataObject.preview_view[key] = value;
                }
            });
        }

        if (formDataObject) {
            entityClass.setData(formDataObject);
        }

        // Get the on build fields for the entity
        this.runOnBuild(entityClass);
    };

    /**
     * Run any field or widget build fields
     *
     * @param entity
     * @returns {Array}
     */
    Build.prototype.runOnBuild =  function (entity) {
        var plugins = this.globalConfig.getValue('plugins');
        if (typeof plugins.on_build === 'object') {
            if (this.builtOnBuild === false) {
                var onBuilds = plugins.on_build;
                var onBuildFn = {};
                var widgetOnBuild = [];
                jQuery.each(onBuilds, function (index, onBuild) {
                    if (typeof onBuild.widget !== 'undefined') {
                        widgetOnBuild.push(onBuild.widget);
                        onBuildFn[onBuild.widget] = onBuild.method;
                    }
                });
                jQuery.each(this.globalConfig.getAllFields(), function (index, field) {
                    if (typeof field.widget !== 'undefined' && widgetOnBuild.indexOf(field.widget) !== -1) {
                        field.onBuild = onBuildFn[field.widget];
                        this.onBuildFields[field.code] = field;
                    }
                }.bind(this));
                this.builtOnBuild = true;
            }

            // Check we have data from the entity
            if (entity.getData()) {
                // Intersect the keys from the object, and the buildFields
                var onBuildFields = this._arrayIntersect(Object.keys(entity.getData()), Object.keys(this.onBuildFields));
                if (onBuildFields.length > 0) {
                    jQuery.each(onBuildFields, function (index, code) {
                        var onBuildField = this.onBuildFields[code];
                        var value = entity.getData(code);
                        if (value != '' && typeof onBuildField.onBuild !== 'undefined') {

                            // Detect how we should render this field
                            var fieldClass = false;
                            if (typeof onBuildField.widget !== 'undefined') {
                                fieldClass = 'bluefoot/widget/' + onBuildField.widget;
                            } else {
                                fieldClass = 'bluefoot/field/' + onBuildField.type;
                            }

                            // Load the field renderer
                            require([fieldClass], function (FieldClass) {

                                // Use the field class to build up the field
                                var fieldClass = new FieldClass(onBuildField, value, false, true);

                                if (typeof fieldClass[onBuildField.onBuild] === 'function') {
                                    fieldClass[onBuildField.onBuild].call(fieldClass, entity, value);
                                }
                            });
                        }
                    }.bind(this));
                }
            }
        }
    };

    /**
     * Perform a quick array intersection
     *
     * @param arr1
     * @param arr2
     * @returns {Array}
     * @private
     */
    Build.prototype._arrayIntersect = function (arr1, arr2)
    {
        var commonValues = [];
        var i, j;
        var arr1Length = arr1.length;
        var arr2Length = arr2.length;

        for (i = 0; i < arr1Length; i++) {
            for (j = 0; j < arr2Length; j++) {
                if (arr1[i] === arr2[j]) {
                    commonValues.push(arr1[i]);
                }
            }
        }

        return commonValues;
    };

    return {
        /**
         * Used on page load to detect any previously saved stages
         */
        init: function (disableBuild) {
            disableBuild = disableBuild || false;
            return new Build(disableBuild);
        }
    };
});