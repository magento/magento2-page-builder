/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import Config from "../../../config";

export class ColumnBuilder {
    public position: KnockoutObservable<string> = ko.observable("");
    public sizes: KnockoutObservableArray<object> = ko.observableArray([]);
    public template: string = "Gene_BlueFoot/component/stage/structural/column/builder.html";
    public visible: KnockoutObservable<boolean> = ko.observable(false);

    /**
     * ColumnBuilder constructor
     */
    constructor() {
        const columnOptions = Config.getInitConfig("column_definitions");

        for (const columnOption of columnOptions) {
            if (columnOption.displayed === true) {
                this.sizes.push({
                    className: columnOption.className,
                    label: columnOption.label,
                });
            }
        }
    }

    /**
     * Show the builder from the column options scope
     */
    public showFromOption() {
        this.position("top");
        this.visible(true);
    }

    /**
     * Change the visibility to visible
     */
    public show() {
        this.visible(true);
    }

    /**
     * Change the visibility to hidden
     */
    public hide() {
        this.visible(false);
    }

    /**
     * Proxy to the correct parent"s add column function
     */
    public addColumn(parents: any, data: any) {
        // Nest a column (within a column or on a row)
        if (this.position() === "top") {
            parents[1].addColumn(data);
        } else {
            // Add to left or right side of current column
            parents[1].insertColumnAtIndex(this.position(), parents[1], data);
        }
    }
}
