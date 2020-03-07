/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {get} from "../../../../utils/object";

export default class VideoSrc implements ConverterInterface {
    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        value = value.replace(/\?autoplay=1&mute=1/g, "");
        value = value.replace(/\?title=0&byline=0&portrait=0/g, "");
        value = value.replace(/&autoplay=1&autopause=0&muted=1/g, "");
        return value;
    }

    /**
     * Convert value to knockout format
     *
     * @param name string
     * @param data Object
     * @returns {string}
     */
    public toDom(name: string, data: DataObject): string {
        const value = get<string>(data, name);
        if (value === undefined) {
            return "";
        }

        const youtubeRegExp = new RegExp("^(?:https?:\/\/|\/\/)?(?:www\\.|m\\.)?" +
            "(?:youtu\\.be\/|youtube\\.com\/(?:embed\/|v\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])");
        const vimeoRegExp = new RegExp("https?:\/\/(?:www\\.|player\\.)?vimeo.com\/(?:channels\/" +
            "(?:\\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\\d+)\/video\/|video\/|)(\\d+)(?:$|\/|\\?)");

        if (youtubeRegExp.test(value)) {
            return "https://www.youtube.com/embed/" + youtubeRegExp.exec(value)[1] +
                (data.autoplay === "true" ? "?autoplay=1&mute=1" : "");
        } else if (vimeoRegExp.test(value)) {
            return "https://player.vimeo.com/video/" + vimeoRegExp.exec(value)[3] +
                "?title=0&byline=0&portrait=0" + (data.autoplay === "true" ? "&autoplay=1&autopause=0&muted=1" : "");
        }

        return value;
    }
}
