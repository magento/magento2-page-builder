/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadModule from "Magento_PageBuilder/js/loader";
import {AllowedContainersGenerator} from "./allowed-containers.d";

/**
 * Create an allowed container generator instance
 *
 * @param {string} path
 * @returns {Promise<AllowedContainersGenerator>}
 */
export function createAllowedContainersGenerator(path: string) {
    return new Promise((resolve: (allowedContainer: any) => void) => {
        loadModule([path], (allowedContainer: any) => {
            resolve(new allowedContainer());
        });
    });
}
