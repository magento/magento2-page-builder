/*eslint-disable */
/* jscs:disable */
define(["html2canvas", "jquery", "mage/translate", "Magento_PageBuilder/js/modal/template-manager-save", "Magento_Ui/js/modal/alert", "text!Magento_PageBuilder/template/modal/template-manager/save-content-modal.html", "Magento_PageBuilder/js/config"], function (_html2canvas, _jquery, _translate, _templateManagerSave, _alert, _saveContentModal, _config) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */

  /**
   * Save the current stage contents as a template
   *
   * @param stage
   */
  function saveAsTemplate(stage) {
    var capture = createCapture(stage);
    var prompt = (0, _templateManagerSave)({
      title: (0, _translate)("Save Content as Template"),
      promptContentTmpl: _saveContentModal,
      templateTypes: _config.getConfig("stage_config").template_types,
      createdForNote: (0, _translate)("Created for is to help with filtering templates, this does not restrict where this template can be used."),
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
            capture.then(function (imageSrc) {
              _jquery.ajax({
                url: _config.getConfig("template_save_url"),
                data: {
                  name: name,
                  template: stage.pageBuilder.content,
                  previewImage: imageSrc,
                  createdFor: createdFor
                },
                method: "POST",
                dataType: "json"
              }).done(function (data) {
                if (data.status === "ok") {
                  (0, _alert)({
                    content: (0, _translate)("The current contents of Page Builder has been successfully saved as a template."),
                    title: (0, _translate)("Template Saved")
                  });
                  resolve();
                } else if (data.status === "error") {
                  (0, _alert)({
                    content: data.message || (0, _translate)("An issue occurred while attempting to save " + "the template, please try again."),
                    title: (0, _translate)("An error occurred")
                  });
                  reject();
                }
              }).fail(function () {
                (0, _alert)({
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
   * Create a capture of the stage
   *
   * @param stage
   */


  function createCapture(stage) {
    var stageElement = document.querySelector("#" + stage.id);
    var scrollY = window.scrollY;

    var deferred = _jquery.Deferred();

    stageElement.classList.add("capture");
    stageElement.classList.add("interacting");
    window.scrollTo({
      top: 0
    });
    (0, _html2canvas)(document.querySelector("#" + stage.id + " .pagebuilder-canvas"), {
      scale: 1,
      useCORS: true
    }).then(function (canvas) {
      var imageSrc = canvas.toDataURL("image/jpeg", 0.85);
      deferred.resolve(imageSrc);
      window.scrollTo({
        top: scrollY
      });
      stageElement.classList.remove("capture");
      stageElement.classList.remove("interacting");
    });
    return deferred;
  }

  return {
    saveAsTemplate: saveAsTemplate
  };
});
//# sourceMappingURL=template-manager.js.map