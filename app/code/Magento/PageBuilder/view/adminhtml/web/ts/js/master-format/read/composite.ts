/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadComponent from "Magento_PageBuilder/js/utils/loader";
import _ from "underscore";
import Config from "../../config";
import ContentTypeConfigInterface from "../../content-type-config.d";
import appearanceConfig from "../../content-type/appearance-config";
import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

/**
 * @deprecated
 */
export default class AttributeReaderComposite implements ReadInterface {
    // Configuration for content types
    private contentTypeConfig: {[key: string]: ContentTypeConfigInterface};

    constructor() {
        this.contentTypeConfig = Config.getConfig("content_types");
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
                const readerComponents = appearanceConfig(role, element.dataset.appearance).reader ?
                    [appearanceConfig(role, element.dataset.appearance).reader] :
                    appearanceConfig(role, element.dataset.appearance).readers;
                try {
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
                            console.error(error);
                        });
                    });
                } catch (e) {
                    reject(e);
                }
            }
        });
    }
}
