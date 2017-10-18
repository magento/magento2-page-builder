define(['exports', '../../event-emitter', '../../block/factory', '../../stage/style-attribute-filter', '../../../utils/array', 'underscore', 'knockout', 'mageUtils', 'mage/translate'], function (exports, _eventEmitter, _factory, _styleAttributeFilter, _array, _underscore, _knockout, _mageUtils, _translate) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _eventEmitter2 = _interopRequireDefault(_eventEmitter);

    var _factory2 = _interopRequireDefault(_factory);

    var _styleAttributeFilter2 = _interopRequireDefault(_styleAttributeFilter);

    var _underscore2 = _interopRequireDefault(_underscore);

    var _knockout2 = _interopRequireDefault(_knockout);

    var _mageUtils2 = _interopRequireDefault(_mageUtils);

    var _translate2 = _interopRequireDefault(_translate);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var EditableArea = function (_EventEmitter) {
        _inherits(EditableArea, _EventEmitter);

        /**
         * EditableArea constructor
         *
         * @param stage
         */
        function EditableArea(stage) {
            _classCallCheck(this, EditableArea);

            var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

            _this.id = _mageUtils2.default.uniqueid();
            _this.title = (0, _translate2.default)('Editable');
            _this.styleAttributeFilter = new _styleAttributeFilter2.default();
            if (stage) {
                _this.stage = stage;
            }
            _underscore2.default.bindAll(_this, 'onBlockDropped', 'onBlockInstanceDropped', 'onBlockRemoved', 'onBlockSorted', 'onSortStart', 'onSortStop');
            // Attach events to structural elements
            // Block dropped from left hand panel
            _this.on('blockDropped', _this.onBlockDropped);
            // Block instance being moved between structural elements
            _this.on('blockInstanceDropped', _this.onBlockInstanceDropped);
            _this.on('blockRemoved', _this.onBlockRemoved);
            // Block sorted within the same structural element
            _this.on('blockSorted', _this.onBlockSorted);
            _this.on('sortStart', _this.onSortStart);
            _this.on('sortStop', _this.onSortStop);
            return _this;
        }
        /**
         * Set the children observable array into the class
         *
         * @param children
         */


        EditableArea.prototype.setChildren = function setChildren(children) {
            var _this2 = this;

            this.children = children;
            // Attach a subscription to the children of every editable area to fire the stageUpdated event
            children.subscribe(function () {
                return _this2.stage.emit('stageUpdated');
            });
        };

        EditableArea.prototype.duplicateChild = function duplicateChild(child) {
            var autoAppend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            var store = this.stage.store,
                instance = child.constructor,
                duplicate = new instance(child.parent, child.stage, child.config),
                index = child.parent.children.indexOf(child) + 1 || null;
            // Copy the data from the data store
            store.update(duplicate.id, Object.assign({}, store.get(child.id)));
            // Duplicate the instances children into the new duplicate
            if (child.children().length > 0) {
                child.children().forEach(function (subChild, index) {
                    duplicate.addChild(duplicate.duplicateChild(subChild, false), index);
                });
            }
            if (autoAppend) {
                this.addChild(duplicate, index);
            }
            return duplicate;
        };

        EditableArea.prototype.getStage = function getStage() {
            return this.stage;
        };

        EditableArea.prototype.addChild = function addChild(child, index) {
            child.parent = this;
            child.stage = this.stage;
            if (index) {
                // Use the arrayUtil function to add the item in the correct place within the array
                (0, _array.moveArrayItemIntoArray)(child, this.children, index);
            } else {
                this.children.push(child);
            }
        };

        EditableArea.prototype.removeChild = function removeChild(child) {
            (0, _array.removeArrayItem)(this.children, child);
        };

        EditableArea.prototype.onBlockDropped = function onBlockDropped(event, params) {
            var _this3 = this;

            var index = params.index || 0;
            new Promise(function (resolve, reject) {
                if (params.block) {
                    return (0, _factory2.default)(params.block.config, _this3, _this3.stage).then(function (block) {
                        _this3.addChild(block, index);
                        resolve(block);
                        block.emit('blockReady');
                    }).catch(function (error) {
                        reject(error);
                    });
                } else {
                    reject('Parameter block missing from event.');
                }
            }).catch(function (error) {
                console.error(error);
            });
        };

        EditableArea.prototype.onBlockInstanceDropped = function onBlockInstanceDropped(event, params) {
            this.addChild(params.blockInstance, params.index);
            /*
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }*/
            params.blockInstance.emit('blockMoved');
        };

        EditableArea.prototype.onBlockRemoved = function onBlockRemoved(event, params) {
            params.block.emit('blockBeforeRemoved');
            this.removeChild(params.block);
            // Remove the instance from the data store
            this.stage.store.remove(this.id);
            /*
            if (ko.processAllDeferredBindingUpdates) {
                ko.processAllDeferredBindingUpdates();
            }*/
        };

        EditableArea.prototype.onBlockSorted = function onBlockSorted(event, params) {
            var originalIndex = _knockout2.default.utils.arrayIndexOf(this.children(), params.block);
            if (originalIndex !== params.index) {
                (0, _array.moveArrayItem)(this.children, originalIndex, params.index);
            }
            params.block.emit('blockMoved');
        };

        EditableArea.prototype.onSortStart = function onSortStart(event, params) {
            var originalEle = jQuery(params.originalEle);
            originalEle.show();
            originalEle.addClass('bluefoot-sorting-original');
            // Reset the width & height of the helper
            jQuery(params.helper).css({ width: '', height: '' }).html(jQuery('<h3 />').text(this.title).html());
        };

        EditableArea.prototype.onSortStop = function onSortStop(event, params) {
            jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
        };

        EditableArea.prototype.getCss = function getCss() {
            var cssClasses = {};
            if ('css_classes' in this.getData()) {
                this.getData().css_classes.map(function (value, index) {
                    return cssClasses[value] = true;
                });
            }
            return cssClasses;
        };

        EditableArea.prototype.getStyle = function getStyle() {
            return this.styleAttributeFilter.filter(this.getData());
        };

        EditableArea.prototype.getData = function getData() {
            return this.stage.store.get(this.id);
        };

        return EditableArea;
    }(_eventEmitter2.default);

    exports.default = EditableArea;
});