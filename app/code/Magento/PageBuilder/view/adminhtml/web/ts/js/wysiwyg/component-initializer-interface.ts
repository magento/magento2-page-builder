/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

import WysiwygInterface from "./wysiwyg-interface";

export interface WysiwygComponentInitializerInterface {
    initialize(wysiwyg: WysiwygInterface): void;
}

export default WysiwygComponentInitializerInterface;
