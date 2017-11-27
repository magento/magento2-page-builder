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

export default class Driver implements ReadInterface {

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let target = element.querySelector('a').getAttribute('target'),
            response: DataObject = {
            'image': this.generateImageObject(element.querySelector('img:nth-child(1)').getAttribute('src')),
            'mobile_image': "",
            'alt': element.querySelector('img:nth-child(1)').getAttribute('alt'),
            'title_tag': element.querySelector('a').getAttribute('title'),
            'link_text': element.querySelector('a>div') === null ? "" : element.querySelector('a>div').innerHTML,
            'link_url': element.querySelector('a').getAttribute('href'),
            'open_in_new_window': target && target == '_blank' ? "1" : "0"
        };

        // Detect if there is a mobile image and update the response
        if (element.querySelector('img:nth-child(2)') && element.querySelector('img:nth-child(2)').getAttribute('src')) {
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
        if (/{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/.test(decodeURIComponent(src))) {
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

        return "";
    }
}
