/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import {ReadInterface} from "../read-interface";
import StyleAttributeMapper from "../style-attribute-mapper";

interface BannerObject {
    background_image?: string;
}

export default class Banner implements ReadInterface {
    private styleAttributeMapper: StyleAttributeMapper = new StyleAttributeMapper();

    /**
     * Read heading type and title from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read(element: HTMLElement): Promise<BannerObject> {
        const response: BannerObject = {background_image: null};
        let background;
        background = element.children[0].style.backgroundImage;
        response.background_image = this.styleAttributeMapper.decodeBackground(background);
        return Promise.resolve(response);
    }
}
