/**
 * - Build.js
 * Handles rebuilding the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'underscore',
    'ko',
    'jquery',
    'bluefoot/config',
    'bluefoot/hook',
    'bluefoot/stage/panel/group/block'
], function (_, ko, jQuery, Config, Hook, Block) {

    /**
     * The build class handles building the stage with any previously saved content
     *
     * @constructor
     */
    function Build() {
        /** @type {Element|bool} */
        this.stageElement = false;
        /** @type {Stage|bool} */
        this.stage = false;
        /** @type {Element|bool} */
        this.document = false;
    }

    /**
     * Parse the potential structure
     *
     * @param structure
     * @returns {boolean}
     */
    Build.prototype.parseStructure = function (structure) {
        this.document = document.createElement('div');
        this.document.innerHTML = structure;
        this.stageElement = this.document.querySelector('[data-role="stage"]');

        // Return the stage element if the structure is present, otherwise return false
        return this.stageElement || false;
    };

    /**
     * Build a stage from previous data
     *
     * @param stage
     */
    Build.prototype.buildStage = function (stage) {
        var self = this;
        this.stage = stage;
        this.parseAndBuildElement(this.stageElement).then(function () {
            self.stage.stageContent.valueHasMutated();
            self.stage.loading(false);
        }).catch(function (e) {
            // Inform the user that an issue has occurred
            stage.parent.alertDialog({
                title: 'Advanced CMS Error',
                content: "An error has occurred whilst initiating the Advanced CMS content area.\n\n Please consult " +
                "with your development team on how to resolve."
            });

            console.error(e);
        });
    };

    /**
     * Recursively rebuild the stage, the wait lock included within this function is to ensure that all content is built
     * in the correct order. As the way we build entities is handled by the stage we have no reliable way of waiting
     * for it to be finished
     *
     * @param element {Element}
     * @param parent {{=}}
     * @returns {boolean}
     */
    Build.prototype.parseAndBuildElement = function (element, parent) {
        var self = this,
            role = element.getAttribute('data-role'),
            data = this.getElementData(element),
            children = this.getElementChildren(element),
            parent = parent || this.stage;

        // Add element to stage
        return this.buildElement(role, data, parent).then(function (newParent) {
            if (children.length > 0) {
                var childPromises = [];
                _.forEach(children, function (child) {
                    childPromises.push(self.parseAndBuildElement(child, newParent));
                });
                return Promise.all(childPromises);
            } else {
                return Promise.resolve();
            }
        });
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
     * Return elements children, search for direct decedents, or traverse through to find deep children
     *
     * @todo requires IE 11 polyfill for use of :scope
     *
     * @param element
     * @returns {array|NodeList}
     */
    Build.prototype.getElementChildren = function (element) {
        var directChildren = element.querySelectorAll(':scope > [data-role]');
        if (directChildren.length > 0) {
            return directChildren;
        }

        return this.findDeepChildren(element);
    };

    /**
     * Attempt to find deep children in an element
     *
     * @param element {Element}
     */
    Build.prototype.findDeepChildren = function (element) {
        var self = this;
        if (element.hasChildNodes()) {
            var deepChildren = [];
            _.forEach(element.childNodes, function (child) {
                // Only search elements which tagName's and not script tags
                if (child.tagName && child.tagName != 'SCRIPT') {
                    if (child.hasAttribute('data-role')) {
                        deepChildren.push(child);
                    } else {
                        deepChildren = self.findDeepChildren(child);
                    }
                }
            });
            return deepChildren;
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