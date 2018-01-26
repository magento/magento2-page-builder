/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import loadComponent from "Magento_PageBuilder/js/component/loader";
import Config from "../../config";
import ReadInterface from "../read-interface";

interface BannerObject {
    background_image?: string;
}

export default class Banner implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<BannerObject> {
        const response: BannerObject = {background_image: null};
        let background;
        background = element.
            children[0].
            style.backgroundImage;
        response.background_image = this.decodeBackground(background);

        return Promise.resolve(response);
    }

    private decodeBackground(value: any): string {
        value = decodeURIComponent((value as string).replace(window.location.href, ""));
        const [, url, type] = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(value);
        const image = {
            name: url.split("/").pop(),
            size: 0,
            type: "image/" + type,
            url: Config.getInitConfig("media_url") + url,
        };
        value = [image];
        return value;
    }
}
