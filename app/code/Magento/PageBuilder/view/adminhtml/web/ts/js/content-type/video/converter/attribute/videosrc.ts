/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ConverterInterface from "../../../../converter/converter-interface";
import {DataObject} from "../../../../data-store";
import {get} from "../../../../utils/object";

export default class VideoSrc implements ConverterInterface {

    /**
     * Parse YouTube parameters from given URL and Autoplay setting from UI
     *
     * @param url string
     * @param data DataObject
     * @returns string
     * @private
     */
    private static parseYoutubeGetParams(url: string, data: DataObject): string {
        const acceptableYouTubeParams = [
            "rel",
            "controls",
            "autoplay",
            "mute",
            "loop",
            "playlist",
            "cc_lang_pref",
            "cc_load_policy",
            "color",
            "disablekb",
            "end",
            "fs",
            "hl",
            "iv_load_policy",
            "modestbranding",
            "start",
        ];

        const a = document.createElement("a");
        a.href = url;
        const urlGetParams: {[key: string]: string} = {};
        a.search.slice(a.search.indexOf("?") + 1).split("&").map((hash) => {
            const [key, val] = hash.split("=");
            urlGetParams[key] = decodeURIComponent(val);
        });

        const filteredGetParams: {[key: string]: string} = {};
        for (const param of acceptableYouTubeParams) {
            if (urlGetParams.hasOwnProperty(param)) {
                filteredGetParams[param] = urlGetParams[param];
            }
        }

        if (data.autoplay === "true") {
            filteredGetParams.autoplay = "1";
            filteredGetParams.mute = "1";
        } else {
            delete filteredGetParams.autoplay;
            delete filteredGetParams.mute;
        }

        const processedGetParams = [];
        for (const param in filteredGetParams) {
            if (filteredGetParams.hasOwnProperty(param)) {
                processedGetParams.push(encodeURI(param + "=" + filteredGetParams[param]));
            }
        }

        return processedGetParams.length > 0 ? "?" + processedGetParams.join("&") : "";
    }

    /**
     * Convert value to internal format
     *
     * @param value string
     * @returns {string | object}
     */
    public fromDom(value: string): string | object {
        value = value.replace(/\?autoplay=1&mute=1/g, "");
        value = value.replace(/&autoplay=1&mute=1/g, "");
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
        const youtubeNoCookieRegExp = new RegExp("^(?:https?:\/\/|\/\/)?(?:www\\.|m\\.)?" +
            "(?:youtube-nocookie\\.com\/(?:embed\/|v\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])");
        const vimeoRegExp = new RegExp("https?:\/\/(?:www\\.|player\\.)?vimeo.com\/(?:channels\/" +
            "(?:\\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\\d+)\/video\/|video\/|)(\\d+)(?:$|\/|\\?)");

        if (youtubeRegExp.test(value)) {
            return "https://www.youtube.com/embed/" + youtubeRegExp.exec(value)[1] +
                VideoSrc.parseYoutubeGetParams(value, data);
        } else if (youtubeNoCookieRegExp.test(value)) {
            return "https://www.youtube-nocookie.com/embed/" + youtubeNoCookieRegExp.exec(value)[1] +
                VideoSrc.parseYoutubeGetParams(value, data);
        } else if (vimeoRegExp.test(value)) {
            return "https://player.vimeo.com/video/" + vimeoRegExp.exec(value)[3] +
                "?title=0&byline=0&portrait=0" + (data.autoplay === "true" ? "&autoplay=1&autopause=0&muted=1" : "");
        }

        return value;
    }
}
