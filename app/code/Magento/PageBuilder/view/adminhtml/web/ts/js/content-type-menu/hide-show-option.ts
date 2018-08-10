/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import $t from "mage/translate";
import {DataObject} from "../data-store";
import Option from "./option";
import OptionConfigInterface from "./option-config";
import OptionInterface from "./option.d";

export default class HideShowOption extends Option implements OptionInterface {

    public static SHOW_TEXT = $t("Show");
    public static SHOW_ICON = "<i class='icon-pagebuilder-show'></i>";

    public static HIDE_TEXT = $t("Hide");
    public static HIDE_ICON = "<i class='icon-pagebuilder-hide'></i>";

    /**
     * @param {OptionConfigInterface} options
     */
    constructor(
        options: OptionConfigInterface,
    ) {
        super(options);

        // Modify the icon when changes are made to display in the data store
        this.preview.parent.dataStore.subscribe(
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
            this.icon(HideShowOption.HIDE_ICON);
            this.title(HideShowOption.HIDE_TEXT);
        } else {
            this.icon(HideShowOption.SHOW_ICON);
            this.title(HideShowOption.SHOW_TEXT);
        }
    }
}
