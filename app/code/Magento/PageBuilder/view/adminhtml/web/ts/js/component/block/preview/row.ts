/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import _ from "underscore";
import PreviewBlock from "./block";
import Block from "../block"
import StyleAttributeMapper from "../../format/style-attribute-mapper";
import StyleAttributeFilter from "../../format/style-attribute-filter";

export default class Row extends PreviewBlock {
    rowStyles: KnockoutComputed<{}>;
    getChildren: KnockoutComputed<{}>;
    wrapClass: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * @param {Block} parent
     * @param {Object} config
     */
    constructor(parent: Block, config: object) {
        super(parent, config);
        const styleAttributeMapper = new StyleAttributeMapper();
        const styleAttributeFilter = new StyleAttributeFilter();

        this.rowStyles = ko.computed(() => {
            // Extract data values our of observable functions
            let styles = styleAttributeMapper.toDom(
                styleAttributeFilter.filter(
                    _.mapObject(this.data, (value) => {
                        if (ko.isObservable(value)) {
                            return value();
                        }
                        return value;
                    })
                )
            );

            // The style attribute mapper converts images to directives, override it to include the correct URL
            if (this.data.background_image && typeof this.data.background_image()[0] === 'object') {
                styles['backgroundImage'] = 'url(' + this.data.background_image()[0].url + ')';
            }

            return styles;
        });

        // Force the rowStyles to update on changes to stored style attribute data
        Object.keys(styleAttributeFilter.allowedAttributes).forEach((key) => {
            if (ko.isObservable(this.data[key])) {
                this.data[key].subscribe(() => {
                    this.rowStyles.notifySubscribers();
                });
            }
        });
    }
}
