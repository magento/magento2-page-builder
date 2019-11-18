import $ from "jquery";
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
 * Retrieve the selection of the user
 */
export function getSelection(): Selection {
    if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
            const range = selection.getRangeAt(0).cloneRange();
            $(range.startContainer.parentNode).attr("data-startContainer", "true");
            $(range.endContainer.parentNode).attr("data-endContainer", "true");
            return {
                startContainer: range.startContainer,
                startOffset: range.startOffset,
                endContainer: range.endContainer,
                endOffset: range.endOffset,
            };
        }
    }
    return null;
}

/**
 * Restore the users previous selection
 *
 * @param element
 * @param selection
 */
export function restoreSelection(element: HTMLElement, selection: Selection) {
    if (selection && window.getSelection) {
        // Find the original container that had the selection
        const startContainerParent = $(element).find("[data-startContainer]");
        startContainerParent.removeAttr("data-startContainer");
        const startContainer: HTMLElement = findTextNode(
            startContainerParent,
            selection.startContainer.nodeValue,
        );
        const endContainerParent = $(element).find("[data-endContainer]");
        endContainerParent.removeAttr("data-endContainer");
        let endContainer: HTMLElement = startContainer;
        if (selection.endContainer.nodeValue !== selection.startContainer.nodeValue) {
            endContainer = findTextNode(
                endContainerParent,
                selection.endContainer.nodeValue,
            );
        }

        if (startContainer && endContainer) {
            const newSelection = window.getSelection();
            newSelection.removeAllRanges();

            const range = document.createRange();
            range.setStart(startContainer, selection.startOffset);
            range.setEnd(endContainer, selection.endOffset);
            newSelection.addRange(range);
        }
    }
}

/**
 * Find a text node within an existing element
 *
 * @param element
 * @param text
 */
function findTextNode(element: JQuery, text: string): HTMLElement {
    if (text && text.trim().length > 0) {
        return element.contents().toArray().find((node: HTMLElement) => {
            return node.nodeType === Node.TEXT_NODE && text === node.nodeValue;
        });
    }
}

export interface Selection {
    startContainer: Node;
    startOffset: number;
    endContainer: Node;
    endOffset: number;
}
