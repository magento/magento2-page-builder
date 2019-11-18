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
 * @param content
 */
export function convertVariablesToHtmlPreview(content: string) {
    const config = Config.getConfig("tinymce").variables;
    content = content.gsub(/\{\{config path=\"([^\"]+)\"\}\}/i, function(match) {
        let path = match[1],
            magentoVariables,
            imageHtml;

        magentoVariables = JSON.parse(config.placeholders);

        if (magentoVariables[match[1]] && magentoVariables[match[1]].variable_type === "default") {
            imageHtml = '<span id="%id" class="magento-variable magento-placeholder mceNonEditable">' +
                "%s</span>";
            imageHtml = imageHtml.replace("%s", magentoVariables[match[1]].variable_name);
        } else {
            imageHtml = '<span id="%id" class="' +
                "magento-variable magento-placeholder magento-placeholder-error " +
                "mceNonEditable" +
                '">' +
                "Not found" +
                "</span>";
        }

        return imageHtml.replace("%id", Base64.idEncode(path));
    });

    content = content.gsub(/\{\{customVar code=([^\}\"]+)\}\}/i, function(match) {
        let path = match[1],
            magentoVariables,
            imageHtml;

        magentoVariables = JSON.parse(config.placeholders);

        if (magentoVariables[match[1]] && magentoVariables[match[1]].variable_type === "custom") {
            imageHtml = '<span id="%id" class="magento-variable magento-custom-var magento-placeholder ' +
                'mceNonEditable">%s</span>';
            imageHtml = imageHtml.replace("%s", magentoVariables[match[1]].variable_name);
        } else {
            imageHtml = '<span id="%id" class="' +
                "magento-variable magento-custom-var magento-placeholder " +
                "magento-placeholder-error mceNonEditable" +
                '">' +
                match[1] +
                "</span>";
        }

        return imageHtml.replace("%id", Base64.idEncode(path));
    });

    return content;
}

/**
 * Convert widgets within content to their HTML counterparts
 *
 * @param content
 */
export function convertWidgetsToHtmlPreview(content: string) {
    console.log(Config.getConfig("tinymce"));
    const config = Config.getConfig("tinymce").widgets;
    return content.gsub(/\{\{widget(.*?)\}\}/i, function(match) {
        const attributes = parseAttributesString(match[1]);
        let imageSrc;
        let imageHtml = "";

        if (attributes.type) {
            attributes.type = attributes.type.replace(/\\\\/g, "\\");
            imageSrc = config.placeholders[attributes.type];

            if (imageSrc) {
                imageHtml += '<span class="magento-placeholder magento-widget mceNonEditable" ' +
                    'contenteditable="false">';
            } else {
                imageSrc = config.error_image_url;
                imageHtml += "<span " +
                    'class="magento-placeholder magento-placeholder-error magento-widget mceNonEditable" ' +
                    'contenteditable="false">';
            }

            imageHtml += "<img";
            imageHtml += ' id="' + Base64.idEncode(match[0]) + '"';
            imageHtml += ' src="' + imageSrc + '"';
            imageHtml += " />";

            if (config.types[attributes.type]) {
                imageHtml += config.types[attributes.type];
            }

            imageHtml += "</span>";

            return imageHtml;
        }
    });
}

/**
 * Parse attributes into a string
 *
 * @param attributes
 */
export function parseAttributesString(attributes: string): object {
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
