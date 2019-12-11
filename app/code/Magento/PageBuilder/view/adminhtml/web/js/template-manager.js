/*eslint-disable */
/* jscs:disable */
define(["html2canvas", "jquery", "mage/translate", "Magento_Ui/js/modal/alert", "Magento_Ui/js/modal/prompt", "text!Magento_PageBuilder/template/modal/template-manager/save-content-modal.html", "Magento_PageBuilder/js/config"], function (_html2canvas, _jquery, _translate, _alert, _prompt, _saveContentModal, _config) {
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
    var elementId = "preview-" + stage.id;
    var capture = createCapture(stage);
    capture.then(function (imageSrc) {
      (0, _jquery)("#" + elementId).show().append("<img src=\"" + imageSrc + "\" alt=\"Stage Preview\" />");
      (0, _jquery)(".template-manager-preview-spinner").hide();
    });
    (0, _prompt)({
      title: (0, _translate)("Save Content as Template"),
      previewPlaceholder: '<div id="' + elementId + '" class="template-manager-preview-image" ' + 'style="display: none;"></div>',
      label: (0, _translate)("Template Name"),
      validation: true,
      modalClass: "template-manager-save",
      validationRules: ["required-entry"],
      promptContentTmpl: _saveContentModal,
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
         * @param {String} name
         * @this {actions}
         */
        confirm: function confirm(name) {
          capture.then(function (imageSrc) {
            _jquery.ajax({
              url: _config.getConfig("template_save_url"),
              data: {
                name: name,
                template: stage.pageBuilder.content,
                previewImage: imageSrc
              },
              method: "POST",
              dataType: "json"
            }).done(function () {
              (0, _alert)({
                content: (0, _translate)("The current page has been successfully saved as a template."),
                title: (0, _translate)("Template Saved")
              });
            }).fail(function (error) {
              (0, _alert)({
                content: (0, _translate)("An issue occurred while attempting to save the template, please try again.") + "\n" + error,
                title: (0, _translate)("Template Save Error")
              });
            });
          });
        }
      }
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