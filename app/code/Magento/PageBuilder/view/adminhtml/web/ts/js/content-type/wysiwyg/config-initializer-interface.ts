/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

export interface WysiwygConfigInitializerInterface {
    initializeConfig(contentTypeId: string, config: any): void;
}

export default WysiwygConfigInitializerInterface;
