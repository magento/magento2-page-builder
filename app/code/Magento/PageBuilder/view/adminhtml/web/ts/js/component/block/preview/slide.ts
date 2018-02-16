/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import ko from "knockout";
import {ConfigContentBlock} from "../../config";
import Block from "../block";
import PreviewBlock from "./block";

export default class Slide extends PreviewBlock {
    private backgroundImageStyle: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {ConfigContentBlock} config
     */
    constructor(parent: Block, config: ConfigContentBlock) {
        super(parent, config);

        this.backgroundImageStyle = ko.computed(() => {
            if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
                return {backgroundImage: "url(" + this.data.background_image()[0].url + ")"};
            }
            return {};
        });
    }
}
