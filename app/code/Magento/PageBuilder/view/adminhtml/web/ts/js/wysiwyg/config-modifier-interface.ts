/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

export interface WysiwygConfigModifierInterface {
    modify(contentTypeId: string, config: any): void;
}

export default WysiwygConfigModifierInterface;
