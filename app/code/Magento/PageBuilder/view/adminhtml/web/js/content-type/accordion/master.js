/*eslint-disable */
define(["Magento_PageBuilder/js/content-type/master-collection"], function (_masterCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Master =
  /*#__PURE__*/
  function (_MasterCollection) {
    _inheritsLoose(Master, _MasterCollection);

    function Master() {
      return _MasterCollection.apply(this, arguments) || this;
    }

    var _proto = Master.prototype;

    /**
     * Retrieve the data-mage-init contents
     *
     * @returns {{accordion: {collapsibleElement: string; content: string}}}
     */
    _proto.getMageInit = function getMageInit() {
      return JSON.stringify({
        accordion: {
          active: this.getActive(),
          collapsibleElement: "[data-collapsible=true]",
          content: "[data-content=true]"
        }
      });
    };
    /**
     * Return the active (open on load) accordion items
     *
     * @returns {number[]|[]}
     */


    _proto.getActive = function getActive() {
      if (this.parent.dataStore.get("items")) {
        var items = this.parent.dataStore.get("items");
        var activeItems = items.map(function (item, index) {
          return item.open_on_load === "1" ? index : null;
        }).filter(function (item) {
          return item !== null;
        });
        return _.isEmpty(activeItems) ? [0] : activeItems;
      }

      return [0];
    };

    return Master;
  }(_masterCollection);

  return Master;
});
//# sourceMappingURL=master.js.map
