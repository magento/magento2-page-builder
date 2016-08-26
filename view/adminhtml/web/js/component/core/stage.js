/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'underscore',
    'bluefoot/stage/save',
    'bluefoot/stage/structural/row',
    'bluefoot/common'
], function (ko, _, Save, Row, Common) {

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
        this.showBorders = parent.showBorders;

        this.save = new Save(this);
    }

    /**
     * Remove a child from the stageContent array
     *
     * @param child
     */
    Stage.prototype.removeChild = function (child) {
        this.stageContent(ko.utils.arrayFilter(this.stageContent(), function (filterChild) {
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
     * Add a child to the current element
     *
     * @param child
     * @param index
     */
    Stage.prototype.addChild = function (child, index) {
        if (index !== undefined) {
            // Use the common function to add the item in the correct place within the array
            Common.moveArrayItemIntoArray(child, this.stageContent, index);
        } else {
            this.stageContent.push(child);
        }
    };

    /**
     * Add a row to the content
     *
     * @param self
     */
    Stage.prototype.addRow = function (self) {
        var row = new Row(self, self);
        this.addChild(row);

        return row;
    };

    /**
     * Convert to JSON for saving
     *
     * @returns {*}
     */
    Stage.prototype.toJSON = function () {
        var children = [];
        if (this.stageContent()) {
            _.forEach(this.stageContent(), function (child) {
                children.push(child.toJSON());
            });
            return children;
        }

        return {};
    };

    return Stage;
});