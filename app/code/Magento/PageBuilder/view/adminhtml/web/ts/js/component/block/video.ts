/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";

export default class Video extends Block {

    /**
     * Get video attributes with correct src
     *
     * @returns {DataObject}
     */
    public getVideoAttributes() {
        const data = this.getData();
        return {
            height: data.height || null,
            src: this.getVideoUrl(data.video_source),
            width: data.width || null,
        };
    }

    /**
     * Change video src to correct format
     *
     * @param {any} url
     * @returns {any}
     */
    public getVideoUrl(url: any) {
        const youtubeRegExp = new RegExp("^(?:https?:\/\/|\/\/)?(?:www\\.|m\\.)?" +
                "(?:youtu\\.be\/|youtube\\.com\/(?:embed\/|v\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])");
        const vimeoRegExp = new RegExp("https?:\/\/(?:www\\.|player\\.)?vimeo.com\/(?:channels\/" +
                "(?:\\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\\d+)\/video\/|video\/|)(\\d+)(?:$|\/|\\?)");

        if (youtubeRegExp.test(url)) {
            return "https://www.youtube.com/embed/" + youtubeRegExp.exec(url)[1];
        } else if (vimeoRegExp.test(url)) {
            return "https://player.vimeo.com/video/" + vimeoRegExp.exec(url)[3] + "?title=0&byline=0&portrait=0";
        }

        return url;
    }
}
