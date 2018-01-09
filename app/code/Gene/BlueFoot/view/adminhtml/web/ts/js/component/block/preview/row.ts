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

        this.getChildren = ko.computed(() => {
            let groupedChildren:any = [];
            let columnGroup:any = [];

            Object.keys(parent.children()).map(
                (key: string) => {
                    let children:any = parent.children()[key];

                    if ( (children.constructor.name === 'Column') ) {
                        columnGroup.push(children);
                    } else {
                        if (columnGroup.length > 0) {
                            groupedChildren.push(columnGroup);
                            groupedChildren.push(children);
                            columnGroup = [];
                        } else {
                             groupedChildren.push(children);
                        }
                    }
                    console.log(groupedChildren);
                }
            );

            if (columnGroup.length > 0) {
                groupedChildren.push(columnGroup);
            }

            return groupedChildren;
        });

        // ko.bindingHandlers.wrapColumns = {
        //     init: function(elem, valueAccessor) {
        //
        //         console.log(parent.children());
        //
        //         // Get name of child and render if columns
        //         Object.getOwnPropertyNames(parent.children()).forEach(
        //             function (val, index, array) {
        //                 if ( (parent.children()[val].constructor.name === 'Column') ) {
        //                     this.isColumn = true;
        //                 } else {
        //                     this.isColumn = false;
        //                 }
        //             }
        //         );
        //         // Let bindings proceed as normal *only if* my value is false
        //         // var shouldAllowBindings = ko.unwrap(valueAccessor());
        //         // return { controlsDescendantBindings: !shouldAllowBindings };
        //     }
        // }
    }
}
