import $ from "jquery";
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
        return convertVariablesToHtmlPreview(convertWidgetsToHtmlPreview(content));
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
export function convertVariablesToHtmlPreview(content: string) {
    const config = Config.getConfig("tinymce").variables;
    const magentoVariables = JSON.parse(config.placeholders);

    return content.replace(/{\{\s?(?:customVar code=|config path=\")([^\}\"]+)[\"]?\s?\}\}/ig, (match, path) => {
        const placeholder = document.createElement("span");
        placeholder.id = btoa(path).replace(/\+/g, ":").replace(/\//g, "_").replace(/=/g, "-");
        placeholder.classList.add("magento-variable", "magento-placeholder", "mceNonEditable");
        if (magentoVariables[path].variable_type === "custom") {
            placeholder.classList.add("magento-custom-var");
        }

        const variableType = magentoVariables[path].variable_type;

        if (magentoVariables[path] && (variableType === "default" || variableType === "custom")) {
            placeholder.textContent = magentoVariables[path].variable_name;
        } else {
            // If we're unable to find the placeholder we need to attach an error class
            placeholder.classList.add("magento-placeholder-error");
            placeholder.textContent = (variableType === "custom" ? path : "Not Found");
        }

        return placeholder.outerHTML;
    });
}

/**
 * Convert widgets within content to their HTML counterparts
 *
 * @param content
 */
export function convertWidgetsToHtmlPreview(content: string) {
    const config = Config.getConfig("tinymce").widgets;
    return content.replace(/\{\{widget(.*?)\}\}/ig, (match, widgetBody) => {
        const attributes = parseAttributesString(widgetBody);
        let imageSrc;

        if (attributes.type) {
            const placeholder = document.createElement("span");
            placeholder.id = mageUtils.uniqueid();
            placeholder.contentEditable = "false";
            placeholder.classList.add("magento-placeholder", "magento-widget", "mceNonEditable");

            attributes.type = attributes.type.replace(/\\\\/g, "\\");
            imageSrc = config.placeholders[attributes.type];

            if (!imageSrc) {
                imageSrc = config.error_image_url;
                placeholder.classList.add("magento-placeholder-error");
            }

            const image = document.createElement("img");
            image.id = btoa(match).replace(/\+/g, ":").replace(/\//g, "_").replace(/=/g, "-");
            image.src = imageSrc;
            placeholder.append(image);

            let widgetType = "";
            if (config.types[attributes.type]) {
                widgetType += config.types[attributes.type];
            }

            const text = document.createTextNode(widgetType);
            placeholder.append(text);

            return placeholder.outerHTML;
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
            result[key] = value.replace(/&quote;/g, "\"");
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
    element.querySelectorAll("img").forEach((image) => {
        image.style.width = `${image.width}px`;
        image.style.height = `${image.height}px`;
    });
}

/**
 * Reverse forced image size after TinyMCE is finished initializing
 *
 * @param element
 */
export function unlockImageSize(element: HTMLElement) {
    element.querySelectorAll("img").forEach((image) => {
        image.style.width = null;
        image.style.height = null;
    });
}

/**
 * Create a bookmark within the content to be restored later
 */
export function createBookmark(event: JQueryEventObject): Bookmark {
    const wrapperElement = $(event.target).parents(".inline-wysiwyg");

    // Handle direct clicks onto an IMG
    if (event.target.nodeName === "IMG") {
        return {
            name: event.target.nodeName,
            index: findNodeIndex(
                wrapperElement[0],
                event.target.nodeName,
                event.target,
            ),
        };
    }

    if (window.getSelection) {
        const selection = window.getSelection();
        const id = mageUtils.uniqueid();
        if (selection.getRangeAt && selection.rangeCount) {
            const range = normalizeTableCellSelection(selection.getRangeAt(0).cloneRange());
            const node = range.startContainer.parentNode as HTMLElement;

            if (node.nodeName === "IMG"
                || (node.nodeName === "SPAN" && node.classList.contains("magento-placeholder"))
            ) {
                return {
                    name: node.nodeName,
                    index: findNodeIndex(
                        wrapperElement[0],
                        node.nodeName,
                        node,
                    ),
                };
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
    ((window as any).tinymce.activeEditor as Editor).selection.moveToBookmark(bookmark);
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

interface IdBookmark {
    id: string;
    keep?: boolean;
}

interface IndexBookmark {
    name: string;
    index: number;
}

export type Bookmark = IdBookmark | IndexBookmark;
