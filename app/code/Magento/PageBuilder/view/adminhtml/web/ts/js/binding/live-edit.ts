/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import ko from "knockout";
import keyCodes from "Magento_Ui/js/lib/key-codes";

// Custom Knockout binding for live editing text inputs
ko.bindingHandlers.liveEdit = {

    /**
     * Init the live edit binding on an element
     *
     * @param {any} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindings
     * @param {any} viewModel
     * @param {KnockoutBindingContext} bindingContext
     */
    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        const {value, placeholder} = valueAccessor();

        /**
         * Strip HTML and return text
         *
         * @param {string} html
         * @returns {string}
         */
        const stripHtml = (html: string) => {
            const tempDiv = document.createElement("div");

            tempDiv.innerHTML = html;
            return tempDiv.innerText;
        };

        /**
         * Blur event on element
         */
        const onBlur = () => {
            value(stripHtml(element.innerText));
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
         * Prevent styling such as bold, italic, and underline using keyboard commands
         * Prevent multi-line entries
         *
         * @param {any} event
         */
        const onKeyDown = (event: any) => {
            const key = keyCodes[event.keyCode];

            // command or control
            if (event.metaKey || event.ctrlKey) {
                if (key === "bKey" || key === "iKey" || key === "uKey") {
                    event.preventDefault();
                }
            }
            if (key === "enterKey") {
                event.preventDefault();
            }
            // prevent slides from sliding
            if (key === "pageLeftKey" || key === "pageRightKey") {
                event.stopPropagation();
            }
        };

        /**
         * Key up event on element
         */
        const onKeyUp = () => {
            if (element.innerText.length === 0) {
                $(element).addClass("placeholder-text");
            } else {
                $(element).removeClass("placeholder-text");
            }
        };
        element.setAttribute("data-placeholder", placeholder);
        element.innerText = value();
        element.contentEditable = true;
        element.addEventListener("blur", onBlur);
        element.addEventListener("click", onClick);
        element.addEventListener("keydown", onKeyDown);
        element.addEventListener("keyup", onKeyUp);

        $(element).parent().css("cursor", "text");
        if (element.innerText.length === 0) {
            $(element).addClass("placeholder-text");
        }
    },

    /**
     * Update live edit binding on an element
     *
     * @param {any} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindings
     * @param {any} viewModel
     * @param {KnockoutBindingContext} bindingContext
     */

    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        const {value} = valueAccessor();

        element.innerText = value();
        if (element.innerText.length === 0) {
            $(element).addClass("placeholder-text");
        } else {
            $(element).removeClass("placeholder-text");
        }
    },
};
