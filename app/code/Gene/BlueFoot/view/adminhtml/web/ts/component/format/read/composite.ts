/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
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
     * @returns {DataObject | Promise<any>}
     */
    read (element: HTMLElement): DataObject | Promise<any> {
        let result: DataObject = {};
        if (this.contentTypeConfig.hasOwnProperty(element.dataset.role)) {
            let readPromise = new Promise(function(resolve: Function, reject: Function) {
                require(this.contentTypeConfig[element.dataset.role]['readers'], function (...args: any[]) {
                    resolve(args)
                }, reject);
            }.bind(this));
            return readPromise.then(function(readersArray: Array<any>) {
                for (let i = 0; i < readersArray.length; i++) {
                    let reader = new readersArray[i].default();
                    _.extend(result, reader.read(element));
                }
                return result;
            }).catch(function(e: PromiseRejectionEvent) {

            });
        }
        return result;
    }
}
