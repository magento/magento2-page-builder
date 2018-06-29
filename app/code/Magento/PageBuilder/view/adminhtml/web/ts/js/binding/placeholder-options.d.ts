/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface PlaceholderOptionsInterface {
    element: (clone: JQuery) => JQuery;
    update: () => boolean;
}
