define(["../../event-emitter", "../../block/factory", "../../../utils/style-attribute-filter", "../../../utils/dom-attribute-mapper", "../../../utils/array", "underscore", "knockout", "mageUtils", "mage/translate"], function (_eventEmitter, _factory, _styleAttributeFilter, _domAttributeMapper, _array, _underscore, _knockout, _mageUtils, _translate) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  /**
   * Class EditableArea
   *
   * @author Dave Macaulay <dmacaulay@magento.com>
   */
  var EditableArea =
  /*#__PURE__*/
  function (_EventEmitter) {
    _inheritsLoose(EditableArea, _EventEmitter);

    // @todo populate from config

    /**
     * EditableArea constructor
     *
     * @param stage
     */
    function EditableArea(stage) {
      var _this;

      _this = _EventEmitter.call(this) || this;
      _this.id = _mageUtils.uniqueid();
      _this.children = void 0;
      _this.stage = void 0;
      _this.title = (0, _translate)('Editable');
      _this.styleAttributeFilter = new _styleAttributeFilter();
      _this.domAttributeMapper = new _domAttributeMapper();
      _this.childTemplate = 'Gene_BlueFoot/component/block/render/children.html';

      if (stage) {
        _this.stage = stage;
      }

      _underscore.bindAll(_this, 'onBlockDropped', 'onBlockInstanceDropped', 'onBlockRemoved', 'onBlockSorted', 'onSortStart', 'onSortStop'); // Attach events to structural elements
      // Block dropped from left hand panel


      _this.on('blockDropped', _this.onBlockDropped); // Block instance being moved between structural elements


      _this.on('blockInstanceDropped', _this.onBlockInstanceDropped);

      _this.on('blockRemoved', _this.onBlockRemoved); // Block sorted within the same structural element


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


    var _proto = EditableArea.prototype;

    _proto.setChildren = function setChildren(children) {
      var _this2 = this;

      this.children = children; // Attach a subscription to the children of every editable area to fire the stageUpdated event

      children.subscribe(function () {
        return _this2.stage.emit('stageUpdated');
      });
    };
    /**
     * Return the children of the current element
     *
     * @returns {KnockoutObservableArray<Structural>}
     */


    _proto.getChildren = function getChildren() {
      return this.children;
    };
    /**
     * Duplicate a child of the current instance
     *
     * @param {Structural} child
     * @param {boolean} autoAppend
     * @returns {Structural}
     */


    _proto.duplicateChild = function duplicateChild(child, autoAppend) {
      if (autoAppend === void 0) {
        autoAppend = true;
      }

      var store = this.stage.store,
          instance = child.constructor,
          duplicate = new instance(child.parent, child.stage, child.config),
          index = child.parent.children.indexOf(child) + 1 || null; // Copy the data from the data store

      store.update(duplicate.id, Object.assign({}, store.get(child.id))); // Duplicate the instances children into the new duplicate

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
    /**
     * Retrieve the stage instance
     *
     * @returns {Stage}
     */


    _proto.getStage = function getStage() {
      return this.stage;
    };
    /**
     * Add a child into the observable array
     *
     * @param child
     * @param index
     */


    _proto.addChild = function addChild(child, index) {
      child.parent = this;
      child.stage = this.stage;

      if (index) {
        // Use the arrayUtil function to add the item in the correct place within the array
        (0, _array.moveArrayItemIntoArray)(child, this.children, index);
      } else {
        this.children.push(child);
      }
    };
    /**
     * Remove a child from the observable array
     *
     * @param child
     */


    _proto.removeChild = function removeChild(child) {
      (0, _array.removeArrayItem)(this.children, child);
    };
    /**
     * Handle a block being dropped into the structural element
     *
     * @param event
     * @param params
     * @returns {Promise<Block|T>}
     */


    _proto.onBlockDropped = function onBlockDropped(event, params) {
      var _this3 = this;

      var index = params.index || 0;
      new Promise(function (resolve, reject) {
        if (params.block) {
          return (0, _factory)(params.block.config, _this3, _this3.stage).then(function (block) {
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
    /**
     * Capture a block instance being dropped onto this element
     *
     * @param event
     * @param params
     */


    _proto.onBlockInstanceDropped = function onBlockInstanceDropped(event, params) {
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


    _proto.onBlockRemoved = function onBlockRemoved(event, params) {
      params.block.emit('blockBeforeRemoved');
      this.removeChild(params.block); // Remove the instance from the data store

      this.stage.store.remove(this.id);
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


    _proto.onBlockSorted = function onBlockSorted(event, params) {
      var originalIndex = _knockout.utils.arrayIndexOf(this.children(), params.block);

      if (originalIndex !== params.index) {
        (0, _array.moveArrayItem)(this.children, originalIndex, params.index);
      }

      params.block.emit('blockMoved');
    };
    /**
     * Event called when starting starts on this element
     *
     * @param event
     * @param params
     */


    _proto.onSortStart = function onSortStart(event, params) {
      var originalEle = jQuery(params.originalEle);
      originalEle.show();
      originalEle.addClass('bluefoot-sorting-original'); // Reset the width & height of the helper

      jQuery(params.helper).css({
        width: '',
        height: ''
      }).html(jQuery('<h3 />').text(this.title).html());
    };
    /**
     * Event called when sorting stops on this element
     *
     * @param event
     * @param params
     */


    _proto.onSortStop = function onSortStop(event, params) {
      jQuery(params.originalEle).removeClass('bluefoot-sorting-original');
    };

    return EditableArea;
  }(_eventEmitter);

  return EditableArea;
});
//# sourceMappingURL=editable-area.js.map
