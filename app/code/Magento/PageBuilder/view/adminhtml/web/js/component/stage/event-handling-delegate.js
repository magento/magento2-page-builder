/*eslint-disable */
define(["knockout", "../../utils/array", "../block/factory", "../event-bus"], function (_knockout, _array, _factory, _eventBus) {
  /**
   * Handle event to remove block
   *
   * @param event
   * @param params
   */
  function onBlockRemoved(event, params) {
    params.parent.removeChild(params.block); // Remove the instance from the data store

    params.parent.stage.store.remove(params.block.id);
  }
  /**
   * Handle when an instance of an existing block is dropped onto a container
   *
   * @param {Event} event
   * @param {BlockInstanceDroppedParams} params
   */


  function onBlockInstanceDropped(event, params) {
    var originalParent = params.blockInstance.parent;
    params.blockInstance.parent = params.parent;
    params.parent.addChild(params.blockInstance, params.index);

    _eventBus.trigger("block:moved", {
      block: params.blockInstance,
      index: params.index,
      newParent: params.parent,
      originalParent: originalParent
    });
  }
  /**
   * Handle a block being dropped into a container
   *
   * @param {Event} event
   * @param {BlockDroppedParams} params
   */


  function onBlockDropped(event, params) {
    var index = params.index || 0;
    new Promise(function (resolve, reject) {
      if (params.block) {
        return (0, _factory)(params.block.config, params.parent, params.parent.stage).then(function (block) {
          params.parent.addChild(block, index);

          _eventBus.trigger("block:mount", {
            id: block.id,
            block: block
          });

          _eventBus.trigger(params.block.config.name + ":mount", {
            id: block.id,
            block: block
          });

          return block;
        });
      } else {
        reject("Parameter block missing from event.");
      }
    }).catch(function (error) {
      console.error(error);
    });
  }
  /**
   * Handle a block being sorted within it's own container
   *
   * @param {Event} event
   * @param {BlockSortedParams} params
   */


  function onBlockSorted(event, params) {
    var originalIndex = _knockout.utils.arrayIndexOf(params.parent.children(), params.block);

    if (originalIndex !== params.index) {
      (0, _array.moveArrayItem)(params.parent.children, originalIndex, params.index);
    }
  }
  /**
   * On sorting start & end show all borders on the stage
   *
   * @param {Event} event
   * @param {SortParams} params
   */


  function onSortingStart(event, params) {
    params.block.stage.showBorders(true);
  }

  function onSortingStop(event, params) {
    params.block.stage.showBorders(false);
  }
  /**
   * Handle container related events for the stage
   *
   * @param {Stage} stage
   */


  function handleEvents(stage) {
    // Block dropped from left hand panel
    _eventBus.on("block:dropped", function (event, params) {
      if (params.parent.stage.id === stage.id) {
        onBlockDropped(event, params);
      }
    }); // Block instance being moved between structural elements


    _eventBus.on("block:instanceDropped", function (event, params) {
      if (params.parent.stage.id === stage.id) {
        onBlockInstanceDropped(event, params);
      }
    }); // Block being removed from container


    _eventBus.on("block:removed", function (event, params) {
      if (params.parent.stage.id === stage.id) {
        onBlockRemoved(event, params);
      }
    }); // Block sorted within the same structural element


    _eventBus.on("block:sorted", function (event, params) {
      if (params.parent.stage.id === stage.id) {
        onBlockSorted(event, params);
      }
    }); // Observe sorting actions


    _eventBus.on("block:sortStart", function (event, params) {
      if (params.block.stage.id === stage.id) {
        onSortingStart(event, params);
      }
    });

    _eventBus.on("block:sortStop", function (event, params) {
      if (params.block.stage.id === stage.id) {
        onSortingStop(event, params);
      }
    });
  }

  return {
    handleEvents: handleEvents
  };
});
//# sourceMappingURL=event-handling-delegate.js.map
