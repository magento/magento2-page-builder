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
import registry from "uiRegistry";
import {isAllowed, resources} from "./acl";
import Config from "./config";
import Stage from "./stage";

/**
 * Save the current stage contents as a template
 *
 * @param stage
 */
export function saveAsTemplate(stage: Stage) {
    if (!isAllowed(resources.TEMPLATE_SAVE)) {
        alertDialog({
            content: $t("You do not have permission to save new templates."),
            title: $t("Permission Error"),
        });
        return false;
    }

    const capture = createCapture(stage);
    const prompt = templateManagerSave({
        title: $t("Save Content as Template"),
        promptContentTmpl,
        templateTypes: Config.getConfig("stage_config").template_types,
        createdForNote: $t("Created For is to help with filtering templates. This does not restrict where this template can be used."),
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
                                refreshGrid();
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
 * Refresh the grid if it exists
 */
function refreshGrid() {
    const templateStageGrid = registry
        .get("pagebuilder_stage_template_grid.pagebuilder_stage_template_grid_data_source");

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
function createCapture(stage: Stage) {
    const stageElement = document.querySelector("#" + stage.id);
    const scrollY = window.scrollY;
    const deferred = $.Deferred();

    // Resolve issues with Parallax
    const parallaxRestore = disableParallax(stageElement);

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
        restoreParallax(parallaxRestore);
    });

    return deferred;
}

/**
 * Disable the parallax elements in the stage
 *
 * @param {Element} stageElement
 */
function disableParallax(stageElement: Element): ResetRowInterface[] {
    const rowsToReset: ResetRowInterface[] = [];
    const parallaxRows = stageElement.querySelectorAll("[data-jarallax-original-styles]");
    parallaxRows.forEach((row: HTMLElement) => {
        const originalStyles = row.getAttribute("data-jarallax-original-styles");
        const jarallaxStyle = row.style.cssText;
        row.style.cssText = originalStyles;
        const jarallaxContainer = row.querySelector('div[id*="jarallax-container"]') as HTMLElement;
        jarallaxContainer.style.display = "none";
        rowsToReset.push({
            element: row,
            styles: jarallaxStyle,
            container: jarallaxContainer,
        });
    });

    return rowsToReset;
}

/**
 * Restore parallax on modified nodes
 *
 * @param rows
 */
function restoreParallax(rows: ResetRowInterface[]) {
    rows.forEach(({element, styles, container}) => {
        element.style.cssText = styles;
        container.style.display = "";
    });
}

interface ResetRowInterface {
    element: HTMLElement;
    styles: string;
    container: HTMLElement;
}

interface TemplateSaveDataInterface {
    status: "ok" | "error";
    message: string;
    data: object;
}
