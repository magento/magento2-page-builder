import $ from "jquery";
import mageUtils from "mageUtils";
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
        placeholder.id = Base64.idEncode(path);
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
            image.id = Base64.idEncode(match);
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
 * Create a bookmark within the content to be restored later
 */
export function createBookmark(event: JQueryEventObject): Bookmark {
    const wrapperElement = $(event.target).parents(".inline-wysiwyg");

    // Handle direct clicks onto an IMG
    if (event.target.nodeName === "IMG") {
        return {
            name: event.target.nodeName,
            index: findIndex(
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

            const node = getNode(wrapperElement[0], range);

            if (node.nodeName === "IMG"
                || (node.nodeName === "SPAN" && node.classList.contains("magento-placeholder"))
            ) {
                return {
                    name: node.nodeName,
                    index: findIndex(
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

            return { id };
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
    tinymce.activeEditor.selection.moveToBookmark(bookmark);
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
function findIndex(wrapperElement: HTMLElement, name: string, element: Element) {
    const selector = name.toLowerCase() + ':not([data-mce-bogus="all"])';

    // If there is no ID on the element add a unique ID so we can efficiently find it
    if (!element.id) {
        element.id = mageUtils.uniqueid();
    }

    return $(wrapperElement).find(selector).toArray().findIndex((node) => {
        return node.id === element.id;
    });
}

function moveEndPoint(rng: Range, start: boolean) {
    let container;
    let offset;
    let childNodes;
    const prefix = start ? "start" : "end";

    container = rng[prefix + "Container"];
    offset = rng[prefix + "Offset"];

    if (container.nodeType === Node.ELEMENT_NODE && container.nodeName === "TR") {
        childNodes = container.childNodes;
        container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)];
        if (container) {
            offset = start ? 0 : container.childNodes.length;
            rng["set" + (start ? "Start" : "End")](container, offset);
        }
    }
}

function normalizeTableCellSelection(rng: Range): Range {
    moveEndPoint(rng, true);
    moveEndPoint(rng, false);

    return rng;
}

function getNode(root: Element, rng: Range): Element {
    let elm, startContainer, endContainer, startOffset, endOffset;

    // Range maybe lost after the editor is made visible again
    if (!rng) {
        return root;
    }

    startContainer = rng.startContainer;
    endContainer = rng.endContainer;
    startOffset = rng.startOffset;
    endOffset = rng.endOffset;
    elm = rng.commonAncestorContainer;

    // Handle selection a image or other control like element such as anchors
    if (!rng.collapsed) {
        if (startContainer === endContainer) {
            if (endOffset - startOffset < 2) {
                if (startContainer.hasChildNodes()) {
                    elm = startContainer.childNodes[startOffset];
                }
            }
        }

        // If the anchor node is a element instead of a text node then return this element
        // if (tinymce.isWebKit && sel.anchorNode && sel.anchorNode.nodeType == 1)
        // return sel.anchorNode.childNodes[sel.anchorOffset];

        // Handle cases where the selection is immediately wrapped around a node and return that node instead of it's parent.
        // This happens when you double click an underlined word in FireFox.
        if (startContainer.nodeType === 3 && endContainer.nodeType === 3) {
            if (startContainer.length === startOffset) {
                startContainer = skipEmptyTextNodes(startContainer.nextSibling, true);
            } else {
                startContainer = startContainer.parentNode;
            }

            if (endOffset === 0) {
                endContainer = skipEmptyTextNodes(endContainer.previousSibling, false);
            } else {
                endContainer = endContainer.parentNode;
            }

            if (startContainer && startContainer === endContainer) {
                return startContainer;
            }
        }
    }

    if (elm && elm.nodeType === 3) {
        return elm.parentNode;
    }

    return elm;
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
