/**
 * - Build.js
 * Handles rebuilding the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/jquery',
    'bluefoot/config',
    'bluefoot/hook',
    'bluefoot/stage/panel/group/block'
], function (jQuery, Config, Hook, Block) {

    /**
     * The build class handles building the stage with any previously saved content
     *
     * @constructor
     */
    function Build() {
        this.structure = false;
        this.stage = false;

        //if (!disableBuild) {
        //    // Register a responder to pick up any ajax actions
        //    if (typeof Ajax !== 'undefined' && typeof Ajax.Responders !== 'undefined') {
        //        Ajax.Responders.register({
        //            onComplete: function (request) {
        //                // Only run when we detect a load of a category
        //                if (request.url.indexOf("catalog_category/edit") !== -1) {
        //
        //                }
        //            }.bind(this)
        //        });
        //    }
        //}
    }

    /**
     * Parse the potential structure
     *
     * @param config
     * @returns {boolean}
     */
    Build.prototype.parseStructure = function (config) {
        var regex = new RegExp('<!--' + Config.getInitConfig('encode_string') + '="(.*?)"-->', 'g');

        // Test the expression first for performance
        if (regex.test(config)) {
            regex.lastIndex = 0;
            var matches = regex.exec(config);
            if (matches !== null && matches.length >= 2) {
                var jsonConfig = JSON.parse(matches[1]);
                if (typeof jsonConfig === 'object') {
                    this.structure = jsonConfig;
                    return jsonConfig;
                }
            }
        }

        return false;
    };

    /**
     * Build a stage from previous data
     *
     * @param stage
     */
    Build.prototype.buildStage = function (stage) {
        this.stage = stage;

        // Load in our entities
        // @todo loading state, wait to see if multiple instances are to be built
        Config.loadEntities(this.retrieveEntityIds(), false, function () {
            this.rebuild(this.structure);
        }.bind(this));
    };

    /**
     * Retrieve all entity ID's in the current configuration
     *
     * @returns {Array}
     */
    Build.prototype.retrieveEntityIds = function () {
        var entityIds = [];
        this._retrieveEntityIds(this.structure, entityIds);
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
                    this.stage.stageContent.valueHasMutated();
                    // Stage has been rebuilt
                }
            }
        }.bind(this);

        // Grab the next entity to be built
        var nextEntity = entities.shift();
        if (!parent) {
            parent = this.stage;
        }
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
        var newParent;
        if (entity && typeof entity.contentType !== 'undefined' && entity.contentType) {
            var blockConfig = Config.getContentTypeConfig(entity.contentType),
                blockInstance = new Block(blockConfig, false),
                blockData;

            if (typeof entity.formData === 'object' && !Array.isArray(entity.formData)) {
                blockData = jQuery.extend(entity.formData, Config.getEntity(entity.entityId));
            } else {
                blockData = Config.getEntity(entity.entityId);
            }

            // Insert a block via it's instance into the parent
            blockInstance.insert(parent, 0, blockData, function (block) {
                // @todo child entities
                if (typeof elementBuiltFn === 'function') {
                    elementBuiltFn();
                }
            });
        } else if (entity && typeof entity.type !== 'undefined' && entity.type) {
            // @todo copy over structural data
            if (entity.type == 'row' && typeof parent.addRow === 'function') {
                newParent = parent.addRow(this.stage);
            } else if (entity.type == 'column' && typeof parent.addColumn === 'function') {
                newParent = parent.addColumn();
            }

            if (entity.children) {
                return this._rebuild(entity.children, newParent, elementBuiltFn);
            } else {
                if (typeof elementBuiltFn === 'function') {
                    elementBuiltFn();
                }
            }
        }
    };

    return Build;
});