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
 * Validate inline editor for having nested widget
 * Creates a dialog and removes inline editor widget if present
 *
 * @param {DataStore} dataStore
 * @param {WysiwygInterface} wysiwyg
 * @param {string} inlineMessageField
 * @param {string} linkUrlField
 */
export default function nestingWidgetDialog(
    dataStore: DataStore,
    wysiwyg: WysiwygInterface,
    inlineMessageField: string,
    linkUrlField: string,
) {
    const dataStoreContent = dataStore.getState() as DataObject;
    const inlineMessage = dataStoreContent[inlineMessageField] as string;
    const linkUrl = dataStoreContent[linkUrlField] as FieldDefaultsInterface;
    const widgetRegex = /\{\{widget(.*?)\}\}/ig;
    const widgetPlaceholderRegex = /<span.*(class=)(\"|\').*((magento-placeholder).*(magento-widget)|(magento-widget).*(magento-placeholder)).*<\/span>/igm;

    if (wysiwyg &&
        inlineMessage.match(widgetRegex) &&
        linkUrl &&
        ["page", "product", "category", "default"].indexOf(linkUrl.type) !== -1 &&
        linkUrl[linkUrl.type] &&
        linkUrl[linkUrl.type].length !== 0
    ) {
        const inlineEditor = $("#" + wysiwyg.elementId);
        inlineEditor.blur();
        confirmationDialog({
            actions: {
                always: () => {
                    const widgetLessDataStoreMessage = inlineMessage.replace(widgetRegex, "");
                    const widgetLessInlineMessage = inlineEditor.html().replace(widgetPlaceholderRegex, "");
                    dataStore.set(inlineMessageField, widgetLessDataStoreMessage);
                    inlineEditor.html(widgetLessInlineMessage);
                },
            },
            content: $t("We are unable to support widget within the content field whilst having a link set on the content type. Please remove the content type link if you'd like to set a widget within the content. We will automatically remove the widget within the content field."), // tslint:disable-line:max-line-length
            title: $t("Nested widgets are not allowed"),
            haveCancelButton: false,
        });
    }
}
