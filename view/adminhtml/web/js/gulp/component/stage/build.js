var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "underscore", "../event-emitter", "../config", "../block/factory"], function (require, exports, _, event_emitter_1, config_1, factory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Build Class
     *
     * @author Dave Macaulay <hello@davemacaulay.com>
     */
    var Build = (function (_super) {
        __extends(Build, _super);
        function Build() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Parse the potential structure
         *
         * @param structure
         */
        Build.prototype.parseStructure = function (structure) {
            this.document = document.createElement('div');
            this.document.innerHTML = structure;
            // Return the stage element if the structure is present, otherwise return false
            return this.document.querySelector('[' + config_1.Config.getValue('dataRoleAttributeName') + '="stage"]') || false;
        };
        /**
         * Build the stage
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
         * @returns {Promise<T>}
         */
        Build.prototype.parseAndBuildStage = function (stageElement) {
            var _this = this;
            return this.parseAndBuildElement(stageElement, this.stage)
                .then(function () {
                _this.emit('buildDone');
            }).catch(function (error) {
                _this.emit('buildError', error);
            });
        };
        /**
         * Parse an element in the structure and build the required element
         *
         * @param element
         * @param parent
         * @returns {Promise<EditableAreaInterface>}
         */
        Build.prototype.parseAndBuildElement = function (element, parent) {
            var _this = this;
            if (element instanceof HTMLElement &&
                element.getAttribute(config_1.Config.getValueAsString('dataRoleAttributeName'))) {
                parent = parent || this.stage;
                var role = element.getAttribute(config_1.Config.getValueAsString('dataRoleAttributeName')), data = Build.getElementData(element), children_1 = this.getElementChildren(element);
                // Add element to stage
                return this.buildElement(role, data, parent).then(function (newParent) {
                    if (children_1.length > 0) {
                        var childPromises_1 = [];
                        _.forEach(children_1, function (child) {
                            childPromises_1.push(_this.parseAndBuildElement(child, newParent));
                        });
                        return Promise.all(childPromises_1);
                    }
                    else {
                        return Promise.resolve(newParent);
                    }
                });
            }
            else {
                return Promise.reject(new Error('Element does not contain valid role attribute.'));
            }
        };
        /**
         * Retrieve the elements data
         *
         * @param element
         * @returns {{}}
         */
        Build.getElementData = function (element) {
            var scriptTag = element.querySelector('script[type="text/advanced-cms-data"]');
            if (scriptTag) {
                return scriptTag.innerHTML ? JSON.parse(scriptTag.innerHTML) : {};
            }
            return {};
        };
        /**
         * Return elements children, search for direct decedents, or traverse through to find deeper children
         *
         * @param element
         * @returns {Array}
         */
        Build.prototype.getElementChildren = function (element) {
            var _this = this;
            if (element.hasChildNodes()) {
                var children_2 = [];
                // Find direct children of the element
                _.forEach(element.childNodes, function (child) {
                    // Only search elements which tagName's and not script tags
                    if (child.tagName && child.tagName != 'SCRIPT') {
                        if (child.hasAttribute(config_1.Config.getValueAsString('dataRoleAttributeName'))) {
                            children_2.push(child);
                        }
                        else {
                            children_2 = _this.getElementChildren(child);
                        }
                    }
                });
                if (children_2.length > 0) {
                    return children_2;
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
         * @returns {Promise<EditableAreaInterface>}
         */
        Build.prototype.buildElement = function (role, data, parent) {
            switch (role) {
                case 'stage':
                    // If the stage is being built, we don't need to "build" anything, just return the stage as the
                    // new parent
                    return Promise.resolve(this.stage);
                case 'row':
                    return this.buildRow(data, parent);
                case 'column':
                    return this.buildColumn(data, parent);
                default:
                    return this.buildEntity(role, data, parent);
            }
        };
        /**
         * Build a new row with it's associated data
         *
         * @param data
         * @param parent
         * @returns {Promise<RowInterface>}
         */
        Build.prototype.buildRow = function (data, parent) {
            return Promise.resolve(parent.addRow(this.stage, data));
        };
        /**
         * Build a new column with it's associated data
         *
         * @param data
         * @param parent
         * @returns {Promise<ColumnInterface>}
         */
        Build.prototype.buildColumn = function (data, parent) {
            return Promise.resolve(parent.addColumn(data));
        };
        /**
         * Add an entity into the system
         *
         * @param role
         * @param data
         * @param parent
         * @returns {Promise<T>}
         */
        Build.prototype.buildEntity = function (role, data, parent) {
            return new Promise(function (resolve, reject) {
                factory_1.default(config_1.Config.getContentBlockConfig(role), parent, this.stage, data).then(function (block) {
                    parent.addChild(block);
                    resolve(block);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
        return Build;
    }(event_emitter_1.EventEmitter));
    exports.Build = Build;
});
