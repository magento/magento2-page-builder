/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";
import _ from 'underscore';
import {DataObject} from "../../data-store";

interface ImageObject {
    name: string;
    size: number;
    type: string;
    url: string;
}

export default class Image implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let response: DataObject = {
            'image': this.generateImageObject(element.querySelector('img:nth-child(1)').getAttribute('src')),
            'mobile_image': "",
            'alt': element.querySelector('img:nth-child(1)').getAttribute('alt'),
            'title_tag': element.querySelector('a').getAttribute('title'),
            'lightbox': (!!element.querySelector('a.bluefoot-lightbox')) ? "Yes" : "No",
            'show_caption': (!!element.querySelector('figcaption')) ? "Yes" : "No"
        };

        // Detect if there is a mobile image and update the response
        if (element.querySelector('img:nth-child(2)')) {
            response['mobile_image'] = this.generateImageObject(element.querySelector('img:nth-child(2)').getAttribute('src'));
        }

        return Promise.resolve(response);
    }

    /**
     * Generate the image object
     *
     * @param {string} src
     * @returns {ImageObject}
     */
    private generateImageObject(src: string): string | Array<ImageObject> {
        // Match the URL & type from the directive
        const [, url, type] = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.exec(decodeURIComponent(src));

        return [
            {
                "name": url.split('/').pop(),
                "size": 0,
                "type": "image/" + type,
                "url": Config.getInitConfig('media_url') + url
            }
        ];
    }
}
