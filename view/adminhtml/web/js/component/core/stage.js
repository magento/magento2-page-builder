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
    function Stage(parent, stageId, stageContent) {
        this.id = stageId;
        this.parent = parent;
        this.stageContent = stageContent;
        this.active = true;
    }

    /**
     * Remove a child from the stageContent array
     *
     * @param child
     */
    Stage.prototype.removeChild = function (child) {
        this.stageContent(ko.utils.arrayFilter(this.stageContent(), function(filterChild) {
            return child.id != filterChild.id;
        }));
        this.refreshChildren();
    };

    /**
     * Refresh children within stage
     */
    Stage.prototype.refreshChildren = function () {
        var data = this.stageContent().slice(0);
        this.stageContent([]);
        this.stageContent(data);
    };

    /**
     * Add a row to the content
     *
     * @param self
     */
    Stage.prototype.addRow = function (self) {
        this.stageContent.push(new Row(self, self));
    };

    return Stage;
});