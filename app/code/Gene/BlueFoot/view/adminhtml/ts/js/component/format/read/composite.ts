/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import loadComponent from 'Gene_BlueFoot/js/component/loader';
import Config from "../../config";
import ReadInterface from "../read-interface";
import {DataObject} from "../../data-store";

export default class AttributeReaderComposite implements ReadInterface {
    // Configuration for content types
    private contentTypeConfig: any;

    constructor() {
        this.contentTypeConfig = Config.getInitConfig('contentTypes');
    }

    /**
     * Read data from the element
     *
     * @param element
     * @returns {Promise<any>}
     */
    read (element: HTMLElement): Promise<any> {
        let result: DataObject = {};
        return new Promise((resolve: Function, reject: Function) => {
            const role = element.dataset.role;
            if (!this.contentTypeConfig.hasOwnProperty(role)) {
                resolve(result);
            } else {
                try {
                    loadComponent(this.contentTypeConfig[role]['readers'], (...readers: any[]) => {
                        let readerPromises: Array<Promise<any>> = [];
                        for (let i = 0; i < readers.length; i++) {
                            let reader = new readers[i].default();
                            readerPromises.push(reader.read(element));
                        }
                        Promise.all(readerPromises).then(readersData => {
                            readersData.forEach((data) => {
                                _.extend(result, data);
                            });
                            console.log(result);
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
