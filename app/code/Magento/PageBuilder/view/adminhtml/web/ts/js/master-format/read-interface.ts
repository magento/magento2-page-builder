/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {BuilderStyles} from "../stage-builder";

/**
 * @api
 */
export interface ReadInterface {
    /**
     * Read data from the element
     *
     * @param element
     * @param styles
     */
    read(element: HTMLElement, styles: BuilderStyles): Promise<any>;
}
