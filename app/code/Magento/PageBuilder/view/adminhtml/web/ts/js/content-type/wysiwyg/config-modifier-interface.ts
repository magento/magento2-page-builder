/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface WysiwygConfigModifierInterface {
    modify(contentTypeId: string, config: any): void;
}

export default WysiwygConfigModifierInterface;
