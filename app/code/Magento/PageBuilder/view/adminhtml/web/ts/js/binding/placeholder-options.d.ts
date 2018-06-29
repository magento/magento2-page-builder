/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
/**
 * @api
 */
export interface PlaceholderOptionsInterface {
    element: (clone: JQuery) => JQuery;
    update: () => boolean;
}
