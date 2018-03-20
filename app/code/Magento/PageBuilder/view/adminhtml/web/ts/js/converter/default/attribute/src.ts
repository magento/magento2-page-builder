/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../component/config";
import {toDataUrl} from "../../../utils/directives";
import {decodeUrl} from "../../../utils/image";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../../utils/url";
import ElementConverterInterface from "../../element-converter-interface";

export default class Src implements ElementConverterInterface {
    /**
     * @param {string} value
     * @returns {Object | string}
     */
    public fromDom(value: string): string | object {
        return decodeUrl(value);
    }

    /**
     * @param {string} name
     * @param {Object} data
     * @returns {Object | string}
     */
    public toDom(name: string, data: object): string | object {
        const value = data[name];
        if (value[0] === undefined || value[0].url === undefined) {
            return null;
        }
        const imageUrl = value[0].url;
        const mediaUrl = convertUrlToPathIfOtherUrlIsOnlyAPath(Config.getInitConfig("media_url"), imageUrl);

        const mediaPath = imageUrl.split(mediaUrl);
        return "{{media url=" + mediaPath[1] + "}}";
    }
}
