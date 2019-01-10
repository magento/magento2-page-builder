/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import $t from "mage/translate";
import confirmationDialog from "Magento_PageBuilder/js/modal/dismissible-confirm";
import DataStore, {DataObject} from "../data-store";
import FieldDefaultsInterface from "../field-defaults";
import WysiwygInterface from "../wysiwyg/wysiwyg-interface";

/**
 * Validate inline editor for having nested link
 * Creates a dialog and removes inline editor link if present
 *
 * @param {DataObject} dataStore
 * @param {WysiwygInterface} wysiwyg
 * @param {string} inlineMessageField
 * @param {string} linkUrlField
 */
export default function nestingLinkDialog(
    dataStore: DataStore,
    wysiwyg: WysiwygInterface,
    inlineMessageField: string,
    linkUrlField: string) {
    const dataStoreContent = dataStore.get() as DataObject;
    const inlineMessage = dataStoreContent[inlineMessageField] as string;
    const linkUrl = dataStoreContent[linkUrlField] as FieldDefaultsInterface;
    const aLinkRegex = /<a[\s]+([^>]+)>|<a>|<\/a>/igm;
    if (inlineMessage.match(aLinkRegex) &&
        linkUrl &&
        ["page", "product", "category", "default"].indexOf(linkUrl.type) !== -1 &&
        linkUrl[linkUrl.type] &&
        linkUrl[linkUrl.type].length !== 0) {
        confirmationDialog({
            actions: {
                always: () => {
                    const anchorLessInlineMessage = inlineMessage.replace(aLinkRegex, "");
                    dataStore.update(anchorLessInlineMessage, inlineMessageField);
                    $("#" + wysiwyg.elementId).html(anchorLessInlineMessage);
                },
            },
            content: $t("Adding link in content and outer element is not allowed. Remove the link from the element before adding links to the content."), // tslint:disable-line:max-line-length
            title: $t("Nesting links are not allowed"),
            haveCancelButton: false,
        });
    }
}
