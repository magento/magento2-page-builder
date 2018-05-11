/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {AllowedContainersGenerator} from "../../interactions/allowed-containers.d";
import {getAllContainers} from "../../interactions/sortable";

export default class AllowedContainers implements AllowedContainersGenerator {
    /**
     * Set the column container to be allowed within other containers
     *
     * @param {string[]} allowedContainers
     */
    public generate(allowedContainers: string[]): string[] {
        allowedContainers = allowedContainers.concat(getAllContainers());
        return allowedContainers.filter((container: string) => container !== "column");
    }
}
