/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import requireJs from 'require';
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
        return new Promise((resolve: Function) => {
            const role = element.dataset.role;
            if (!this.contentTypeConfig.hasOwnProperty(role)) {
                resolve({});
            } else {
                let result: DataObject = {};
                const readPromise = new Promise((resolve: Function, reject: Function) => {
                    try {
                        requireJs(this.contentTypeConfig[role]['readers'], (...readers: any[]) => {
                            resolve(readers);
                        });
                    } catch (e) {
                        reject(e);
                    }
                });
                return readPromise.then((readers: Array<any>) => {
                    for (let i = 0; i < readers.length; i++) {
                        let reader = new readers[i].default();
                        _.extend(result, reader.read(element));
                    }
                    resolve(result);
                }).catch(function(e: PromiseRejectionEvent) {
                    console.error('Error reading data from the element.');
                });
            }
        });
    }
}
