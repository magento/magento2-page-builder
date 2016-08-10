/**
 * - Abstract.js
 * Abstract for the structural blocks (rows & columns)
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
        this.data = ko.observableArray([]);
        this.children = ko.observableArray([]);
    }

    /**
     * Return the template for the element
     *
     * @returns {string}
     */
    Abstract.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/abstract.html'
    };

    /**
     * Return the template for the child elements
     *
     * @returns {string}
     */
    Abstract.prototype.getChildTemplate = function () {
        return 'Gene_BlueFoot/component/core/stage/structural/children.html'
    };

    return Abstract;
});