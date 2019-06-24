/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import RenderContentType from "./content-type";

export default class RenderViewModel {
    public data: {} = {};
    public contentType: RenderContentType;
    public template: string;
    public masterTemplate: string = "Magento_PageBuilder/content-type/master-collection";

    constructor(template: string, data: {}) {
        this.template = template;
        this.data = this.convertDataToObservables(data);
    }

    /**
     * Convert the flat object into observables for render
     *
     * @param generatedData
     */
    private convertDataToObservables(generatedData: {[key: string]: any}) {
        const convertedData: any = {};
        for (const element in generatedData) {
            convertedData[element] = {};
            Object.keys(generatedData[element]).forEach((key) => {
                convertedData[element][key] = ko.observable(generatedData[element][key]);
            });
        }
        return convertedData;
    }
}
