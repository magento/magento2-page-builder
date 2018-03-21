/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {DataObject} from "../../data-store";
import {ReadInterface} from "../read-interface";
import Default from "./default";

export default class Video implements ReadInterface {
    private defaultReader: Default = new Default();

    /**
     * Read video configuration out of element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        const videoIframeElement = element.querySelector("iframe");
        const iframeAttributesPromise = this.defaultReader.read(videoIframeElement);

        return iframeAttributesPromise.then((iframeAttributes) => {
            iframeAttributes.video_source = iframeAttributes.src || "";
            return iframeAttributes;
        });
    }
}
