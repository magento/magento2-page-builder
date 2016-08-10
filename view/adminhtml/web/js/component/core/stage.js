/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/stage/structural/row'
], function (ko, Row) {

    /**
     * Stage Class
     *
     * @constructor
     */
    function Stage(parent, stageContent) {
        this.parent = parent;
        this.stageContent = stageContent;
        this.active = true;
    }

    /**
     * Add a row to the content
     */
    Stage.prototype.addRow = function () {
        this.stageContent.push(new Row());
    };

    return Stage;
});