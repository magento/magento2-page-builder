/**
 * - Build.js
 * Handles rebuilding the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'bluefoot/event-emitter',
    'underscore',
    'ko',
    'jquery',
    'bluefoot/config',
    'bluefoot/stage/panel/group/block'
], function (EventEmitter, _, ko, jQuery, Config, Block) {

    /**
     * The build class handles building the stage with any previously saved content
     *
     * @constructor
     */
    function Build() {
        /** @type {Stage|bool} */
        this.stage = false;
        /** @type {Element|bool} */
        this.document = false;

        EventEmitter.apply(this, arguments);
    }
    Build.prototype = EventEmitter.prototype;

    /**
     * Parse the potential structure
     *
     * @param structure
     * @returns {boolean}
     */
    Build.prototype.parseStructure = function (structure) {
        this.document = document.createElement('div');
        this.document.innerHTML = structure;

        // Return the stage element if the structure is present, otherwise return false
        return this.document.querySelector('[' + Config.getValue('dataRoleAttributeName') + '="stage"]') || false;
    };

    /**
     * Build a stage from a preexisting structure
     *
     * @param stage
     * @param stageElement
     * @returns {Build}
     */
    Build.prototype.buildStage = function (stage, stageElement) {
        this.stage = stage;
        this.parseAndBuildStage(stageElement);
        return this;
    };

    /**
     * Parse and build the stage from the stage element
     *
     * @param stageElement
     * @returns {Promise.<*>}
     */
    Build.prototype.parseAndBuildStage = function (stageElement) {
        var self = this;

        // Handle the building with the events system
        return this.parseAndBuildElement(stageElement, this.stage)
            .then(function () {
                self.emit('buildDone');
            }).catch(function (error) {
                self.emit('buildError', error);
            });
    };

    /**
     * Parse an element in the structure and build the required element
     *
     * @param element
     * @param parent
     * @returns {*}
     */
    Build.prototype.parseAndBuildElement = function (element, parent) {
        if (element instanceof HTMLElement &&
            element.getAttribute(Config.getValue('dataRoleAttributeName'))
        ) {
            parent = parent || this.stage;
            var self = this,
                role = element.getAttribute(Config.getValue('dataRoleAttributeName')),
                data = this.getElementData(element),
                children = this.getElementChildren(element);

            // Add element to stage
            return this.buildElement(role, data, parent).then(function (newParent) {
                if (children.length > 0) {
                    var childPromises = [];
                    _.forEach(children, function (child) {
                        childPromises.push(self.parseAndBuildElement(child, newParent));
                    });
                    return Promise.all(childPromises);
                } else {
                    return Promise.resolve(newParent);
                }
            });
        } else {
            return Promise.reject(new Error('Element does not contain valid role attribute.'));
        }
    };

    /**
     * Retrieve the elements data
     *
     * @param element
     * @returns {{}}
     */
    Build.prototype.getElementData = function (element) {
        var scriptTag = element.querySelector('script[type="text/advanced-cms-data"]');
        if (scriptTag) {
            return scriptTag.innerHTML ? JSON.parse(scriptTag.innerHTML) : {};
        }

        return {};
    };

    /**
     * Return elements children, search for direct decedents, or traverse through to find deeper children
     *
     * @param element {Element}
     * @returns {[]|NodeList}
     */
    Build.prototype.getElementChildren = function (element) {
        var self = this;
        if (element.hasChildNodes()) {
            var children = [];
            // Find direct children of the element
            _.forEach(element.childNodes, function (child) {
                // Only search elements which tagName's and not script tags
                if (child.tagName && child.tagName != 'SCRIPT') {
                    if (child.hasAttribute(Config.getValue('dataRoleAttributeName'))) {
                        children.push(child);
                    } else {
                        children = self.getElementChildren(child);
                    }
                }
            });

            if (children.length > 0) {
                return children;
            }
        }

        return [];
    };

    /**
     * Forward build instruction to necessary build function
     *
     * @param role
     * @param data
     * @param parent
     */
    Build.prototype.buildElement = function (role, data, parent) {
        switch (role) {
            case 'stage':
                // If the stage is being built, we don't need to "build" anything, just return the stage as the
                // new parent
                return Promise.resolve(this.stage);
            break;
            case 'row':
                return this._buildRow(data, parent);
            break;
            case 'column':
                return this._buildColumn(data, parent);
            break;
            default:
                return this._buildEntity(role, data, parent);
            break;
        }
    };

    /**
     * Build a new row with it's associated data
     *
     * @param data
     * @param parent
     * @returns {Promise.<*>}
     * @private
     */
    Build.prototype._buildRow = function (data, parent) {
        return Promise.resolve(parent.addRow(this.stage, data));
    };

    /**
     * Build a new column with it's associated data
     *
     * @param data
     * @param parent
     * @returns {Promise.<T>}
     * @private
     */
    Build.prototype._buildColumn = function (data, parent) {
        return Promise.resolve(parent.addColumn(data));
    };

    /**
     * Add an entity into the system
     *
     * @param role
     * @param data
     * @param parent
     * @returns {Promise.<T>}
     * @private
     */
    Build.prototype._buildEntity = function (role, data, parent) {
        var blockConfig = Config.getContentTypeConfig(role),
            blockInstance = new Block(blockConfig, false);

        return new Promise(function (resolve) {
            blockInstance.insert(parent, false, data, function (block) {
                // @todo potentially handle block children
                resolve(block);
            });
        });
    };

    return Build;
});