/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import html2canvas from "html2canvas";
import $ from "jquery";
import $t from "mage/translate";
import alertDialog from "Magento_Ui/js/modal/alert";
import uiPrompt from "Magento_Ui/js/modal/prompt";
import promptContentTmpl from "text!Magento_PageBuilder/template/modal/template-manager/save-content-modal.html";
import Config from "./config";
import Stage from "./stage";

/**
 * Save the current stage contents as a template
 *
 * @param stage
 */
export function saveAsTemplate(stage: Stage) {
    const elementId = "preview-" + stage.id;

    const capture = createCapture(stage);
    capture.then((imageSrc: string) => {
        $("#" + elementId).show().append(`<img src="${imageSrc}" alt="Stage Preview" />`);
        $(".template-manager-preview-spinner").hide();
    });

    uiPrompt({
        title: $t("Save Content as Template"),
        previewPlaceholder: '<div id="' + elementId + '" class="template-manager-preview-image" ' +
            'style="display: none;"></div>',
        label: $t("Template Name"),
        validation: true,
        modalClass: "template-manager-save",
        validationRules: ["required-entry"],
        promptContentTmpl,
        attributesForm: {
            novalidate: "novalidate",
            action: "",
        },
        attributesField: {
            "name": "name",
            "data-validate": "{required:true}",
            "maxlength": "255",
        },
        actions: {
            /**
             * @param {String} name
             * @this {actions}
             */
            confirm: (name: string) => {
                capture.then((imageSrc: string) => {
                    $.ajax({
                        url: Config.getConfig("template_save_url"),
                        data: {
                            name,
                            template: stage.pageBuilder.content,
                            previewImage: imageSrc,
                        },
                        method: "POST",
                        dataType: "json",
                    }).done(() => {
                        alertDialog({
                            content: $t("The current page has been successfully saved as a template."),
                            title: $t("Template Saved"),
                        });
                    }).fail((error: string) => {
                        alertDialog({
                            content: $t("An issue occurred while attempting to save the template, please try again.") + "\n" + error,
                            title: $t("Template Save Error"),
                        });
                    });
                });
            },
        },
    });
}

/**
 * Create a capture of the stage
 *
 * @param stage
 */
function createCapture(stage: Stage) {
    const stageElement = document.querySelector("#" + stage.id);
    const scrollY = window.scrollY;
    const deferred = $.Deferred();

    stageElement.classList.add("capture");
    stageElement.classList.add("interacting");
    window.scrollTo({
        top: 0,
    });

    html2canvas(
        document.querySelector("#" + stage.id + " .pagebuilder-canvas"),
        {
            scale: 1,
            useCORS: true,
        },
    ).then((canvas) => {
        const imageSrc = canvas.toDataURL("image/jpeg", 0.85);

        deferred.resolve(imageSrc);

        window.scrollTo({
            top: scrollY,
        });

        stageElement.classList.remove("capture");
        stageElement.classList.remove("interacting");
    });

    return deferred;
}
