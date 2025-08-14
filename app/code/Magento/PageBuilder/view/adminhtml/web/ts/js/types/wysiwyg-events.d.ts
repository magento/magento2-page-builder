/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
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
