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
import _ from "underscore";

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
        const {field, placeholder, selectAll = false} = valueAccessor();
        let focusedValue = element.innerHTML;
        let previouslyFocused: boolean = false;
        let blurTimeout: number;

        /**
         * Strip HTML and return text
         *
         * @param {string} html
         * @returns {string}
         */
        const stripHtml = (html: string) => {
            const tempDiv = document.createElement("div");

            tempDiv.innerHTML = html;
            return tempDiv.textContent;
        };

        /**
         * Record the value on focus, only conduct an update when data changes
         */
        const onFocus = () => {
            clearTimeout(blurTimeout);
            focusedValue = stripHtml(element.innerHTML);

            if (selectAll && element.innerHTML !== "" && !previouslyFocused) {
                _.defer(() => {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    previouslyFocused = true;
                });
            }
        };

        /**
         * On blur change our timeout for previously focused. We require a flag to track whether the input has been
         * focused and selected previously due to a bug in Firefox which doesn't handle focus events correctly when
         * contenteditable is placed within an anchor.
         */
        const onBlur = () => {
            blurTimeout = setTimeout(() => {
                previouslyFocused = false;
            }, 100);
        };

        /**
         * Mousedown event on element
         *
         * @param {Event} event
         */
        const onMouseDown = (event: Event) => {
            event.stopPropagation();
        };

        /**
         * Key down event on element
         *
         * Prevent styling such as bold, italic, and underline using keyboard commands, and prevent multi-line entries
         *
         * @param {JQueryEventObject} event
         */
        const onKeyDown = (event: JQueryEventObject) => {
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
         * On key up update the view model to ensure all changes are saved
         */
        const onKeyUp = () => {
            if (focusedValue !== stripHtml(element.innerHTML)) {
                viewModel.updateData(field, stripHtml(element.innerHTML));
            }
        };

        /**
         * Prevent content from being dropped inside of inline edit area
         *
         * @param {DragEvent} event
         */
        const onDrop = (event: DragEvent) => {
            event.preventDefault();
        };

        /**
         * Input event on element
         */
        const onInput = () => {
            handlePlaceholderClass(element);
        };

        element.setAttribute("data-placeholder", placeholder);
        element.textContent = viewModel.parent.dataStore.get(field);
        element.contentEditable = true;
        element.addEventListener("focus", onFocus);
        element.addEventListener("blur", onBlur);
        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("keydown", onKeyDown);
        element.addEventListener("keyup", onKeyUp);
        element.addEventListener("input", onInput);
        element.addEventListener("drop", onDrop);

        $(element).parent().css("cursor", "text");
        handlePlaceholderClass(element);

        // Create a subscription onto the original data to update the internal value
        viewModel.parent.dataStore.subscribe(() => {
            element.textContent = viewModel.parent.dataStore.get(field);
            handlePlaceholderClass(element);
        }, field);

        // Resolve issues of content editable being within an anchor
        if ($(element).parent().is("a")) {
            $(element).parent().attr("draggable", "false");
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
        const {field} = valueAccessor();

        element.textContent = viewModel.parent.dataStore.get(field);
        handlePlaceholderClass(element);
    },
};
