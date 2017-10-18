/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import ko from 'knockout';
import EditableArea from "./structural/editable-area";
import Structural from "./structural/abstract";

export default class Save {
    rootTemplate: string = 'Gene_BlueFoot/component/stage/structural/render/root.html';
    textarea: KnockoutObservable<string>;

    /**
     * Save constructor
     *
     * @param {KnockoutObservableArray<EditableArea>} stageContent
     * @param {KnockoutObservable<string>} textarea
     */
    constructor(stageContent: KnockoutObservableArray<Structural>, textarea: KnockoutObservable<string>) {
        this.textarea = textarea;
        stageContent.subscribe(this.updateContent.bind(this));
    }

    /**
     * Update textarea with rendered content
     *
     * @param data
     */
    updateContent(data: any) {
        let temp = jQuery('<div>');
        ko.applyBindingsToNode(
            temp[0],
            {
                template: {
                    name: this.rootTemplate,
                    data: { data: data }
                }
            }
        );
        let engine = require('Magento_Ui/js/lib/knockout/template/engine');
        engine.waitForFinishRender().then(function() {
            console.log(temp.html());
            this.textarea(temp.html());
            temp.remove();
        }.bind(this));
    }
}
