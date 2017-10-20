/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';

export default class AttributeReaderComposite {
    private readers = {
        'stage': [
            'Gene_BlueFoot/js/component/stage/default'
        ],
        'row': [
            'Gene_BlueFoot/js/component/stage/default'
        ],
        'column': [
            'Gene_BlueFoot/js/component/stage/default'
        ],
        'heading': [
            'Gene_BlueFoot/js/component/stage/default',
            'Gene_BlueFoot/js/component/stage/heading'
        ]
    };

    /**
     * Read data from the element
     *
     * @param element
     * @returns {object}
     */
    read (element: HTMLElement): object {
        if (this.readers.hasOwnProperty(element.dataset.role)) {
            let readPromise = new Promise(function(resolve: Function, reject: Function) {
                require(this.readers[element.dataset.role], function (...args: any[]) {
                    resolve(args)
                }, reject);
            }.bind(this));
            return readPromise.then(function(readersArray: Array<any>) {
                let result = {};
                for (let i = 0; i < readersArray.length; i++) {
                    let reader = new readersArray[i].default();
                    _.extend(result, reader.read(element));
                }
                console.log(result);
                return result;
            }).catch(function(e: PromiseRejectionEvent) {

            });
        }
        return {};
    }
}
