/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import $t from "mage/translate";
import confirmationDialog from "Magento_PageBuilder/js/modal/dismissible-confirm";
import {FieldDefaultsInterface} from "../content-type-factory";
import DataStore, {DataObject} from "../data-store";
import WysiwygInterface from "../wysiwyg/wysiwyg-interface";

/**
 * Validate inline editor for having nested link
 * Creates a dialog and removes inline editor link if present
 *
 * @param {DataStore} dataStore
 * @param {WysiwygInterface} wysiwyg
 * @param {string} inlineMessageField
 * @param {string} linkUrlField
 */
export default function nestingLinkDialog(
    dataStore: DataStore,
    wysiwyg: WysiwygInterface,
    inlineMessageField: string,
    linkUrlField: string,
) {
    const dataStoreContent = dataStore.getState() as DataObject;
    const inlineMessage = dataStoreContent[inlineMessageField] as string;
    const linkUrl = dataStoreContent[linkUrlField] as FieldDefaultsInterface;
    const aLinkRegex = /(<a[\s]+[^>]+).+(?=<\/a>)<\/a>/igm;
    if (wysiwyg &&
        inlineMessage.match(aLinkRegex) &&
        linkUrl &&
        ["page", "product", "category", "default"].indexOf(linkUrl.type) !== -1 &&
        linkUrl[linkUrl.type] &&
        linkUrl[linkUrl.type].length !== 0
    ) {
        const inlineEditor = $("#" + wysiwyg.elementId);
        inlineEditor.trigger("blur");
        confirmationDialog({
            actions: {
                always: () => {
                    const anchorLessDataStoreMessage = inlineMessage.replace(aLinkRegex, "");
                    const anchorLessInlineMessage = inlineEditor.html().replace(aLinkRegex, "");
                    dataStore.set(inlineMessageField, anchorLessDataStoreMessage);
                    inlineEditor.html(anchorLessInlineMessage);
                },
            },
            content: $t("We are unable to support links within the content field whilst having a link set on the content type. Please remove the content type link if you'd like to set a link within the content. We will automatically remove the links within the content field."), // tslint:disable-line:max-line-length
            title: $t("Nested links are not allowed"),
            haveCancelButton: false,
        });
    }
}
