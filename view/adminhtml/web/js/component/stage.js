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
    'bluefoot/utils/array',
    'uiRegistry',
    'mageUtils'
], function (ko, _, Save, Row, arrayUtil, registry, utils) {

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
        this.userSelect = parent.userSelect;
        this.loading = parent.loading;

        this.save = new Save(this);
    }

    /**
     * Remove a child from the stageContent array
     *
     * @param child
     */
    Stage.prototype.removeChild = function (child) {
        utils.remove(this.stageContent, child);
    };

    /**
     * Add a child to the current element
     *
     * @param child
     * @param index
     */
    Stage.prototype.addChild = function (child, index) {
        if (index !== undefined && index !== false) {
            // Use the common function to add the item in the correct place within the array
            arrayUtil.moveArrayItemIntoArray(child, this.stageContent, index);
        } else {
            this.stageContent.push(child);
        }
    };

    /**
     * Add a row to the content
     *
     * @param self
     * @param data
     */
    Stage.prototype.addRow = function (self, data) {
        var row = new Row(self, self);
        row.data(data);
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

    /**
     * Open the template manager; passing the stage context through
     */
    Stage.prototype.openTemplateManager = function() {
        registry.get('bluefoot_template_manager.bluefoot_template_manager').openManager(this);
    };

    /**
     * Run the apply function passed from the parent,
     * to add a new sidebar UI component from
     * modules detected in the DOM.
     */
    Stage.prototype.addComponent = function () {
        return this.parent.applyConfigFor.apply(null, arguments);
    };

    return Stage;
});