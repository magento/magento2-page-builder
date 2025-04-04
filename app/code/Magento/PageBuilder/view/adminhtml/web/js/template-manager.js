/*eslint-disable */
/* jscs:disable */
define(["html2canvas", "jquery", "mage/translate", "Magento_PageBuilder/js/modal/confirm-alert", "Magento_PageBuilder/js/modal/template-manager-save", "text!Magento_PageBuilder/template/modal/template-manager/save-content-modal.html", "uiRegistry", "underscore", "Magento_PageBuilder/js/acl", "Magento_PageBuilder/js/config"], function (_html2canvas, _jquery, _translate, _confirmAlert, _templateManagerSave, _saveContentModal, _uiRegistry, _underscore, _acl, _config) {
  /**
   * Copyright 2019 Adobe
   * All Rights Reserved.
   */

  /**
   * Save the current stage contents as a template
   *
   * @param stage
   */
  function saveAsTemplate(stage) {
    if (!(0, _acl.isAllowed)(_acl.resources.TEMPLATE_SAVE)) {
      (0, _confirmAlert)({
        content: (0, _translate)("You do not have permission to save new templates."),
        title: (0, _translate)("Permission Error")
      });
      return false;
    }

    var capture = createCapture(stage);
    var prompt = (0, _templateManagerSave)({
      title: (0, _translate)("Save Content as Template"),
      promptContentTmpl: _saveContentModal,
      templateTypes: _config.getConfig("stage_config").template_types,
      createdForNote: (0, _translate)("Created For is to help with filtering templates. This does not restrict where this template can be used."),
      typeLabel: (0, _translate)("Created For"),
      label: (0, _translate)("Template Name"),
      validation: true,
      modalClass: "template-manager-save",
      validationRules: ["required-entry"],
      attributesForm: {
        novalidate: "novalidate",
        action: ""
      },
      attributesField: {
        "name": "name",
        "data-validate": "{required:true}",
        "maxlength": "255"
      },
      actions: {
        /**
         * Handle confirmation of the prompt
         *
         * @param {String} name
         * @param {String} createdFor
         * @this {actions}
         */
        confirm: function confirm(name, createdFor) {
          return new Promise(function (resolve, reject) {
            // Wait for the screenshot and the rendering lock to complete before making the request
            var renderingLock = stage.renderingLocks[stage.renderingLocks.length - 1];

            _jquery.when(capture, renderingLock).then(function (imageSrc, content) {
              _jquery.ajax({
                url: _config.getConfig("template_save_url"),
                data: {
                  name: name,
                  template: content,
                  previewImage: imageSrc,
                  createdFor: createdFor
                },
                method: "POST",
                dataType: "json"
              }).done(function (data) {
                if (data.status === "ok") {
                  (0, _confirmAlert)({
                    content: (0, _translate)("The current contents of Page Builder has been successfully saved as a template."),
                    title: (0, _translate)("Template Saved")
                  });
                  refreshGrid();
                  resolve();
                } else if (data.status === "error") {
                  (0, _confirmAlert)({
                    content: data.message || (0, _translate)("An issue occurred while attempting to save " + "the template, please try again."),
                    title: (0, _translate)("An error occurred")
                  });
                  reject();
                }
              }).fail(function () {
                (0, _confirmAlert)({
                  content: (0, _translate)("An issue occurred while attempting to save the template, " + "please try again."),
                  title: (0, _translate)("Template Save Error")
                });
                reject();
              });
            });
          });
        }
      }
    }); // Update the UI with the preview image once available

    capture.then(function (imageSrc) {
      // @ts-ignore
      prompt.templateManagerSave("setPreviewImage", imageSrc);
    });
  }
  /**
   * Refresh the grid if it exists
   */


  function refreshGrid() {
    var templateStageGrid = _uiRegistry.get("pagebuilder_stage_template_grid.pagebuilder_stage_template_grid_data_source");

    if (templateStageGrid) {
      templateStageGrid.storage().clearRequests();
      templateStageGrid.reload();
    }
  }
  /**
   * Create a capture of the stage
   *
   * @param stage
   */


  function createCapture(stage) {
    var scrollY = window.scrollY;
    var stageElement = document.querySelector("#" + stage.id);

    var deferred = _jquery.Deferred(); // Wait for the stage to complete rendering before taking the capture


    var renderingLock = stage.renderingLocks[stage.renderingLocks.length - 1];
    renderingLock.then(function () {
      // Resolve issues with Parallax
      var parallaxRestore = disableParallax(stageElement);
      var canvasElement = document.querySelector("#" + stage.id + " .pagebuilder-canvas");
      stageElement.style.height = (0, _jquery)(stageElement).outerHeight(false) + "px";
      stageElement.classList.add("capture");
      stageElement.classList.add("interacting");

      if (stage.pageBuilder.isFullScreen()) {
        window.scrollTo({
          top: 0
        });
      }

      _underscore.defer(function () {
        (0, _html2canvas)(canvasElement, {
          scale: 1,
          useCORS: true,
          scrollY: window.pageYOffset * -1,
          height: correctCanvasHeight(canvasElement)
        }).then(function (canvas) {
          var imageSrc = canvas.toDataURL("image/jpeg", 0.85);
          deferred.resolve(imageSrc);

          if (stage.pageBuilder.isFullScreen()) {
            window.scrollTo({
              top: scrollY
            });
          }

          stageElement.style.height = null;
          stageElement.classList.remove("capture");
          stageElement.classList.remove("interacting");
          restoreParallax(parallaxRestore);
        });
      });
    });
    return deferred;
  }
  /**
   * Disable the parallax elements in the stage
   *
   * @param {Element} stageElement
   */


  function disableParallax(stageElement) {
    var rowsToReset = [];
    var parallaxRows = stageElement.querySelectorAll("[data-jarallax-original-styles]");

    _underscore.each(parallaxRows, function (row) {
      var originalStyles = row.getAttribute("data-jarallax-original-styles");
      var jarallaxStyle = row.style.cssText;
      row.style.cssText = originalStyles;
      var jarallaxContainer = row.querySelector('div[id*="jarallax-container"]');
      jarallaxContainer.style.display = "none";
      rowsToReset.push({
        element: row,
        styles: jarallaxStyle,
        container: jarallaxContainer
      });
    });

    return rowsToReset;
  }
  /**
   * Restore parallax on modified nodes
   *
   * @param rows
   */


  function restoreParallax(rows) {
    _underscore.each(rows, function (_ref) {
      var element = _ref.element,
          styles = _ref.styles,
          container = _ref.container;
      element.style.cssText = styles;
      container.style.display = "";
    });
  }
  /**
   * Adjust canvas element size to prevent area overflow.
   *
   * @param canvasElement
   */


  function correctCanvasHeight(canvasElement) {
    // @ts-ignore
    return canvasElement.getHeight() < 4096 ? canvasElement.getHeight() : 4096;
  }

  return {
    saveAsTemplate: saveAsTemplate
  };
});
//# sourceMappingURL=template-manager.js.map
