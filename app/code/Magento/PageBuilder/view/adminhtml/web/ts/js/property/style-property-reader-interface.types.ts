/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
interface StylePropertyReaderInterface {
    /**
     * Read style data from element
     *
     * @param element
     * @param source
     * @param styles
     */
    read(element: HTMLElement, source: string, styles: CSSStyleDeclaration[]): string | object;
}

export default StylePropertyReaderInterface;
