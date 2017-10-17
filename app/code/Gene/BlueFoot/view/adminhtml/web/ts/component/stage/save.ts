/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from 'knockout';

export default class Save {
    rootTemplate: string = 'Gene_BlueFoot/component/stage/structural/render/root.html';
    textarea;

    constructor(stageContent, textarea) {
        this.textarea = textarea;
        stageContent.subscribe(this.updateContent.bind(this));
    }

    /**
     * Update textarea with rendered content
     *
     * @param data
     */
    updateContent(data) {
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
