/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Block from "../block";
import PreviewBlock from "./block";

export default class Row extends PreviewBlock {
    public rowStyles: KnockoutComputed<{}>;
    public rowClasses: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        this.rowStyles = ko.computed(() => {
            const data = this.data;
            const backgroundImage = data.background_image && typeof data.background_image()[0] === "object" ?
                "url(" + data.background_image()[0].url + ")" : "";
            let margin;
            let padding;
            if (data.margins_and_padding && typeof data.margins_and_padding() === "object" ) {
                const m = data.margins_and_padding().margin;
                const p = data.margins_and_padding().padding;
                margin = `${m.top}px ${m.right}px ${m.bottom}px ${m.left}px`;
                padding = `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`;
            } else {
                margin = "";
                padding = "";
            }
            return {
                backgroundAttachment: data.background_attachment(),
                backgroundColor: data.background_color(),
                backgroundImage,
                backgroundPosition: data.background_position(),
                backgroundRepeat: data.background_repeat(),
                backgroundSize: data.background_size(),
                border: data.border(),
                borderColor: data.border_color(),
                borderRadius: `${data.border_radius()}px`,
                borderWidth: `${data.border_width()}px`,
                color: data.color(),
                margin,
                padding,
                textAlign: data.text_align(),
            };
        });
        this.rowClasses = ko.computed(() => {
            return this.data.css_classes();
        });
    }
}
