/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import events from "uiEvents";
import _ from "underscore";
import ContentTypeInterface from "../content-type";
import ContentTypeAfterRenderEventParamsInterface from "../content-type/content-type-after-render-event-params";

/**
 * Animation time in ms for container animations
 *
 * @type {number}
 */
export const animationTime = 350;

/**
 * Lock the containers min height to it's current height, not allowing the height to change when the content does
 *
 * @param {JQuery} element
 * @returns {boolean}
 */
export function lockContainerHeight(element: JQuery): boolean {
    if (element[0].style.minHeight === "") {
        element.css({
            minHeight: element.height(),
            transition: `min-height ${animationTime}ms ease-in-out`,
        });
        return true;
    }
    return false;
}

/**
 * Animate the containers height to it's actual height
 *
 * @param {boolean} containerLocked
 * @param {ContentType} block
 * @param {JQuery} element
 */
export function bindAfterRenderForAnimation(
    containerLocked: boolean,
    block: ContentTypeInterface,
    element: JQuery,
) {
    if (containerLocked) {
        // Wait for mount then animate the container
        const ns = block.id + ".afterRender.container.animate";
        events.on("contentType:renderAfter", (args: ContentTypeAfterRenderEventParamsInterface) => {
            if (args.contentType.parent === block.parent) {
                animateContainerHeight(true, element);
                events.off(ns);
            }
        }, ns);
    } else if (element[0] && element[0].style.transition !== "") {
        element.css({minHeight: "", transition: ""});
    }
}

/**
 * Animate the container height to the new value
 *
 * @param {boolean} containerLocked
 * @param {JQuery} element
 */
export function animateContainerHeight(containerLocked: boolean, element: JQuery) {
    if (containerLocked) {
        _.defer(() => {
            element.css({
                minHeight: getContainerActualHeight(element),
            });

            // Remove the properties after a delay longer than the animation time
            _.delay(() => {
                element.css({minHeight: "", transition: ""});
                cleanupClones();
            }, animationTime + 150);
        });
    } else if (element[0] && element[0].style.transition !== "") {
        element.css({minHeight: "", transition: ""});
        cleanupClones();
    }
}

/**
 * Make a clone of the container and remove the forced min height to determine it's actual height
 *
 * @param {JQuery} element
 * @returns {number}
 */
function getContainerActualHeight(element: JQuery): number {
    const clone = element.clone().css({
        minHeight: "",
        position: "absolute",
        left: "-99999px",
    }).addClass("container-height-clone");
    element.parent().append(clone);
    const height = clone.height();
    clone.remove();
    return height;
}

/**
 * Clean up any left over clone elements
 */
function cleanupClones() {
    if ($(".container-height-clone").length) {
        $(".container-height-clone").remove();
    }
}
