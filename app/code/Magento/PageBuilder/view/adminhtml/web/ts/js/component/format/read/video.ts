/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";

export default class Video implements ReadInterface {

    /**
     * Read video configuration out of element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const videoIframeElement = element.querySelector("iframe");
        const response: DataObject = {
            video_height: videoIframeElement.height || null,
            video_source: videoIframeElement.src || "",
            video_width: videoIframeElement.width || null,
        };

        return Promise.resolve(response);
    }
}
