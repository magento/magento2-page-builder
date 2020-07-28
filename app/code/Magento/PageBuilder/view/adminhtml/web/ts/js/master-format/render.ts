/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import $ from "jquery";
import Config from "../config";
import ContentTypeCollectionInterface from "../content-type-collection.types";
import { getSerializedTree } from "./render/serialize";

export default class MasterFormatRenderer {
    public stageId: string;
    public channel: MessageChannel;
    public ready: boolean = false;
    private readyDeferred: JQueryDeferred<void> = $.Deferred();

    /**
     * @param stageId
     */
    constructor(stageId: string) {
        this.stageId = stageId;
    }

    /**
     * Render the root container into a string utilising our sandboxed iframe
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */
    public applyBindings(rootContainer: ContentTypeCollectionInterface): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.getRenderFrame()) {
                // If the stage exists we should also have a frame
                if (document.getElementById(this.stageId)) {
                    return reject("No render frame present for Page Builder instance.");
                }

                // Otherwise the instance of Page Builder has been removed from the DOM and this is an old instance.
                return reject();
            }

            if (this.ready) {
                this.channel.port1.postMessage({
                    type: "render",
                    message: {
                        stageId: this.stageId,
                        tree: getSerializedTree(rootContainer),
                    },
                });
                this.channel.port1.onmessage = (event) => {
                    if (event.isTrusted) {
                        if (event.data.type === "render") {
                            resolve(event.data.message);
                        }
                        if (event.data.type === "template") {
                            this.loadTemplate(event.data.message);
                        }
                    } else {
                        reject("Render event was not trusted.");
                    }
                };
            } else {
                this.readyDeferred.then(() => {
                    this.applyBindings(rootContainer).then((rendered: string) => {
                        resolve(rendered);
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }
        });
    }

    /**
     * Create a channel to communicate with our sandboxed iframe. Firstly add a listener to the current window and then
     * set the src of the iframe. Listening for a specific message event with a predefined term and then hand over the
     * MessageChannel port to allow communication between the main window and iframe.
     */
    public setupChannel() {
        this.channel = new MessageChannel();
        const frame = this.getRenderFrame();
        window.addEventListener("message", (event) => {
            if (!this.ready && event.data.name === "PB_RENDER_READY" && this.stageId === event.data.stageId) {
                frame.contentWindow.postMessage("PB_RENDER_PORT", "*", [this.channel.port2]);
                this.ready = true;
                this.readyDeferred.resolve();
            }
        });
        frame.src = Config.getConfig("render_url") + "?stageId=" + this.stageId;
    }

    /**
     * Use the text! RequireJS plugin to load a template and send it back to the child render iframe
     *
     * @param name
     */
    private loadTemplate(name: string): void {
        require(["text!" + name], (template: string) => {
            this.channel.port1.postMessage({
                type: "template",
                message: {
                    name,
                    template,
                },
            });
        });
    }

    /**
     * Retrieve the render frame
     *
     * @returns {HTMLIFrameElement}
     */
    private getRenderFrame(): HTMLIFrameElement {
        return document.getElementById("render_frame_" + this.stageId) as HTMLIFrameElement;
    }
}
