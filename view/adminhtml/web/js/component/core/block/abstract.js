/**
 * - Abstract.js
 * Abstract class for all content / page builder blocks that are added to the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/abstract',
    'mage/translate'
], function (ko, AbstractStructural, $t) {

    /**
     * Class for entity blocks being included on the page
     *
     * @param parent
     * @param stage
     * @param config
     * @constructor
     */
    function AbstractBlock(parent, stage, config) {
        AbstractStructural.call(this, parent, stage);

        this.config = config;
    }
    AbstractBlock.prototype = Object.create(AbstractStructural.prototype);
    var $super = AbstractStructural.prototype;

    /**
     * Return the template for the element
     *
     * @returns {string}
     */
    AbstractBlock.prototype.getTemplate = function () {
        return 'Gene_BlueFoot/component/core/block/abstract.html'
    };

    return AbstractBlock;
});