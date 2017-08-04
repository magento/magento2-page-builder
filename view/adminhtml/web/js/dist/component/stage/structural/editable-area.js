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
define(["require", "exports", "../../event-emitter", "../../stage", "../../block/factory", "utils/array"], function (require, exports, event_emitter_1, stage_1, factory_1, array_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Class EditableArea
     *
     * @author Dave Macaulay <dmacaulay@magento.com>
     */
    var EditableArea = (function (_super) {
        __extends(EditableArea, _super);
        /**
         * EditableArea constructor
         *
         * @param stage
         */
        function EditableArea(stage) {
            var _this = _super.call(this) || this;
            _this.title = 'Editable'; // @todo translate
            if (stage) {
                _this.stage = stage;
            }
            return _this;
        }
        /**
         * Set the children observable array into the class
         *
         * @param children
         */
        EditableArea.prototype.setChildren = function (children) {
            this.children = children;
        };
        /**
         * Retrieve the stage instance
         *
         * @returns {StageInterface}
         */
        EditableArea.prototype.getStage = function () {
            if (this.stage) {
                return this.stage;
            }
            if (this instanceof stage_1.Stage) {
                return this;
            }
        };
        /**
         * Add a child into the observable array
         *
         * @param child
         * @param index
         */
        EditableArea.prototype.addChild = function (child, index) {
            child.parent = this;
            child.stage = this.stage;
            if (index) {
                // Use the arrayUtil function to add the item in the correct place within the array
                array_1.moveArrayItemIntoArray(child, this.children, index);
            }
            else {
                this.children.push(child);
            }
        };
        /**
         * Remove a child from the observable array
         *
         * @param child
         */
        EditableArea.prototype.removeChild = function (child) {
            array_1.removeArrayItem(this.children, child);
        };
        /**
         * Handle a block being dropped into the structural element
         *
         * @param event
         * @param params
         * @returns {Promise<Block|T>}
         */
        EditableArea.prototype.onBlockDropped = function (event, params) {
            var _this = this;
            var index = params.index || 0;
            new Promise(function (resolve, reject) {
                if (params.block) {
                    return factory_1.default(params.block.config, _this, _this.stage).then(function (block) {
                        _this.addChild(block, index);
                        resolve(block);
                        block.emit('blockReady');
                    }).catch(function (error) {
                        reject(error);
                    });
                }
                else {
                    reject('Parameter block missing from event.');
                }
            }).catch(function (error) {
                console.error(error);
            });
        };
        /**
         * Capture a block instance being dropped onto this element
         *
         * @param event
         * @param params
         */
        EditableArea.prototype.onBlockInstanceDropped = function (event, params) {
            this.addChild(params.blockInstance, params.index);
            /*
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }*/
            params.blockInstance.emit('blockMoved');
        };
        /**
         * Handle event to remove block
         *
         * @param event
         * @param params
         */
        EditableArea.prototype.onBlockRemoved = function (event, params) {
            params.block.emit('blockBeforeRemoved');
            this.removeChild(params.block);
            /*
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }*/
        };
        /**
         * Handle event when a block is sorted within it's current container
         *
         * @param event
         * @param params
         */
        EditableArea.prototype.onBlockSorted = function (event, params) {
            var originalIndex = ko.utils.arrayIndexOf(this.children(), params.block);
            if (originalIndex !== params.index) {
                array_1.moveArrayItem(this.children, originalIndex, params.index);
            }
            params.block.emit('blockMoved');
        };
        /**
         * Event called when starting starts on this element
         *
         * @param event
         * @param params
         */
        EditableArea.prototype.onSortStart = function (event, params) {
            var originalEle = jQuery(params.originalEle);
            originalEle.show();
            originalEle.addClass('bluefoot-sorting-original');
            // Reset the width & height of the helper
            jQuery(params.helper)
                .css({ width: '', height: '' })
                .html(jQuery('<h3 />').text(this.title).html());
        };
        /**
         * Event called when sorting stops on this element
         *
         * @param event
         * @param params
         */
        EditableArea.prototype.onSortStop = function (event, params) {
            jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
        };
        return EditableArea;
    }(event_emitter_1.EventEmitter));
    exports.EditableArea = EditableArea;
});
//# sourceMappingURL=editable-area.js.map