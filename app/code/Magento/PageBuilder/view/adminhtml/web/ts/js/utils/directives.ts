/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Config from "../config";

/**
 * MIME type to use in place of the image
 *
 * @type {string}
 */
const mimeType = "text/magento-directive";

/**
 * Determine if a URL is a directive of our type
 *
 * @param {string} url
 * @returns {boolean}
 * @api
 */

function isDirectiveDataUrl(url: string): boolean {
    return url.indexOf("data:" + mimeType) === 0;
}

/**
 * Convert a directive into our data URI
 *
 * @param {string} directive
 * @returns {string}
 * @api
 */
export function toDataUrl(directive: string): string {
    return "data:" + mimeType + "," + encodeURIComponent(directive);
}

/**
 * Convert a URI to it's directive equivalent
 *
 * @param {string} url
 * @returns {string}
 * @api
 */
export function fromDataUrl(url: string): string {
    if (!isDirectiveDataUrl(url)) {
        throw Error(url + " is not a magento directive data url");
    }
    return decodeURIComponent(url.split(mimeType + ",")[1]);
}

/**
 * Decode all data URIs present in a string
 *
 * @param {string} str
 * @returns {string}
 * @api
 */
export default function decodeAllDataUrlsInString(str: string) {
    return str.replace(
        new RegExp("url\\s*\\(\\s*(?:&quot;|\'|\")?(data:" + mimeType + ",.+?)(?:&quot;|\'|\")?\\s*\\)", "g"),
        (match, url) => {
            return "url(\'" + fromDataUrl(url) + "\')";
        },
    );
}

/**
 * Retrieve the image URL with directive
 *
 * @param {Array} image
 * @returns {string}
 * @api
 */
export function getImageUrl(image: any[]) {
    const imageUrl = image[0].url;
    const mediaPath = imageUrl.split(Config.getConfig("media_url"));
    return "{{media url=" + mediaPath[1] + "}}";
}

/**
 * Remove quotes in media directives, {{media url="wysiwyg/image.png"}} convert to {{media url=wysiwyg/image.png}}
 *
 * @param {string} html
 * @returns {string}
 * @api
 */
export function removeQuotesInMediaDirectives(html: string): string {
    if (!html) {
        return "";
    }
    const mediaDirectiveRegExp = /\{\{\s*media\s+url\s*=\s*(.*?)\s*\}\}/g;
    const urlRegExp = /\{\{\s*media\s+url\s*=\s*(.*)\s*\}\}/;
    const mediaDirectiveMatches = html.match(mediaDirectiveRegExp);
    if (mediaDirectiveMatches) {
        mediaDirectiveMatches.forEach((mediaDirective: string) => {
            const urlMatches = mediaDirective.match(urlRegExp);
            if (urlMatches && urlMatches[1] !== undefined) {
                const directiveWithOutQuotes = "{{media url=" + urlMatches[1].replace(/("|&quot;|\s)/g, "") + "}}";
                html = html.replace(mediaDirective, directiveWithOutQuotes);
            }
        });
    }
    return html;
}

/**
 * Replace media directives with actual media URLs
 *
 * @param {string} html
 * @returns {string}
 * @api
 */
export function convertMediaDirectivesToUrls(html: string): string {
    if (!html) {
        return "";
    }
    const mediaDirectiveRegExp = /\{\{\s*media\s+url\s*=\s*"?[^"\s\}]+"?\s*\}\}/g;
    const mediaDirectiveMatches = html.match(mediaDirectiveRegExp);
    if (mediaDirectiveMatches) {
        mediaDirectiveMatches.forEach((mediaDirective: string) => {
            const urlRegExp = /\{\{\s*media\s+url\s*=\s*(?:"|&quot;)?(.+)(?=}})\s*\}\}/;
            const urlMatches = mediaDirective.match(urlRegExp);
            if (urlMatches && typeof urlMatches[1] !== "undefined") {
                html = html.replace(
                    mediaDirective,
                    Config.getConfig("media_url") + urlMatches[1].replace(/"$/, "").replace(/&quot;$/, ""),
                );
            }
        });
    }
    return html;
}

/**
 * Replace data-src attribute with src.
 *
 * @param {string} html
 * @returns {string}
 */
export function replaceWithSrc(html: string): string {
    return html.replace(
        new RegExp("data-tmp-src=\"\{\{", "g"),
        "src=\"{{",
    );
}

/**
 * Replace src attribute with data-tmp-src.
 *
 * @param {string} html
 * @returns {string}
 */
export function replaceWithDataSrc(html: string): string {
    return html.replace(
        new RegExp("src=\"\{\{", "g"),
        "data-tmp-src=\"{{",
    );
}
