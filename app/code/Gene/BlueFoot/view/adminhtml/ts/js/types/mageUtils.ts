/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare let mageUtils: {
    uniqueid(size?: number): string
};
declare module 'mageUtils' {
    export = mageUtils;
}
