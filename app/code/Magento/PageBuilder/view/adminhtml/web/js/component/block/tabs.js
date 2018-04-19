/*eslint-disable */
define(["mage/translate", "uiEvents", "underscore", "Magento_PageBuilder/js/component/block/factory", "Magento_PageBuilder/js/component/config", "Magento_PageBuilder/js/component/stage/structural/options/option", "Magento_PageBuilder/js/component/block/block"], function (_translate, _uiEvents, _underscore, _factory, _config, _option, _block) {
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
     * Add a tab
     */


    _proto.addTab = function addTab() {
      var _this = this;

      this.preview.setActiveTab(this.children().length - 1);
      (0, _factory)(_config.getInitConfig("content_types")["tab-item"], this, this.stage).then(function (tab) {
        _underscore.defer(function () {
          var mountFunction = function mountFunction(event, args) {
            if (args.id === tab.id) {
              _this.preview.setFocusedTab(_this.children().length - 1);

              _uiEvents.off("tab-item:block:mount:add");
            }
          };

          _uiEvents.on("tab-item:block:mount", mountFunction, "tab-item:block:mount:add");

          _this.addChild(tab, _this.children().length); // Update the default tab title when adding a new tab


          _this.parent.stage.store.updateKey(tab.id, (0, _translate)("Tab") + " " + (_this.children.indexOf(tab) + 1), "tab_name");
        });
      });
    };
    /**
     * Bind events for the current instance
     */


    _proto.bindEvents = function bindEvents() {
      var _this2 = this;

      _Block.prototype.bindEvents.call(this); // Block being mounted onto container


      _uiEvents.on("tabs:block:ready", function (event, args) {
        if (args.id === _this2.id && _this2.children().length === 0) {
          _this2.addTab();
        }
      }); // Block being removed from container


      _uiEvents.on("tab-item:block:removed", function (event, args) {
        if (args.parent.id === _this2.id) {
          // Mark the previous slide as active
          var newIndex = args.index - 1 >= 0 ? args.index - 1 : 0;

          _this2.preview.setFocusedTab(newIndex);
        }
      }); // Capture when a block is duplicated within the container


      var duplicatedTab;
      var duplicatedTabIndex;

      _uiEvents.on("tab-item:block:duplicate", function (event, args) {
        if (args.duplicate.parent.id === _this2.id) {
          duplicatedTab = args.duplicate;
          duplicatedTabIndex = args.index;
        }
      });

      _uiEvents.on("tab-item:block:mount", function (event, args) {
        if (duplicatedTab && args.id === duplicatedTab.id) {
          _this2.preview.setFocusedTab(duplicatedTabIndex, true);

          duplicatedTab = duplicatedTabIndex = null;
        }

        if (_this2.id === args.block.parent.id) {
          _this2.updateTabNamesInDataStore();

          _this2.parent.stage.store.subscribe(function () {
            _this2.updateTabNamesInDataStore();
          }, args.block.id);
        }
      });
    };
    /**
     * Update data store with active options
     */


    _proto.updateTabNamesInDataStore = function updateTabNamesInDataStore() {
      var activeOptions = [];
      this.children().forEach(function (tab, index) {
        var tabData = tab.stage.store.get(tab.id);
        activeOptions.push({
          label: tabData.tab_name.toString(),
          labeltitle: tabData.tab_name.toString(),
          value: index
        });
      });
      this.parent.stage.store.updateKey(this.id, activeOptions, "_default_active_options");
    };

    return Tabs;
  }(_block);

  return Tabs;
});
//# sourceMappingURL=tabs.js.map
