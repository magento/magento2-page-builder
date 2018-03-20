/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default class Margins {
    /**
     * @param {HTMLElement} element
     * @returns {string | Object}
     */
    public read(element: HTMLElement): string | object {
        return {
            margin: {
                left: element.style.marginLeft.replace("px", ""),
                top: element.style.marginTop.replace("px", ""),
                right: element.style.marginRight.replace("px", ""),
                bottom: element.style.marginBottom.replace("px", ""),
            },
        };
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {string | Object}
     */
    public write(name: string, data: object): string | object {
        if (data[name].margin === undefined) {
            return {};
        }
        return {
            marginLeft: data[name].margin.left + "px",
            marginTop: data[name].margin.top + "px",
            marginRight: data[name].margin.right + "px",
            marginBottom: data[name].margin.bottom + "px",
        }
    }
}
