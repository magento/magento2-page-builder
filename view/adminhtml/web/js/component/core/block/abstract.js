/**
 * - Abstract.js
 * Abstract class for all content / page builder blocks that are added to the stage
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/abstract',
    'mage/translate',
], function (ko, AbstractStructural, $t) {

    /**
     * Class for entity blocks being included on the page
     *
     * @param parent
     * @param stage
     * @constructor
     */
    function AbstractBlock(parent, stage) {
        AbstractStructural.call(this, parent, stage);
    }
    AbstractBlock.prototype = Object.create(AbstractStructural.prototype);
    var $super = AbstractStructural.prototype;

    return AbstractBlock;
});