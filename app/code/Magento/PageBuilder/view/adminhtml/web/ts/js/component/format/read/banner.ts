/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../component/config";
import {DataObject} from "../../data-store";
import ReadInterface from "../read-interface";

interface ImageObject {
    name: string;
    size: number;
    type: string;
    url: string;
}

export default class Banner implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        // console.log('read/banner.ts');
        // console.log(element);
        debugger;
        const target = element.querySelector("a").getAttribute("target");
        const response: DataObject = {
            background_size: element.style.backgroundSize,
            button_text: element.dataset.buttonText,
            image: this.generateImageObject(element.querySelector('.pagebuilder-banner-image').getAttribute('style').split(';')[0]),
            link_url: element.querySelector("a").getAttribute("href"),
            message: element.querySelector('.pagebuilder-poster-content div').innerHTML,
            minimum_height: element.querySelector('.pagebuilder-banner-wrapper').style.minHeight.split('px')[0],
            mobile_image: element.querySelector('.pagebuilder-banner-mobile') ? this.generateImageObject(element.querySelector('.pagebuilder-banner-mobile').getAttribute('style').split(';')[0]) : "",
            open_in_new_tab: target && target === "_blank" ? "1" : "0",
            overlay_color: element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor === "transparent" ? "" : this.convertRgbaToHex(element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor),
            overlay_transparency: element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor === "transparent" ? "0" : this.extractAlphaFromRgba(element.querySelector('.pagebuilder-poster-overlay').style.backgroundColor),
            show_button: element.querySelector(".pagebuilder-banner-show-button") ? "on_hover" : "always",
            show_overlay: element.querySelector(".pagebuilder-banner-show-overlay-hover") ? "on_hover" : this.getShowOverlay(element.querySelector(".pagebuilder-banner-show-overlay"))
        };
        return Promise.resolve(response);
    }

    /**
     * Get show overlay setting
     *
     * @returns string
     */
    private getShowOverlay(value: string) {
        return value === "always" || "never_show";
    }

    /**
     * Convert RGBA to HEX for content overlay color
     *
     * @returns string
     */
    private convertRgbaToHex(value: string) {
        const r = parseInt(value.match(/\d+/g)[0]).toString(16);
        const g = parseInt(value.match(/\d+/g)[1]).toString(16);
        const b = parseInt(value.match(/\d+/g)[2]).toString(16);
        return "#" + r + g + b;
    }

    /**
     * Extract the Alpha component from RGBA for overlay transparency
     *
     * @returns int
     */
    private extractAlphaFromRgba(value: string) {
        const a = parseFloat(value.match(/\d+/g)[3] + "." + value.match(/\d+/g)[4]);
        return a * 100;
    }

    /**
     * Convert decimal to percent for transparent overlay for the element
     *
     * @param {string} value
     * @returns {string}
     */
    private convertDecimalToPercent(value: string) {
        return (parseInt(value, 10) * 100).toString();
    }

    /**
     * Fetch the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */
    private generateImageObject(src: string): string | ImageObject[] {
        // Match the URL & type from the directive
        if (/{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.test(decodeURIComponent(src))) {
            const [, url, type] = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(decodeURIComponent(src));

            return [
                {
                    name: url.split("/").pop(),
                    size: 0,
                    type: "image/" + type,
                    url: Config.getInitConfig("media_url") + url,
                },
            ];
        }

        return "";
    }
}
