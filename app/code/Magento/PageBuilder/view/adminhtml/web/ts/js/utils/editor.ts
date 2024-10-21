/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import "mage/adminhtml/tools";
import $t from "mage/translate";
import mageUtils from "mageUtils";
import {Editor} from "tinymce";
import Config from "../config";

/**
 * Is the inline WYSIWYG supported?
 */
export function isWysiwygSupported() {
    return Config.getConfig("can_use_inline_editing_on_stage");
}

/**
 * Encode content for TinyMCE
 *
 * @param content
 */
export function encodeContent(content: string) {
    if (isWysiwygSupported()) {
        return convertVariablesToHtmlPreview(
            convertWidgetsToHtmlPreview(
                unescapeDoubleQuoteWithinWidgetDirective(
                    removeInvalidPlaceholders(content),
                ),
            ),
        );
    }

    return content;
}

/**
 * Prior to parsing the content remove any invalid placeholders within the content
 *
 * @param content
 */
function removeInvalidPlaceholders(content: string) {
    if (content.indexOf("magento-placeholder") !== -1) {
        const html = new DOMParser().parseFromString(content, "text/html");
        const placeholders = html.querySelectorAll("span.magento-placeholder");
        if (placeholders.length > 0) {
            [].slice.call(placeholders).forEach((placeholder: HTMLSpanElement) => {
                // If the invalid placeholder contains a directive, let's insert it back where it belongs
                if (placeholder.innerText.indexOf("{{") !== -1) {
                    placeholder.parentNode.insertBefore(document.createTextNode(placeholder.innerText), placeholder);
                }
                placeholder.remove();
            });
        }
        return html.body.innerHTML;
    }

    return content;
}

/**
 * Convert all variables to their HTML preview counterparts
 *
 * Re-implements logic from lib/web/mage/adminhtml/wysiwyg/tiny_mce/plugins/magentovariable/editor_plugin.js to parse
 * and replace the variables within the content.
 *
 * @param content
 */
