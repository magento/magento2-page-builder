/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import Appearance from "../../appearance/appearance";
import Block from "../block";
import PreviewBlock from "./block";

export default class Slide extends PreviewBlock {
    private backgroundImageStyle: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {object} config
     * @param {Appearance} appearance
     */
    constructor(parent: Block, config: object, appearance: Appearance) {
        super(parent, config, appearance);

        this.backgroundImageStyle = ko.computed(() => {
            if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
                return {backgroundImage: "url(" + this.data.background_image()[0].url + ")"};
            }
            return {};
        });
    }
}
