/**
 * MIME type to use in place of the image
 * @type {string}
 */
const mimeType = 'text/magento-directive';

/**
 * Determine if a URL is a directive of our type
 *
 * @param {string} url
 * @returns {boolean}
 */
function isDirectiveDataUrl(url: string): boolean {
    return url.indexOf('data:' + mimeType) === 0;
}

/**
 * Convert a directive into our data URI
 * @param {string} directive
 * @returns {string}
 */
export function toDataUrl(directive: string): string {
    return 'data:' + mimeType + ',' + encodeURIComponent(directive);
}

/**
 * Convert a URI to it's directive equivalent
 * @param {string} url
 * @returns {string}
 */
export function fromDataUrl(url: string): string {
    if (!isDirectiveDataUrl(url)) {
        throw Error(url + ' is not a magento directive data url');
    }
    return decodeURIComponent(url.split(mimeType + ",")[1]);
}

/**
 * Decode all data URIs present in a string
 *
 * @param {string} str
 * @returns {string}
 */
export default function decodeAllDataUrlsInString(str: string) {
    return str.replace(new RegExp('url\\s*\\(\\s*(?:&quot;|\'|")?(data:' + mimeType + ',.+?)(?:&quot;|\'|")?\\s*\\)', 'g'), function(match, url) {
        return 'url(\'' + fromDataUrl(url) +'\')';
    });
}
