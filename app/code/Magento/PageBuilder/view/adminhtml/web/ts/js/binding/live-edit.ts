/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import $t from "mage/translate";

// Custom Knockout binding for live editing text inputs
ko.bindingHandlers.liveEdit = {

    /**
     * Init the live edit binding on an element
     *
     * @param {any} element
     * @param {any} valueAccessor
     * @param {any} allBindings
     * @param {any} viewModel
     * @param {any} bindingContext
     */
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        const contentTypeInstance = bindingContext.$data;
        const data = contentTypeInstance.stage.store.get(contentTypeInstance.id);
        const value = valueAccessor();

        const stripHtml = (html: string) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            return tempDiv.innerText;
        };

        /**
         * Blur event on element
         */
        const onBlur = () => {
            if (value.field in data) {
                data[value.field] = stripHtml(element.innerText);
                contentTypeInstance.stage.store.update(contentTypeInstance.id, data);
            }
        };

        /**
         * Click event on element
         */
        const onClick = () => {
            if (element.innerText !== "") {
                document.execCommand("selectAll", false, null);
            }
        };

        /**
         * Key down event on element
         *
         * @param {any} event
         */
        const onKeyDown = (event: any) => {
            // command or control
            if (event.metaKey || event.ctrlKey) {
                // b, i, or u
                if (event.which === 66 || event.which === 73 || event.which === 85) {
                    event.preventDefault();
                }
            }
        };

        /**
         * Key up event on element
         */
        const onKeyUp = () => {
            if (element.innerText === "") {
                $(element).addClass("placeholder-text");
            } else {
                $(element).removeClass("placeholder-text");
            }
        };
        element.contentEditable = true;
        element.addEventListener("blur", onBlur);
        element.addEventListener("click", onClick);
        element.addEventListener("keydown", onKeyDown);
        element.addEventListener("keyup", onKeyUp);

        $(element).parent().css("cursor", "text");
        setTimeout( () => {
            if (element.innerText === "") {
                $(element).addClass("placeholder-text");
            }
        }, 10);
    },

    /**
     * Preprocess live edit binding on an element
     *
     * Use data-placeholder for elements that
     * don't support the placeholder attribute
     *
     * @param {string} value '{"field":"button_text","placeholder_text":"Edit Button Text"}'
     * @param {string} name "liveEdit"
     * @param {any} addBindingCallback
     */
    preprocess(value, name, addBindingCallback) {
        const parsed = JSON.parse(value);
        if ("field" in parsed) {
            const textValue = "preview.data." + parsed.field + "()";
            addBindingCallback("text", textValue);
        }
        if ("placeholder_text" in parsed) {
            const placeholderText = $t(parsed.placeholder_text);
            const attrValue = "{'data-placeholder':'" + placeholderText + "'}";
            addBindingCallback("attr", attrValue);
        }
        return value;
    },
};
