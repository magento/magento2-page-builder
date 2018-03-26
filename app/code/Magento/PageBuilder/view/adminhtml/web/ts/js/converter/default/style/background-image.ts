/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../../../component/config";
import {toDataUrl} from "../../../utils/directives";
import {decodeUrl} from "../../../utils/image";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../../utils/url";
import ElementConverterInterface from "../../element-converter-interface";

export default class BackgroundImage implements ElementConverterInterface {
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
     * @param name string
     * @param data Object
     * @returns {string | object}
     */
    public toDom(name: string, data: object): string | object {
        const value = data[name];
        if (value[0] === undefined || value[0].url === undefined) {
            return null;
        }
        const imageUrl = value[0].url;
        const mediaUrl = convertUrlToPathIfOtherUrlIsOnlyAPath(Config.getInitConfig("media_url"), imageUrl);

        const mediaPath = imageUrl.split(mediaUrl);
        const directive = "{{media url=" + mediaPath[1] + "}}";
        return "url(\'" + toDataUrl(directive) + "\')";
    }
}