function convertVariablesToHtmlPreview(content: string) {
    const config = Config.getConfig("tinymce").variables;
    const magentoVariables = JSON.parse(config.placeholders);

    return content.replace(/{\{\s?(?:customVar code=|config path=\")([^\}\"]+)[\"]?\s?\}\}/ig, (match, path) => {
        const id = btoa(path).replace(/\+/g, ":").replace(/\//g, "_").replace(/=/g, "-");
        const placeholder = $("<span />")
            .addClass("magento-variable")
            .addClass("magento-placeholder")
            .addClass("mceNonEditable")
            .prop("id", id)
            .prop("contentEditable", "false");

        if (magentoVariables[path].variable_type === "custom") {
            placeholder.addClass("magento-custom-var");
        }

        const variableType = magentoVariables[path].variable_type;

        if (magentoVariables[path] && (variableType === "default" || variableType === "custom")) {
            placeholder.text(magentoVariables[path].variable_name);
        } else {
            // If we're unable to find the placeholder we need to attach an error class
            placeholder.addClass("magento-placeholder-error");
            placeholder.text((variableType === "custom" ? path : $t("Not Found")));
        }

        return placeholder[0].outerHTML;
    });
}

/**
 * Convert widgets within content to their HTML counterparts
 *
 * @param content
 */
function convertWidgetsToHtmlPreview(content: string) {
    const config = Config.getConfig("tinymce").widgets;

    return content.replace(/\{\{widget([\S\s]*?)\}\}/ig, (match, widgetBody) => {
        const attributes = parseAttributesString(widgetBody);
        let imageSrc;

        if (attributes.type) {
            const placeholder = $("<span />")
                .addClass("magento-placeholder")
                .addClass("magento-widget")
                .addClass("mceNonEditable")
                .prop("id", mageUtils.uniqueid())
                .prop("contentEditable", "false");

            attributes.type = attributes.type.replace(/\\\\/g, "\\");
            imageSrc = config.placeholders[attributes.type];

            if (!imageSrc) {
                imageSrc = config.error_image_url;
                placeholder.addClass("magento-placeholder-error");
            }

            const image = $("<img />")
                .prop("id", window.Base64.idEncode(match))
                .prop("src", imageSrc);

            placeholder.append(image);

            let widgetType = "";
            if (config.types[attributes.type]) {
                widgetType += config.types[attributes.type];
            }

            placeholder.append($(document.createTextNode(widgetType)));

            return placeholder[0].outerHTML;
        }
    });
}

/**
 * Parse attributes into a string
 *
 * @param attributes
 */
export function parseAttributesString(attributes: string): { [key: string]: string; } {
    const result: {
        [key: string]: string;
    } = {};

    attributes.replace(
        /(\w+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
        (match: string, key: string, value: string) => {
            result[key] = value ? value.replace(/&quote;/g, "\"") : value;
            return "";
        },
    );

    return result;
}

/**
 * Lock all image sizes before initializing TinyMCE to avoid content jumps
 *
 * @param element
 */
export function lockImageSize(element: HTMLElement) {
    [].slice.call(element.querySelectorAll("img")).forEach((image: HTMLImageElement) => {
        if (image.style.width.length === 0) {
            image.style.width = /^\d+$/.test(image.getAttribute("width")) ?
                image.getAttribute("width") + "px" :
                image.getAttribute("width");
            image.setAttribute("data-width-locked", "true");
        }
        if (image.style.height.length === 0) {
            image.style.height = /^\d+$/.test(image.getAttribute("height")) ?
                image.getAttribute("height") + "px" :
                image.getAttribute("height");
            image.setAttribute("data-height-locked", "true");
        }
    });
}

/**
 * Reverse forced image size after TinyMCE is finished initializing
 *
 * @param element
 */
export function unlockImageSize(element: HTMLElement) {
    [].slice.call(element.querySelectorAll("img")).forEach((image: HTMLImageElement) => {
        if (image.getAttribute("data-width-locked")) {
            image.style.width = null;
            image.removeAttribute("data-width-locked");
        }
        if (image.getAttribute("data-height-locked")) {
            image.style.height = null;
            image.removeAttribute("data-height-locked");
        }
    });
}

/**
 * Create a bookmark within the content to be restored later
 */
export function createBookmark(event: JQueryEventObject): Bookmark {
    const wrapperElement = $(event.target).parents(".inline-wysiwyg");

    /**
     * Create an element bookmark
     *
     * @param element
     */
    const createElementBookmark = (element: Element) => {
        return {
            name: element.nodeName,
            index: findNodeIndex(
                wrapperElement[0],
                element.nodeName,
                element,
            ),
        };
    };

    // Handle direct clicks onto an IMG
    if (event.target.nodeName === "IMG") {
        return createElementBookmark(event.target);
    }

    if (window.getSelection) {
        const selection = window.getSelection();
        const id = mageUtils.uniqueid();
        if (selection.getRangeAt && selection.rangeCount) {
            const range = normalizeTableCellSelection(selection.getRangeAt(0).cloneRange());

            // Determine if the current node is an image or span that we want to select instead of text
            const currentNode = range.startContainer as HTMLElement;
            if (currentNode.nodeType === Node.ELEMENT_NODE && (currentNode.nodeName === "IMG"
                || (currentNode.nodeName === "SPAN" && currentNode.classList.contains("magento-placeholder")))
            ) {
                return createElementBookmark(currentNode);
            }

            // Also check if the direct parent is either of these
            const parentNode = range.startContainer.parentNode as HTMLElement;
            if (parentNode.nodeName === "IMG"
                || (parentNode.nodeName === "SPAN" && parentNode.classList.contains("magento-placeholder"))
            ) {
                return createElementBookmark(parentNode);
            }

            if (!range.collapsed) {
                range.collapse(false);
                const endBookmarkNode = createBookmarkSpan(id + "_end");
                range.insertNode(endBookmarkNode);
            }

            const range2 = normalizeTableCellSelection(selection.getRangeAt(0));
            range2.collapse(true);
            const startBookmarkNode = createBookmarkSpan(id + "_start");
            range2.insertNode(startBookmarkNode);

            return {id};
        }
    }

    return null;
}

/**
 * Move the cursor to our new bookmark
 *
 * @param bookmark
 */
export function moveToBookmark(bookmark: Bookmark) {
    getActiveEditor().selection.moveToBookmark(bookmark);
    getActiveEditor().nodeChanged();
}

/**
 * Retrieve active editor from TinyMCE
 */
export function getActiveEditor(): Editor {
    return ((window as any).tinymce.activeEditor as Editor);
}

/**
 * Create a bookmark span for the selection
 *
 * @param id
 */
function createBookmarkSpan(id: string) {
    const bookmark = document.createElement("span");
    bookmark.setAttribute("data-mce-type", "bookmark");
    bookmark.id = id;
    bookmark.style.overflow = "hidden";
    bookmark.style.lineHeight = "0px";
    return bookmark;
}

/**
 * Find the index of an element within a wrapper
 *
 * @param wrapperElement
 * @param name
 * @param element
 */
export function findNodeIndex(wrapperElement: HTMLElement, name: string, element: Element) {
    const selector = name.toLowerCase() + ':not([data-mce-bogus="all"])';

    // If there is no ID on the element add a unique ID so we can efficiently find it
    if (!element.id) {
        element.id = mageUtils.uniqueid();
    }

    return $(wrapperElement).find(selector).toArray().findIndex((node) => {
        return node.id === element.id;
    });
}

/**
 * Get a node by index within a wrapper
 *
 * @param wrapperElement
 * @param name
 * @param index
 */
export function getNodeByIndex(wrapperElement: HTMLElement, name: string, index: number): HTMLElement {
    const selector = name.toLowerCase() + ':not([data-mce-bogus="all"])';
    return $(wrapperElement).find(selector).get(index);
}

/**
 * Create a double click event that works in all browsers
 */
export function createDoubleClickEvent(): Event {
    try {
        return new MouseEvent("dblclick", {
            view: window,
            bubbles: true,
            cancelable: true,
        });
    } catch (e) {
        const dblClickEvent = document.createEvent("MouseEvent");
        dblClickEvent.initMouseEvent(
            "dblclick",
            true,
            true,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null,
        );
        return dblClickEvent;
    }
}

/**
 * Replace all desktop styles that left unprocessed back to style element to prevent data corruption.
 */
export function processInlineStyles(html: string) {
    const name = Config.getConfig("defaultViewport");
    const searchPattern =  new RegExp(`data-${name}-style=`, "g");

    return html.replace(searchPattern, "style=");
}

/**
 * Move the end point of a range to handle tables
 *
 * @param range
 * @param start
 */
function moveEndPoint(range: Range, start: boolean) {
    let container;
    let offset;
    let childNodes;

    if (start) {
        container = range.startContainer;
        offset = range.startOffset;
    } else {
        container = range.endContainer;
        offset = range.endOffset;
    }

    if (container.nodeType === Node.ELEMENT_NODE && container.nodeName === "TR") {
        childNodes = container.childNodes;
        container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];
        if (container) {
            offset = start ? 0 : container.childNodes.length;

            if (start) {
                range.setStart(container, offset);
            } else {
                range.setEnd(container, offset);
            }
        }
    }
}

/**
 * Normalize the table sell selection within a range to better handle selections being inside of tables
 *
 * @param range
 */
function normalizeTableCellSelection(range: Range): Range {
    moveEndPoint(range, true);
    moveEndPoint(range, false);

    return range;
}

/**
 * Convert HTML encoded double quote to double quote with backslash within widget directives
 *
 * @param {string} content
 * @returns {string}
 */
export function escapeDoubleQuoteWithinWidgetDirective(content: string): string {
    return content.replace(/\{\{widget[\S\s]*?\}\}/ig,  (match: string) => {
        return match.replace(/&quot;/g, "\\\"");
    });
}

/**
 * Convert double quote with backslash to HTML encoded double quote within widget directives
 *
 * @param {string} content
 * @returns {string}
 */
export function unescapeDoubleQuoteWithinWidgetDirective(content: string): string {
    return content.replace(/\{\{widget[\S\s]*?\}\}/ig,  (match: string) => {
        return match.replace(/\\+"/g, "&quot;");
    });
}

/**
 * Convert double quote to single quote within magento variable directives
 *
 * @param {string} content
 * @returns {string}
 */
export function replaceDoubleQuoteWithSingleQuoteWithinVariableDirective(content: string): string {
    // Find html elements which attributes contain magento variables directives
    return content.replace(
        /<([a-z0-9\-\_]+)([^>]+?[a-z0-9\-\_]+="[^"]*?\{\{.+?\}\}.*?".*?)>/gi,
        (match1: string, tag: string, attributes: string) => {
            // Replace double quote with single quote within magento variable directive
            const sanitizedAttributes = attributes.replace(
                /\{\{[^\{\}]+\}\}/gi,
                (match2: string) => match2.replace(/"/g, "'"),
            );
            return "<" + tag + sanitizedAttributes + ">";
        },
    );
}

/**
 * Remove Page Builder reserved html tag attributes from the content
 *
 * @param {string} content
 * @returns {string}
 */
export function removeReservedHtmlAttributes(content: string): string
{
    const attributes: {[key: string]: string} = Config.getConfig("stage_config").reserved_html_attributes || {};
    for (const attribute of Object.keys(attributes)) {
        content = removeHtmlTagAttribute(content, attribute);
    }
    return content;
}

/**
 * Remove attribute from html tags
 *
 * @param {string} content
 * @param {string} name
 * @returns {string}
 */
function removeHtmlTagAttribute(content: string, name: string): string
{
    if (typeof content === "string" && content.indexOf(`${name}=`) !== -1) {
        const html = new DOMParser().parseFromString(content, "text/html");
        html.querySelectorAll(`[${name}]`).forEach((child: Element) => {
            child.removeAttribute(name);
        });
        content = html.body.innerHTML;
    }
    return content;
}

interface IdBookmark {
    id: string;
    keep?: boolean;
}

interface IndexBookmark {
    name: string;
    index: number;
}

export type Bookmark = IdBookmark | IndexBookmark;
