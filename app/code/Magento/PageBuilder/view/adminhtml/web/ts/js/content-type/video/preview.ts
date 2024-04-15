/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import HideShowOption from "../../content-type-menu/hide-show-option";
import {OptionsInterface} from "../../content-type-menu/option.types";
import BasePreview from "../preview";

/**
 * @api
 */
export default class Preview extends BasePreview {

    /**
     * Return an array of options
     *
     * @returns {OptionsInterface}
     */
    public retrieveOptions(): OptionsInterface {
        const options = super.retrieveOptions();

        options.hideShow = new HideShowOption({
            preview: this,
            icon: HideShowOption.showIcon,
            title: HideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40,
        });

        return options;
    }

    public isHosted(src: string): boolean {
        const youtubeRegExp = new RegExp("^(?:https?:\/\/|\/\/)?(?:www\\.|m\\.)?" +
            "(?:youtu\\.be\/|(?:youtube\\.com\/|youtube-nocookie\\.com\/)(?:embed\/|v\/|watch\\?v=|watch\\?.+&v=))" +
            "([\\w-]{11})(?![\\w-])");
        const vimeoRegExp = new RegExp("https?:\/\/(?:www\\.|player\\.)?vimeo.com\/(?:channels\/" +
            "(?:\\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\\d+)\/video\/|video\/|)(\\d+)(?:$|\/|\\?)");
        return (vimeoRegExp.test(src) || youtubeRegExp.test(src));
    }

    /**
     * After render callback
     *
     * @param {HTMLVideoElement} videoElement
     * @param {Preview} self
     */
    public onAfterRender(videoElement: HTMLVideoElement, self: Preview) {
        // Assign muted attribute explicitly due to API issues
        videoElement.muted = self.data.video.attributes().autoplay;
    }
}
