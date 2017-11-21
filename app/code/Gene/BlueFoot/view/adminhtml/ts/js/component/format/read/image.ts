/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ReadInterface from "../read-interface";
import Config from "../../../component/config";

export default class Image implements ReadInterface {
    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<any> {
        let mainImageUrl = decodeURIComponent(element.children[0].children[0].getAttribute('src')).split('media url=').pop();
            mainImageUrl = mainImageUrl.substring(0, mainImageUrl.length - 2);
        let mainImageObj = {
            "name": mainImageUrl.split('/').pop(),
            "size": 0,
            "type": "image/" + mainImageUrl.split('.').pop(),
            "url": Config.getInitConfig('media_url') + mainImageUrl
        };
        let mobileImageUrl = decodeURIComponent(element.children[0].children[1].getAttribute('src')).split('media url=').pop();
        mobileImageUrl = mobileImageUrl.substring(0, mobileImageUrl.length - 2);
        let mobileImageObj = {
            "name": mobileImageUrl.split('/').pop(),
            "size": 0,
            "type": "image/" + mobileImageUrl.split('.').pop(),
            "url": Config.getInitConfig('media_url') + mobileImageUrl
        };
        return new Promise((resolve: Function) => {
            resolve(
                {
                    'image' : [mainImageObj],
                    'mobile_image' : [mobileImageObj],
                    'alt' : element.children[0].children[0].getAttribute('alt'),
                    'title_tag' : element.children[0].children[0].getAttribute('title'),
                    'lightbox' : (element.children[0].getAttribute('class') == 'bluefoot-lightbox') ? "Yes" : "No",
                    'show_caption': (element.children[1].getInnerText() != "") ? "Yes" : "No"
                }
            );
        });
    }
}
