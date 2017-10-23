define(['exports', 'knockout', 'jquery', 'Magento_Ui/js/lib/knockout/template/engine'], function (exports, _knockout, _jquery, _engine) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = renderTree;

    var _knockout2 = _interopRequireDefault(_knockout);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _engine2 = _interopRequireDefault(_engine);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // The root template for the render tree
    var rootTemplate = 'Gene_BlueFoot/component/block/render/root.html';
    /**
     * Render the tree into a string
     *
     * @param {KnockoutObservableArray<Structural>} tree
     */
    /**
     * Copyright © 2013-2017 Magento, Inc. All rights reserved.
     * See COPYING.txt for license details.
     */
    function renderTree(tree) {
        var temp = (0, _jquery2.default)('<div>');
        return new Promise(function (resolve, reject) {
            _engine2.default.waitForFinishRender().then(function () {
                temp.find('[data-bind]').each(function (index, value) {
                    (0, _jquery2.default)(value).removeAttr('data-bind');
                });
                temp.contents().filter(function () {
                    return this.nodeType == 8;
                }).remove();
                temp.find('*').each(function (index, value) {
                    (0, _jquery2.default)(value).contents().filter(function () {
                        return this.nodeType == 8;
                    }).remove();
                });
                // Strip all is wrapper elements
                temp.find('[data-is-wrapper]').each(function (index, element) {
                    (0, _jquery2.default)(element).parent().append((0, _jquery2.default)(element).children());
                    (0, _jquery2.default)(element).remove();
                });
                var content = temp.html();
                content = content.replace(/\r?\n|\r/g, '');
                console.log('renderTree completed', content);
                resolve(temp.html());
                temp.remove();
            });
            console.log('renderTree started');
            _knockout2.default.applyBindingsToNode(temp[0], {
                template: {
                    name: rootTemplate,
                    data: { getChildren: function getChildren() {
                            return tree;
                        } }
                }
            });
        });
    }
});