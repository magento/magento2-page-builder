define(['exports', 'knockout', 'Magento_Ui/js/lib/knockout/template/engine'], function (exports, _knockout, _engine) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = renderTree;

    var _knockout2 = _interopRequireDefault(_knockout);

    var _engine2 = _interopRequireDefault(_engine);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    // The root template for the render tree
    /**
     * Copyright © 2013-2017 Magento, Inc. All rights reserved.
     * See COPYING.txt for license details.
     */
    var rootTemplate = 'Gene_BlueFoot/component/stage/structural/render/root.html';
    /**
     * Render the tree into a string
     *
     * @param {KnockoutObservableArray<Structural>} tree
     */
    function renderTree(tree) {
        var temp = jQuery('<div>');
        return new Promise(function (resolve, reject) {
            _engine2.default.waitForFinishRender().then(function () {
                console.log('renderTree completed', temp.html());
                resolve(temp.html());
                temp.remove();
            });
            console.log('renderTree started');
            _knockout2.default.applyBindingsToNode(temp[0], {
                template: {
                    name: rootTemplate,
                    data: { data: tree }
                }
            });
        });
    }
});