/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare var WysiwygEvents: {
    afterInitialization: "afterInitialization",
    afterChangeContent: "afterChangeContent",
    afterUndo: "afterUndo",
    afterPaste: "afterPaste",
    beforeSetContent: "beforeSetContent",
    afterSetContent: "afterSetContent",
    afterSave: "afterSave",
    afterOpenFileBrowser: "afterOpenFileBrowser",
    afterFormSubmit: "afterFormSubmit",
    afterBlur: "afterBlur",
    afterFocus: "afterFocus",
};

declare module "mage/adminhtml/wysiwyg/events" {
    export = WysiwygEvents;
}
