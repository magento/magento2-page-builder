/**
 * - Abstract.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
], function (ko) {

    /**
     *
     * @constructor
     */
    function Abstract() {
        this.options = [];
        this.data = {};
        this.children = ko.observableArray([]);
    }

    Abstract.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/abstract.html'
    };

    Abstract.prototype.getChildTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/children.html'
    };

    return Abstract;
});