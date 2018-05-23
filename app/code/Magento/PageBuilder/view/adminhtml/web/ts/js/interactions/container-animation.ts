/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import events from "uiEvents";
import _ from "underscore";
import ContentTypeInterface from "../content-type";
import {ContentTypeMountEventParamsInterface} from "../content-type/content-type-mount-event-params";

/**
 * Animation time in ms for container animations
 *
 * @type {number}
 */
export const animationTime = 350;

/**
 * Lock the containers min height to it's current height, not allowing the height to change when the content does
 *
 * @param {JQuery<Element>} element
 * @returns {boolean}
 */
export function lockContainerHeight(element: JQuery<Element>): boolean {
    element.css({
        minHeight: element.height(),
        transition: `min-height ${animationTime}ms ease-in-out`,
    });
    return true;
}

/**
 * Animate the containers height to it's actual height
 *
 * @param {boolean} containerLocked
 * @param {ContentType} block
 * @param {JQuery<Element>} element
 */
export function bindAfterRenderForAnimation(
    containerLocked: boolean,
    block: ContentTypeInterface,
    element: JQuery<Element>,
) {
    if (containerLocked) {
        // Wait for mount then animate the container
        const ns = block.id + ".afterRender.container.animate";
        events.on("block:afterRender", (args: ContentTypeMountEventParamsInterface) => {
            if (args.block === block) {
                animateContainerHeight(true, element);
                events.off(ns);
            }
        }, ns);
    } else {
        element.css({minHeight: "", transition: ""});
    }
}

/**
 * Animate the container height to the new value
 *
 * @param {boolean} containerLocked
 * @param {JQuery<Element>} element
 */
export function animateContainerHeight(containerLocked: boolean, element: JQuery<Element>) {
    if (containerLocked) {
        _.defer(() => {
            element.css({
                minHeight: getContainerActualHeight(element),
            });

            // Remove the properties after a delay longer than the animation time
            _.delay(() => {
                element.css({minHeight: "", transition: ""});
            }, animationTime + 150);
        });
    } else {
        element.css({minHeight: "", transition: ""});
    }
}

/**
 * Make a clone of the container and remove the forced min height to determine it's actual height
 *
 * @param {JQuery<Element>} element
 * @returns {number}
 */
function getContainerActualHeight(element: JQuery<Element>): number {
    const clone = element.clone().css({
        minHeight: "",
        position: "absolute",
        left: "-99999px",
    });
    element.parent().append(clone);
    const height = clone.height();
    clone.remove();
    return height;
}
