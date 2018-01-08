/*eslint-disable */
define(["knockout"], function (_knockout) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Group Class
   *
   */
  'use strict';

  var Group =
  /*#__PURE__*/
  function () {
    /**
     * Group constructor
     *
     * @param id
     * @param group
     * @param blocks
     *
     * @todo change group type
     */
    function Group(id, group, blocks) {
      if (blocks === void 0) {
        blocks = [];
      }

      this.id = _knockout.observable();
      this.code = _knockout.observable('');
      this.label = _knockout.observable('');
      this.icon = _knockout.observable('');
      this.sort = _knockout.observable();
      this.blocks = _knockout.observableArray([]);
      this.active = _knockout.observable(false);
      this.hidden = _knockout.observable(false);
      this.id(id);
      this.code(group.code);
      this.label(group.label);
      this.icon(group.icon);
      this.sort(group.sort);
      this.blocks(blocks);
    }
    /**
     * Toggle the group
     */


    var _proto = Group.prototype;

    _proto.toggle = function toggle() {
      this.active(!this.active());
    };

    return Group;
  }();

  return {
    Group: Group
  };
});
//# sourceMappingURL=group.js.map
