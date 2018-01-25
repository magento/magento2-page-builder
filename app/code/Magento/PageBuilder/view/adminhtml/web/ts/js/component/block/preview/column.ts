/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import StyleAttributeFilter from "../../format/style-attribute-filter";
import StyleAttributeMapper from "../../format/style-attribute-mapper";
import Block from "../block";
import PreviewBlock from "./block";

export default class Column extends PreviewBlock {
    public columnStyles: KnockoutComputed<{}>;

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        const styleAttributeMapper = new StyleAttributeMapper();
        const styleAttributeFilter = new StyleAttributeFilter();

        this.columnStyles = ko.computed(() => {
            // Extract data values our of observable functions
            const styles = styleAttributeMapper.toDom(
                styleAttributeFilter.filter(
                    _.mapObject(this.data, (value) => {
                        if (ko.isObservable(value)) {
                            return value();
                        }
                        return value;
                    }),
                ),
            );

            // The style attribute mapper converts images to directives, override it to include the correct URL
            if (this.data.background_image && typeof this.data.background_image()[0] === "object") {
                styles.backgroundImage = "url(" + this.data.background_image()[0].url + ")";
            }

            return styles;
        });

        // Force the columnStyles to update on changes to stored style attribute data
        Object.keys(styleAttributeFilter.allowedAttributes).forEach((key) => {
            if (ko.isObservable(this.data[key])) {
                this.data[key].subscribe(() => {
                    this.columnStyles.notifySubscribers();
                });
            }
        });
    }
}
