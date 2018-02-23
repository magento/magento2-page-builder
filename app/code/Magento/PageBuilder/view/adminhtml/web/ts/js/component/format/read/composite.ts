/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadComponent from "Magento_PageBuilder/js/component/loader";
import _ from "underscore";
import Config, {ConfigContentBlocks} from "../../config";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

export default class AttributeReaderComposite implements ReadInterface {
    // Configuration for content types
    private contentTypeConfig: ConfigContentBlocks;

    constructor() {
        this.contentTypeConfig = Config.getInitConfig("content_types");
    }

    /**
     * Read data from the element
     *
     * @param element
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const result: DataObject = {};
        return new Promise((resolve: (result: object) => void, reject: (e: string) => void) => {
            const role = element.dataset.role;
            if (!this.contentTypeConfig.hasOwnProperty(role)) {
                resolve(result);
            } else {
                const contentTypeConfig = this.contentTypeConfig[role];
                try {
                    let readerComponents = contentTypeConfig.readers;
                    if (typeof element.dataset.appearance !== "undefined"
                        && typeof contentTypeConfig.appearances !== "undefined"
                        && typeof contentTypeConfig.appearances[element.dataset.appearance] !== "undefined"
                        && typeof contentTypeConfig.appearances[element.dataset.appearance].readers !== "undefined"
                    ) {
                        readerComponents = contentTypeConfig.appearances[element.dataset.appearance].readers;
                    }
                    loadComponent(readerComponents, (...readers: any[]) => {
                        const readerPromises: Array<Promise<any>> = [];
                        for (const Reader of readers) {
                            const reader = new Reader();
                            readerPromises.push(reader.read(element));
                        }
                        Promise.all(readerPromises).then((readersData) => {
                            readersData.forEach((data) => {
                                _.extend(result, data);
                            });
                            resolve(result);
                        }).catch((error) => {
                            console.error( error );
                        });
                    });
                } catch (e) {
                    reject(e);
                }
            }
        });
    }
}
