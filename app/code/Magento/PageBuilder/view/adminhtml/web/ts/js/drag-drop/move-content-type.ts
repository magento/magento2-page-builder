/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
import ko from "knockout";
import events from "uiEvents";
import ContentTypeCollectionInterface from "../content-type-collection.d";
import ContentTypeInterface from "../content-type.d";

/**
 * Move a content type to a new index, with the option to move to a new container
 *
 * @param {ContentTypeInterface & ContentTypeCollectionInterface} contentType
 * @param {number} targetIndex
 * @param {ContentTypeCollectionInterface} targetParent
 */
export function moveContentType(
    contentType: ContentTypeInterface & ContentTypeCollectionInterface,
    targetIndex: number,
    targetParent: ContentTypeCollectionInterface = null,
) {
    const sourceParent: ContentTypeCollectionInterface = (contentType.parent as ContentTypeCollectionInterface);
    const sourceIndex = (contentType.parent as ContentTypeCollectionInterface)
        .children()
        .indexOf(contentType);
    const sourceParentChildren = sourceParent.getChildren();

    // Trigger our block move event
    events.trigger("contentType:beforeMove", {
        contentType,
        sourceParent,
        targetParent,
        targetIndex,
        stageId: contentType.stageId,
    });

    if (targetParent && sourceParent !== targetParent) {
        contentType.parent = targetParent;
        // Handle dragging between sortable elements
        sourceParentChildren.splice(sourceIndex, 1);
        targetParent.getChildren().splice(targetIndex, 0, contentType);
    } else {
        // Retrieve the children from the source parent
        const children = ko.utils.unwrapObservable(sourceParentChildren);

        // Inform KO that this value is about to mutate
        if (sourceParentChildren.valueWillMutate) {
            sourceParentChildren.valueWillMutate();
        }

        // Perform the mutation
        children.splice(sourceIndex, 1);
        children.splice(targetIndex, 0, contentType);

        // Inform KO that the mutation is complete
        if (sourceParentChildren.valueHasMutated) {
            sourceParentChildren.valueHasMutated();
        }
    }

    // Process any deferred bindings
    if ((ko as any).processAllDeferredBindingUpdates) {
        (ko as any).processAllDeferredBindingUpdates();
    }

    // Trigger our content type move event
    events.trigger("contentType:move", {
        contentType,
        sourceParent,
        targetParent,
        targetIndex,
        stageId: contentType.stageId,
    });
}
