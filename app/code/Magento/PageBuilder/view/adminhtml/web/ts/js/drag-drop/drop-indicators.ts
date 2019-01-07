/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import {createStyleSheet} from "../utils/create-stylesheet";
import {getContainersFor} from "./matrix";

let headDropIndicatorStyles: HTMLStyleElement;

/**
 * Show the drop indicators for a specific content type
 *
 * We do this by creating a style sheet and injecting it into the head. It's dramatically quicker to allow the browsers
 * CSS engine to display these for us than manually iterating through the DOM and applying a class to the elements.
 *
 * @param {string} contentType
 * @param {string} stageId
 * @returns {HTMLStyleElement}
 */
export function showDropIndicators(contentType: string, stageId: string) {
    const acceptedContainers = getContainersFor(contentType);
    if (acceptedContainers.length > 0) {
        const classNames = acceptedContainers.map((container: string) => {
            return `#${stageId} .content-type-container.${container}-container > .pagebuilder-drop-indicator, ` +
                `#${stageId} .pagebuilder-content-type.type-container.empty-container > .content-type-container.` +
                `${container}-container:before`;
        });
        const styles = createStyleSheet({
            [classNames.join(", ")]: {
                opacity: 1,
                visibility: "visible",
            },
        });
        document.head.appendChild(styles);
        headDropIndicatorStyles = styles;
        return styles;
    }
}

/**
 * Hide the drop indicators
 */
export function hideDropIndicators() {
    if (headDropIndicatorStyles) {
        headDropIndicatorStyles.remove();
        headDropIndicatorStyles = null;
    }
}
