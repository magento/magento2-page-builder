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
import {DataObject} from "../data-store";

/**
 * Strip HTML and return text
 *
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html: string) {
    if (html) {
        const htmlDocument = new DOMParser().parseFromString(html, "text/html");

        return htmlDocument.body ? htmlDocument.body.textContent : "";
    }

    return html;
}

/**
 * Add or remove the placeholder-text class from the element based on its content
 *
 * @param {Element} element
 */
function handlePlaceholderClass(element: Element) {
    if (stripHtml(element.innerHTML).length === 0) {
        element.innerHTML = "";
        element.classList.add("placeholder-text");
    } else {
        element.classList.remove("placeholder-text");
    }
}

// Custom Knockout binding for live editing text inputs
ko.bindingHandlers.liveEdit = {

    /**
     * Init the live edit binding on an element
     *
     * @param {HTMLElement} element
     * @param {() => any} valueAccessor
     * @param {KnockoutAllBindingsAccessor} allBindings
     * @param {any} viewModel
     * @param {KnockoutBindingContext} bindingContext
     */
    init(element: HTMLElement, valueAccessor, allBindings, viewModel, bindingContext) {
        const {field, placeholder, selectAll = false} = valueAccessor();
        let focusedValue = element.innerHTML;
        let previouslyFocused: boolean = false;
        let blurTimeout: number;
        let lastUpdateValue: string;

        /**
         * Record the value on focus, only conduct an update when data changes
         */
        const onFocus = () => {
            clearTimeout(blurTimeout);
            focusedValue = stripHtml(element.innerHTML);
            lastUpdateValue = focusedValue;

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
            const strippedValue = stripHtml(element.innerHTML);
            if (focusedValue !== strippedValue) {
                lastUpdateValue = strippedValue;
                viewModel.updateData(field, strippedValue);
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
         * Prevent content from being dragged
         *
         * @param {DragEvent} event
         */
        const onDragStart = (event: DragEvent) => {
            event.preventDefault();
        };

        /**
         * Input event on element
         */
        const onInput = () => {
            handlePlaceholderClass(element);
        };

        /**
         * On paste strip any HTML
         */
        const onPaste = () => {
            // Record the original caret position so we can ensure we restore it at the correct position
            const selection = window.getSelection();
            const originalPositionStart = selection.getRangeAt(0).cloneRange().startOffset;
            const originalPositionEnd = selection.getRangeAt(0).cloneRange().endOffset;
            const originalContentLength = stripHtml(element.innerHTML).length;
            // Allow the paste action to update the content
            _.defer(() => {
                const strippedValue = stripHtml(element.innerHTML);
                lastUpdateValue = strippedValue;
                element.textContent = strippedValue;
                /**
                 * Calculate the position the caret should end up at, the difference in string length + the original
                 * end offset position
                 */
                let restoredPosition = Math.abs(strippedValue.length - originalContentLength) + originalPositionStart;
                // If part of the text was selected adjust the position for the removed text
                if (originalPositionStart !== originalPositionEnd) {
                    restoredPosition += Math.abs(originalPositionEnd - originalPositionStart);
                }
                const range = document.createRange();
                range.setStart(element.childNodes[0], restoredPosition);
                range.setEnd(element.childNodes[0], restoredPosition);
                selection.removeAllRanges();
                selection.addRange(range);
            });
        };

        element.setAttribute("data-placeholder", placeholder);
        element.textContent = viewModel.contentType.dataStore.get(field);
        element.contentEditable = "true";
        element.addEventListener("focus", onFocus);
        element.addEventListener("blur", onBlur);
        element.addEventListener("mousedown", onMouseDown);
        element.addEventListener("keydown", onKeyDown);
        element.addEventListener("keyup", onKeyUp);
        element.addEventListener("input", onInput);
        element.addEventListener("drop", onDrop);
        element.addEventListener("paste", onPaste);
        element.addEventListener("dragstart", onDragStart);

        $(element).parent().css("cursor", "text");
        handlePlaceholderClass(element);

        // Create a subscription onto the original data to update the internal value
        viewModel.contentType.dataStore.subscribe((data: DataObject) => {
            // Only update the value if it differs from the last value added within live edit
            if (lastUpdateValue !== data[field]) {
                lastUpdateValue = data[field];
                element.textContent = data[field];
                handlePlaceholderClass(element);
            }
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

        element.textContent = viewModel.contentType.dataStore.get(field);
        handlePlaceholderClass(element);
    },
};
