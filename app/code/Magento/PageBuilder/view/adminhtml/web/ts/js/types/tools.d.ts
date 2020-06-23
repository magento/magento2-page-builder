/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

interface Base64 {
    _keyStr: string;
    encode: (input: string) => string;
    decode: (input: string) => string;
    mageEncode: (input: string) => string;
    mageDecode: (output: string) => string;
    idEncode: (input: string) => string;
    idDecode: (output: string) => string;
    _utf8_encode: (input: string) => string;
    _utf8_decode: (utftext: string) => string;
}

interface Window {
    Base64: Base64;
}
