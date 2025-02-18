/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

import html2canvas from "html2canvas";
import $ from "jquery";
import $t from "mage/translate";
import alertDialog from "Magento_PageBuilder/js/modal/confirm-alert";
import templateManagerSave from "Magento_PageBuilder/js/modal/template-manager-save";
import promptContentTmpl from "text!Magento_PageBuilder/template/modal/template-manager/save-content-modal.html";
import registry from "uiRegistry";
import _ from "underscore";
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
                    // Wait for the screenshot and the rendering lock to complete before making the request
                    const renderingLock = stage.renderingLocks[stage.renderingLocks.length - 1];

                    $.when(capture, renderingLock).then((imageSrc: string, content: string) => {
                        $.ajax({
                            url: Config.getConfig("template_save_url"),
                            data: {
                                name,
                                template: content,
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
    const scrollY = window.scrollY;
    const stageElement = document.querySelector("#" + stage.id) as HTMLElement;
    const deferred = $.Deferred();

    // Wait for the stage to complete rendering before taking the capture
    const renderingLock = stage.renderingLocks[stage.renderingLocks.length - 1];
    renderingLock.then(() => {
        // Resolve issues with Parallax
        const parallaxRestore = disableParallax(stageElement);
        const canvasElement = document.querySelector("#" + stage.id + " .pagebuilder-canvas") as HTMLElement;

        stageElement.style.height = $(stageElement).outerHeight(false) + "px";
        stageElement.classList.add("capture");
        stageElement.classList.add("interacting");

        if (stage.pageBuilder.isFullScreen()) {
            window.scrollTo({
                top: 0,
            });
        }

        _.defer(() => {
            html2canvas(
                canvasElement,
                {
                    scale: 1,
                    useCORS: true,
                    scrollY: (window.pageYOffset * -1),
                    height: correctCanvasHeight(canvasElement),
                },
            ).then((canvas: HTMLCanvasElement) => {
                const imageSrc = canvas.toDataURL("image/jpeg", 0.85);

                deferred.resolve(imageSrc);

                if (stage.pageBuilder.isFullScreen()) {
                    window.scrollTo({
                        top: scrollY,
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
function disableParallax(stageElement: Element): ResetRowInterface[] {
    const rowsToReset: ResetRowInterface[] = [];
    const parallaxRows = stageElement.querySelectorAll("[data-jarallax-original-styles]");
    _.each(parallaxRows, (row: HTMLElement) => {
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
    _.each(rows, ({element, styles, container}) => {
        element.style.cssText = styles;
        container.style.display = "";
    });
}

/**
 * Adjust canvas element size to prevent area overflow.
 *
 * @param canvasElement
 */
function correctCanvasHeight(canvasElement: HTMLElement) {
    // @ts-ignore
    return canvasElement.getHeight() < 4096 ? canvasElement.getHeight() : 4096;
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
