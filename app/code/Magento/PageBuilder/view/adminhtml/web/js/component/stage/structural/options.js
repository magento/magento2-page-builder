/*eslint-disable */
define(["knockout", "underscore"], function (_knockout, _underscore) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Options =
  /*#__PURE__*/
  function () {
    /**
     * Options constructor
     *
     * @param parent
     * @param options
     */
    function Options(parent, options) {
      this.template = "Magento_PageBuilder/component/stage/structural/options.html";
      this.parent = void 0;
      this.options = _knockout.observableArray([]);
      this.parent = parent;
      this.options(options);
      this.sort();
    }
    /**
     * Add an option into the options array
     *
     * @param option
     */


    var _proto = Options.prototype;

    _proto.addOption = function addOption(option) {
      this.options.push(option);
      this.sort();
    };
    /**
     * Remove an option
     *
     * @param code
     */


    _proto.removeOption = function removeOption(code) {
      this.options(_underscore.without(this.options(), _underscore.findWhere(this.options(), {
        code: code
      })));
      this.sort();
    };
    /**
     * Sort the options
     */


    _proto.sort = function sort() {
      this.options.sort(function (a, b) {
        return a.sort === b.sort ? 0 : a.sort < b.sort ? -1 : 1;
      });
    };

    return Options;
  }();

  return {
    Options: Options
  };
});
//# sourceMappingURL=options.js.map
