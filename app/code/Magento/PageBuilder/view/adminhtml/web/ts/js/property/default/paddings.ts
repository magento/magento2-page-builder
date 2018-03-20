/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class Paddings {
    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    public read(element: HTMLElement): string | object {
        return {
            padding: {
                left: element.style.paddingLeft.replace("px", ""),
                top: element.style.paddingTop.replace("px", ""),
                right: element.style.paddingRight.replace("px", ""),
                bottom: element.style.paddingBottom.replace("px", ""),
            }
        };
    }

    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    public write(name: string, data: object): string | object {
        if (!data[name] || data[name].padding === undefined) {
            return {};
        }
        return {
            paddingLeft: data[name].padding.left + "px",
            paddingTop: data[name].padding.top + "px",
            paddingRight: data[name].padding.right + "px",
            paddingBottom: data[name].padding.bottom + "px",
        }
    }
}
