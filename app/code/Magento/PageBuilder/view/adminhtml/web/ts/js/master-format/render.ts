/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ContentTypeCollectionInterface from "../content-type-collection.types";
import Config from "../config";
import { getSerializedTree } from "./render/serialize";

export default class MasterFormatRenderer {
    stageId: string;
    channel: MessageChannel;
    ready: boolean = false;

    /**
     * @param stageId 
     */
    constructor(stageId: string) {
        this.stageId = stageId;
    }

    /**
     * Render the root container into a string
     *
     * @param {ContentTypeCollection} rootContainer
     * @returns {Promise<string>}
     */
    public applyBindings(rootContainer: ContentTypeCollectionInterface): Promise<string> {
        if (!this.getRenderFrame()) {
            console.error("No render frame present for Page Builder instance.");
            return;
        }

        return new Promise((resolve, reject) => {
            if (this.ready) {
                this.channel.port1.postMessage(getSerializedTree(rootContainer));
                this.channel.port1.onmessage = (event) => {
                    if (event.isTrusted) {
                        console.log(event.data);
                        resolve(event.data);
                    } else {
                        reject();
                    }
                };
            }
        });
    }

    /**
     * Setup the channel, wait for the frame to load and be ready for the port
     */
    public setupChannel() {
        this.channel = new MessageChannel();
        const frame = this.getRenderFrame();
        frame.onload = () => {
            window.addEventListener("message", (event) => {
                if (event.data === "PB_RENDER_READY") {
                    frame.contentWindow.postMessage("PB_RENDER_PORT", this.getTargetOrigin(), [this.channel.port2]);
                    this.ready = true;
                }
            });
        };
    }

    /**
     * Retrieve the target origin
     */
    private getTargetOrigin() : string {
        return new URL(Config.getConfig('render_url')).origin;
    }

    /**
     * Retrieve the render frame
     * 
     * @returns {HTMLIFrameElement}
     */
    private getRenderFrame() : HTMLIFrameElement {
        return document.getElementById("render_frame_" + this.stageId) as HTMLIFrameElement;
    }
}
