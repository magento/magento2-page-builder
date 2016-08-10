/**
 * - Stage.js
 * Handles building the stage and events
 *
 * @author Dave Macaulay <dave@gene.co.uk>
 */
define([
    'ko',
    'bluefoot/hook',
    'bluefoot/config',
    'bluefoot/modal',
    'uiClass'
], function (ko, Hook, Config, Modal, UiClass) {

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
        console.log(this);
        this.stageContent.push({name: 'FROM STAGE'});
        console.log(this.stageContent());
    };

    return Stage;
});