/*eslint-disable */
define(["mage/translate", "underscore", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/event-bus", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/block/block"], function (_translate, _underscore, _factory, _config, _eventBus, _option, _block) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Tabs =
  /*#__PURE__*/
  function (_Block) {
    _inheritsLoose(Tabs, _Block);

    function Tabs() {
      return _Block.apply(this, arguments) || this;
    }

    var _proto = Tabs.prototype;

    /**
     * Return an array of options
     *
     * @returns {Array<OptionInterface>}
     */
    _proto.retrieveOptions = function retrieveOptions() {
      var options = _Block.prototype.retrieveOptions.call(this);

      options.push(new _option.Option(this, "add", "<i class='icon-pagebuilder-add'></i>", (0, _translate)("Add"), this.addTab, ["add-child"], 10));
      return options;
    };
    /**
     * Add a slide into the slider
     */


    _proto.addTab = function addTab() {
      var _this = this;

      this.preview.setActiveTab(this.children().length - 1);
      (0, _factory)(_config.getInitConfig("content_types").tab, this, this.stage).then(function (tab) {
        _underscore.defer(function () {
          var mountFn = function mountFn(event, params) {
            if (params.id === tab.id) {
              _this.preview.setFocusedTab(_this.children().length - 1);

              _eventBus.off("tab:block:mount", mountFn);
            }
          };

          _eventBus.on("tab:block:mount", mountFn);

          _this.addChild(tab, _this.children().length);
        });
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this); // Block being mounted onto container


      _eventBus.on("tabs:block:ready", function (event, params) {
        if (params.id === _this2.id && _this2.children().length === 0) {
          _this2.addTab();
        }
      }); // Block being removed from container


      _eventBus.on("tab:block:removed", function (event, params) {
        if (params.parent.id === _this2.id) {
          // Mark the previous slide as active
          var newIndex = params.index - 1 >= 0 ? params.index - 1 : 0;

          _this2.preview.setFocusedTab(newIndex);
        }
      }); // Capture when a block is duplicated within the container


      var duplicatedTab;
      var duplicatedTabIndex;

      _eventBus.on("tab:block:duplicate", function (event, params) {
        if (params.duplicate.parent.id === _this2.id) {
          duplicatedTab = params.duplicate;
          duplicatedTabIndex = params.index;
        }
      });

      _eventBus.on("tab:block:mount", function (event, params) {
        if (duplicatedTab && params.id === duplicatedTab.id) {
          _this2.preview.setFocusedTab(duplicatedTabIndex, true);

          duplicatedTab = duplicatedTabIndex = null;
        }
      });
    };

    return Tabs;
  }(_block);

  return Tabs;
});
//# sourceMappingURL=tabs.js.map
