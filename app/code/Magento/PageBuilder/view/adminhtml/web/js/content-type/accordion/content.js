/*eslint-disable */
define(["Magento_PageBuilder/js/content-collection"], function (_contentCollection) {
  function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

  var Content =
  /*#__PURE__*/
  function (_ContentCollection) {
    _inheritsLoose(Content, _ContentCollection);

    function Content() {
      return _ContentCollection.apply(this, arguments) || this;
    }

    var _proto = Content.prototype;

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
      if (this.parent.store.get(this.parent.id).items) {
        var items = this.parent.store.get(this.parent.id).items;
        var activeItems = items.map(function (item, index) {
          return item.open_on_load === "1" ? index : null;
        }).filter(function (item) {
          return item !== null;
        });
        return _.isEmpty(activeItems) ? [0] : activeItems;
      }

      return [0];
    };

    return Content;
  }(_contentCollection);

  return Content;
});
//# sourceMappingURL=content.js.map
