/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * @api
 */
import $ from "jquery";
import ko from "knockout";
import keyCodes from "Magento_Ui/js/lib/key-codes";

/**
 * Add or remove the placeholder-text class from the element based on its content
 *
 * @param {Element} element
 */
function handlePlaceholderClass(element: Element) {
    if (element.innerHTML.length === 0) {
        $(element).addClass("placeholder-text");
    } else {
        $(element).removeClass("placeholder-text");
    }
}

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
        const {field, placeholder, isSupportingHtml, isMultiline, preventSelectingAllOnClick} = valueAccessor();
        let focusedValue = element.innerHTML;

        /**
         * Get updated html based on options passed to binding
         * @param {String} html
         * @returns {String}
         */
        const updateHtml = (html: string) => {
            return isSupportingHtml ? html : stripHtml(html);
        };

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
         * Record the value on focus, only conduct an update when data changes
         */
        const onFocus = () => {
            focusedValue = updateHtml(element.innerHTML);
        };

        /**
         * Blur event on element
         */
        const onBlur = () => {
            if (focusedValue !== updateHtml(element.innerHTML)) {
                viewModel.updateData(field, updateHtml(element.innerHTML));
            }
        };

        /**
         * Click event on element
         */
        const onClick = () => {
            if (element.innerHTML !== "" && !preventSelectingAllOnClick) {
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
            if (key === "enterKey" && !isMultiline) {
                event.preventDefault();
            }
            // prevent slides from sliding
            if (key === "pageLeftKey" || key === "pageRightKey") {
                event.stopPropagation();
            }
        };

        /**
         * Input event on element
         */
        const onInput = () => {
            handlePlaceholderClass(element);
        };
        element.setAttribute("data-placeholder", placeholder);
        element.innerText = viewModel.previewData[field]();
        element.contentEditable = true;
        element.addEventListener("focus", onFocus);
        element.addEventListener("blur", onBlur);
        element.addEventListener("click", onClick);
        element.addEventListener("keydown", onKeyDown);
        element.addEventListener("input", onInput);

        $(element).parent().css("cursor", "text");
        handlePlaceholderClass(element);

        // Create a subscription onto the original data to update the internal value
        viewModel.previewData[field].subscribe((value: string) => {
            element.innerText = viewModel.previewData[field]();
            handlePlaceholderClass(element);
        });
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
        const {field} = valueAccessor();

        element.innerText = viewModel.previewData[field]();
        handlePlaceholderClass(element);
    },
};
