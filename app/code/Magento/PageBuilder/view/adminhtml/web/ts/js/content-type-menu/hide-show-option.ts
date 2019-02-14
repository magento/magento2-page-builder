/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $t from "mage/translate";
import {DataObject} from "../data-store";
import Option from "./option";
import OptionInterface, {OptionConfigInterface} from "./option.types";

export default class HideShowOption extends Option implements OptionInterface {

    public static showText = $t("Show");
    public static showIcon = "<i class='icon-pagebuilder-show'></i>";

    public static hideText = $t("Hide");
    public static hideIcon = "<i class='icon-pagebuilder-hide'></i>";

    /**
     * @param {OptionConfigInterface} options
     */
    constructor(
        options: OptionConfigInterface,
    ) {
        super(options);

        // Modify the icon when changes are made to display in the data store
        this.preview.contentType.dataStore.subscribe(
            this.onDisplayChange.bind(this),
            "display",
        );
    }

    /**
     * On display change update the title and icon
     *
     * @param {DataObject} state
     */
    private onDisplayChange(state: DataObject) {
        const display: boolean = !!state.display;
        if (display) {
            this.icon(HideShowOption.hideIcon);
            this.title(HideShowOption.hideText);
        } else {
            this.icon(HideShowOption.showIcon);
            this.title(HideShowOption.showText);
        }
    }
}
