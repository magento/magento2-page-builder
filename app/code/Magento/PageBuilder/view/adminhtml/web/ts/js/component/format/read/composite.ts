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
        this.contentTypeConfig = Config.getInitConfig("contentTypes");
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
                try {
                    loadComponent(this.contentTypeConfig[role].readers, (...readers: any[]) => {
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
