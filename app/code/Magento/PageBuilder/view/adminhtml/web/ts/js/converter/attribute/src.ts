/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../config";
import {decodeUrl} from "../../utils/image";
import {get} from "../../utils/object";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../utils/url";
import ConverterInterface from "../converter-interface";
import ImageArrayObject from "../image-array-object.types";

/**
 * @api
 */
export default class Src implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        if (!value) {
            return "";
        }
        return decodeUrl(value);
    }

    /**
     * Convert value to knockout format
     *
     * @param {string} name
     * @param {DataObject} data
     * @returns {string}
     */
    public toDom(name: string, data: {[key: string]: {[key: number]: {url: string}}}): string {
        const value = get<ImageArrayObject>(data, name);
        if (value[0] === undefined || value[0].url === undefined) {
            return "";
        }
        const imageUrl = value[0].url;
        const mediaUrl = convertUrlToPathIfOtherUrlIsOnlyAPath(Config.getConfig("media_url"), imageUrl);

        const mediaPath = imageUrl.split(mediaUrl);
        return "{{media url=" + mediaPath[1] + "}}";
    }
}
