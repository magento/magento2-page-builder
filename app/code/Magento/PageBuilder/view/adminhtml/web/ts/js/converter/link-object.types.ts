/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export default interface LinkObject {
    type: string;
    setting: string;
    [key: string]: string;
}
