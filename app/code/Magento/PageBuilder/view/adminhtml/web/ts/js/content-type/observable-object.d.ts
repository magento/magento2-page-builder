/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default interface ObservableObject {
    [key: string]: {
        [key: string]: KnockoutObservable<any>;
    };
}
