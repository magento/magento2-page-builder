define(['exports', 'knockout', 'Magento_Ui/js/lib/knockout/template/engine'], function (exports, _knockout, engine) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _knockout2 = _interopRequireDefault(_knockout);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Save = function () {
        function Save(stageContent, textarea) {
            _classCallCheck(this, Save);

            this.rootTemplate = 'Gene_BlueFoot/component/stage/structural/render/root.html';
            this.textarea = textarea;
            stageContent.subscribe(this.updateContent.bind(this));
        }
        /**
         * Update textarea with rendered content
         *
         * @param data
         */


        Save.prototype.updateContent = function updateContent(data) {
            var temp = jQuery('<div>');
            _knockout2.default.applyBindingsToNode(temp[0], {
                template: {
                    name: this.rootTemplate,
                    data: { data: data }
                }
            });

            engine.waitForFinishRender().then(function () {
                console.log(temp.html());
                this.textarea(temp.html());
                temp.remove();
            }.bind(this));
        };

        return Save;
    }();

    exports.default = Save;
});