define(["knockout", "jquery", "Magento_Ui/js/lib/knockout/template/engine"], function (_knockout, _jquery, _engine) {
  /**
   * Copyright © 2013-2017 Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  // The root template for the render tree
  var rootTemplate = 'Gene_BlueFoot/component/block/render/root.html';
  /**
   * Render the tree into a string
   *
   * @param {KnockoutObservableArray<Structural>} tree
   */

  function renderTree(tree) {
    var temp = (0, _jquery)('<div>');
    return new Promise(function (resolve, reject) {
      _engine.waitForFinishRender().then(function () {
        temp.find('[data-bind]').each(function (index, value) {
          (0, _jquery)(value).removeAttr('data-bind');
        });
        temp.contents().filter(function () {
          return this.nodeType == 8;
        }).remove();
        temp.find('*').each(function (index, value) {
          (0, _jquery)(value).contents().filter(function () {
            return this.nodeType == 8;
          }).remove();
        }); // Strip all is wrapper elements

        temp.find('[data-is-wrapper]').each(function (index, element) {
          (0, _jquery)(element).parent().append((0, _jquery)(element).children());
          (0, _jquery)(element).remove();
        });
        var content = temp.html();
        content = content.replace(/\r?\n|\r/g, '');
        console.log('renderTree completed', content);
        resolve(temp.html());
        temp.remove();
      });

      console.log('renderTree started');

      _knockout.applyBindingsToNode(temp[0], {
        template: {
          name: rootTemplate,
          data: {
            getChildren: function getChildren() {
              return tree;
            }
          }
        }
      });
    });
  }

  return renderTree;
});
//# sourceMappingURL=save.js.map
