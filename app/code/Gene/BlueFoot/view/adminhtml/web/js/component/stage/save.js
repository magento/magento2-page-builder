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
        var isWhiteSpaceOrComment = function isWhiteSpaceOrComment() {
          return this.nodeType == 8 || this.nodeType == 3 && this.data.match(/^\s+$/);
        };

        temp.find('[data-bind]').each(function (index, value) {
          (0, _jquery)(value).removeAttr('data-bind');
        });
        temp.contents().filter(isWhiteSpaceOrComment).remove();
        temp.find('*').each(function (index, value) {
          (0, _jquery)(value).contents().filter(isWhiteSpaceOrComment).remove();
        }); // Strip all is wrapper elements

        temp.find('[data-is-wrapper]').each(function (index, element) {
          (0, _jquery)(element).parent().append((0, _jquery)(element).children());
          (0, _jquery)(element).remove();
        });
        resolve(temp.html());
        temp.remove();
      });

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