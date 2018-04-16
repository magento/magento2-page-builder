/*eslint-disable */
define(["mage/translate", "Magento_PageBuilder/js/modal/dismissible-confirm", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/block/block"], function (_translate, _dismissibleConfirm, _eventBus, _option, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var TabItem =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(TabItem, _Block);

    function TabItem() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = TabItem.prototype;

    /**
     * Get the options instance
     *
     * @returns {Options}
     */
    _proto.getOptions = function getOptions() {
      var options = _Block.prototype.getOptions.call(this);

      options.removeOption("move");
      options.removeOption("title");
      return options;
    };
    /**
     * Return an array of options
     *
     * @returns {Array<Option>}
     */


    _proto.retrieveOptions = function retrieveOptions() {
      var options = _Block.prototype.retrieveOptions.call(this);

      var newOptions = options.filter(function (option) {
        return option.code !== "remove";
      });
      var removeClasses = ["remove-structural"];
      var removeFn = this.onOptionRemove;

      if (this.parent.children().length <= 1) {
        removeFn = function removeFn() {
          return;
        };

        removeClasses.push("disabled");
      }

      newOptions.push(new _option.Option(this, "remove", "<i class='icon-admin-pagebuilder-remove'></i>", (0, _translate)("Remove"), removeFn, removeClasses, 100));
      return newOptions;
    };
    /**
     * Handle block removal
     */


    _proto.onOptionRemove = function onOptionRemove() {
      var _this = this;

      var removeBlock = function removeBlock() {
        var params = {
          block: _this,
          index: _this.parent.children().indexOf(_this),
          parent: _this.parent
        };

        _eventBus.trigger("block:removed", params);

        _eventBus.trigger(_this.config.name + ":block:removed", params);
      };

      if (this.isConfigured()) {
        (0, _dismissibleConfirm)({
          actions: {
            confirm: function confirm() {
              // Call the parent to remove the child element
              removeBlock();
            }
          },
          content: (0, _translate)("Are you sure you want to remove this item? The data within this item is not recoverable once removed."),
          // tslint:disable-line:max-line-length
          dismissKey: "pagebuilder_modal_dismissed",
          dismissible: true,
          title: (0, _translate)("Confirm Item Removal")
        });
      } else {
        removeBlock();
      }
    };
    /**
     * Does the current instance have any children or values different from the default for it's type?
     *
     * @returns {boolean}
     */


    _proto.isConfigured = function isConfigured() {
      if (this.children().length > 0) {
        return true;
      }

      var data = this.getData();
      var hasDataChanges = false;

      _.each(this.config.fields, function (field, key) {
        // ignore tab name
        if (key === "tab_name") {
          return;
        }

        var fieldValue = data[key];

        if (!fieldValue) {
          fieldValue = "";
        } // Default values can only ever be strings


        if (_.isObject(fieldValue)) {
          // Empty arrays as default values appear as empty strings
          if (_.isArray(fieldValue) && fieldValue.length === 0) {
            fieldValue = "";
          } else {
            fieldValue = JSON.stringify(fieldValue);
          }
        }

        if (_.isObject(field.default)) {
          if (JSON.stringify(field.default) !== fieldValue) {
            hasDataChanges = true;
          }
        } else if (field.default !== fieldValue) {
          hasDataChanges = true;
        }

        return;
      });

      return hasDataChanges;
    };

    return TabItem;
  }(_block);

  return TabItem;
});
//# sourceMappingURL=tab-item.js.map
