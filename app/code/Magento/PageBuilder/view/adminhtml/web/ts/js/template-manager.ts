/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import html2canvas from "html2canvas";
import $ from "jquery";
import $t from "mage/translate";
import templateManagerSave from "Magento_PageBuilder/js/modal/template-manager-save";
import alertDialog from "Magento_Ui/js/modal/alert";
import promptContentTmpl from "text!Magento_PageBuilder/template/modal/template-manager/save-content-modal.html";
import Config from "./config";
import Stage from "./stage";

/**
 * Save the current stage contents as a template
 *
 * @param stage
 */
export function saveAsTemplate(stage: Stage) {
    const capture = createCapture(stage);
    const prompt = templateManagerSave({
        title: $t("Save Content as Template"),
        promptContentTmpl,
        templateTypes: Config.getConfig("stage_config").template_types,
        createdForNote: $t("Created for is to help with filtering templates, this does not restrict where this template can be used."),
        typeLabel: $t("Created For"),
        label: $t("Template Name"),
        validation: true,
        modalClass: "template-manager-save",
        validationRules: ["required-entry"],
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
             * Handle confirmation of the prompt
             *
             * @param {String} name
             * @param {String} createdFor
             * @this {actions}
             */
            confirm(name: string, createdFor: string) {
                return new Promise((resolve, reject) => {
                    capture.then((imageSrc: string) => {
                        $.ajax({
                            url: Config.getConfig("template_save_url"),
                            data: {
                                name,
                                template: stage.pageBuilder.content,
                                previewImage: imageSrc,
                                createdFor,
                            },
                            method: "POST",
                            dataType: "json",
                        }).done((data: TemplateSaveDataInterface) => {
                            if (data.status === "ok") {
                                alertDialog({
                                    content: $t("The current contents of Page Builder has been successfully saved as a template."),
                                    title: $t("Template Saved"),
                                });
                                resolve();
                            } else if (data.status === "error") {
                                alertDialog({
                                    content: data.message || $t("An issue occurred while attempting to save " +
                                        "the template, please try again."),
                                    title: $t("An error occurred"),
                                });
                                reject();
                            }
                        }).fail(() => {
                            alertDialog({
                                content: $t("An issue occurred while attempting to save the template, " +
                                    "please try again."),
                                title: $t("Template Save Error"),
                            });
                            reject();
                        });
                    });
                });
            },
        },
    });

    // Update the UI with the preview image once available
    capture.then((imageSrc: string) => {
        // @ts-ignore
        prompt.templateManagerSave("setPreviewImage", imageSrc);
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
    ).then((canvas: HTMLCanvasElement) => {
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

interface TemplateSaveDataInterface {
    status: "ok" | "error";
    message: string;
    data: object;
}
