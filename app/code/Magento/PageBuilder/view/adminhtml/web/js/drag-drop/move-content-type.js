/*eslint-disable */
/* jscs:disable */
define(["knockout", "Magento_PageBuilder/js/events"], function (_knockout, _events) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Move a content type to a new index, with the option to move to a new container
   *
   * @param {ContentTypeInterface | ContentTypeCollectionInterface} contentType
   * @param {number} targetIndex
   * @param {ContentTypeCollectionInterface} targetParent
   */
  function moveContentType(contentType, targetIndex, targetParent) {
    if (targetParent === void 0) {
      targetParent = null;
    }

    var sourceParent = contentType.parentContentType;
    var sourceIndex = contentType.parentContentType.children().indexOf(contentType);
    var sourceParentChildren = sourceParent.getChildren(); // Trigger our block move event

    _events.trigger("contentType:moveBefore", {
      contentType: contentType,
      sourceParent: sourceParent,
      targetParent: targetParent,
      targetIndex: targetIndex,
      stageId: contentType.stageId
    });

    _events.trigger(contentType.config.name + ":moveBefore", {
      contentType: contentType,
      sourceParent: sourceParent,
      targetParent: targetParent,
      targetIndex: targetIndex,
      stageId: contentType.stageId
    });

    if (targetParent && sourceParent !== targetParent) {
      contentType.parentContentType = targetParent; // Handle dragging between sortable elements

      sourceParentChildren.splice(sourceIndex, 1);
      targetParent.getChildren().splice(targetIndex, 0, contentType);
    } else {
      // Retrieve the children from the source parent
      var children = _knockout.utils.unwrapObservable(sourceParentChildren); // Inform KO that this value is about to mutate


      if (sourceParentChildren.valueWillMutate) {
        sourceParentChildren.valueWillMutate();
      } // Perform the mutation


      children.splice(sourceIndex, 1);
      children.splice(targetIndex, 0, contentType); // Inform KO that the mutation is complete

      if (sourceParentChildren.valueHasMutated) {
        sourceParentChildren.valueHasMutated();
      }
    } // Process any deferred bindings


    if (_knockout.processAllDeferredBindingUpdates) {
      _knockout.processAllDeferredBindingUpdates();
    } // Trigger our content type move event


    _events.trigger("contentType:moveAfter", {
      contentType: contentType,
      sourceParent: sourceParent,
      targetParent: targetParent,
      targetIndex: targetIndex,
      stageId: contentType.stageId
    });

    _events.trigger(contentType.config.name + ":moveAfter", {
      contentType: contentType,
      sourceParent: sourceParent,
      targetParent: targetParent,
      targetIndex: targetIndex,
      stageId: contentType.stageId
    });
  }

  return {
    moveContentType: moveContentType
  };
});
//# sourceMappingURL=move-content-type.js.map