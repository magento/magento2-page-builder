/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ElementConverterInterface from "../../element-converter-interface";
import Config from "../../../component/config";
import {decodeUrl} from "../../../utils/image";
import {toDataUrl} from "../../../utils/directives";
import {convertUrlToPathIfOtherUrlIsOnlyAPath} from "../../../utils/url";

export default class BackgroundImage implements ElementConverterInterface {

    public fromDom(value: string, key: string, data: object): string | object {
        return decodeUrl(value);
    }

    public toDom(value: string, key: string, data: object): string | object {
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