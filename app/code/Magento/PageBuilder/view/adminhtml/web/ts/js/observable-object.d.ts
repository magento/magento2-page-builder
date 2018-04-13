/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface ObservableObject {
    [key: string]: KnockoutObservable<any>;
}
