/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import csso from "csso";
import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import mageUtils from "mageUtils";
import _ from "underscore";
import Config from "../../config";
import ConfigInterface from "../../config.types";
import ContentTypeCollectionInterface from "../../content-type-collection.types";
import createContentType from "../../content-type-factory";
import ContentTypeInterface from "../../content-type.types";
import StyleRegistry, {generateCss} from "../../content-type/style-registry";
import decodeAllDataUrlsInString from "../../utils/directives";
import filterHtml from "../filter-html";
import { TreeItem } from "./serialize";

let port: MessagePort = null;
let styleRegistry: StyleRegistry;
const portDeferred: JQueryDeferred<MessagePort> = $.Deferred();
const deferredTemplates: {[key: string]: JQueryDeferred<string>} = {};
let lastRenderId: string;

/**
 * Debounce the render call, so we don't render until the final request
 */
const debounceRender = _.debounce((message: {stageId: string, tree: TreeItem}, renderId: string) => {
    render(message).then((output) => {
        // Only post the most recent render back to the parent
        if (lastRenderId === renderId) {
            port.postMessage({
                type: "render",
                message: output,
            });
        }
    });
}, 50);

/**
 * Listen for requests from the parent window for a render
 */
export default function listen(config: ConfigInterface) {
    const stageId = window.location.href.split("?")[1].split("=")[1];

    Config.setConfig(config);
    Config.setMode("Master");

    /**
     * Create a listener within our iframe so we can observe messages from the parent, once we receive a port on the
     * MessageChannel we utilise that for all communication.
     */
    window.addEventListener(
        "message",
        (event) => {
            if (event.ports && event.ports.length) {
                port = event.ports[0];
                portDeferred.resolve(port);
                port.onmessage = (messageEvent) => {
                    if (messageEvent.data.type === "render") {
                        const renderId = mageUtils.uniqueid();
                        lastRenderId = renderId;
                        debounceRender(messageEvent.data.message, renderId);
                    }
                    if (messageEvent.data.type === "template") {
                        const message = messageEvent.data.message;
                        if (message.name in deferredTemplates) {
                            deferredTemplates[message.name].resolve(message.template);
                            delete deferredTemplates[message.name];
                        }
                    }
                };
            }
        },
        false,
    );

    // Inform the parent iframe that we're ready to receive the port
    window.parent.postMessage({name: "PB_RENDER_READY", stageId}, "*");
}

/**
 * Use our MessageChannel to load a template from the parent window, this is required as the iframe isn't allowed to
 * make same origin XHR requests.
 *
 * @param name
 */
export function loadTemplate(name: string): Promise<string> {
    return new Promise((resolve) => {
        if (!(name in deferredTemplates)) {
            deferredTemplates[name] = $.Deferred();
        }
        deferredTemplates[name].then((template: string) => {
            resolve(template);
        });

        if (port) {
            port.postMessage({
                type: "template",
                message: name,
            });
        } else {
            portDeferred.then((messagePort) => {
                messagePort.postMessage({
                    type: "template",
                    message: name,
                });
            });
        }
    });
}

/**
 * Assert if the render has finished
 */
const assertRenderFinished = _.debounce((element: HTMLElement, expectedCount: number, callback: () => {}) => {
    if (element.querySelectorAll("[data-content-type]").length === expectedCount) {
        callback();
    }
}, 50);

/**
 * Iterate over the root container and count all content types
 *
 * @param rootContainer
 * @param count
 */
function countContentTypes(rootContainer: ContentTypeCollectionInterface, count?: number) {
    count = count || 0;
    rootContainer.getChildren()().forEach((child: ContentTypeCollectionInterface) => {
        ++count;
        if (typeof child.getChildren !== "undefined" && child.getChildren()().length > 0) {
            count = countContentTypes(child, count);
        }
    });
    return count;
}

/**
 * Perform a render of the provided data
 *
 * @param message
 */
function render(message: {stageId: string, tree: TreeItem}) {
    if (!styleRegistry) {
        styleRegistry = new StyleRegistry(message.stageId);
    }
    return new Promise((resolve, reject) => {
        createRenderTree(message.stageId, message.tree).then((rootContainer: ContentTypeCollectionInterface) => {
            const element = document.createElement("div");
            /**
             * Setup an event on the element to observe changes and count the expected amount of content types are
             * present within the content.
             */
            const renderFinished = $.Deferred();
            const observer = new MutationObserver(() => {
                assertRenderFinished(element, countContentTypes(rootContainer), renderFinished.resolve);
            });
            observer.observe(element, { attributes: true, childList: true, subtree: true });

            // Combine this event with our engine waitForRenderFinish to ensure rendering is completed
            $.when(engine.waitForFinishRender(), renderFinished).then(() => {
                observer.disconnect();
                ko.cleanNode(element);
                $(element).append(
                    $("<style />").html(generateMasterCss(styleRegistry)),
                );
                const filtered: JQuery = filterHtml($(element));
                const output = decodeAllDataUrlsInString(filtered.html());
                resolve(output);
            });

            ko.applyBindingsToNode(
                element,
                {
                    template: {
                        data: rootContainer.content,
                        name: rootContainer.content.template,
                    },
                },
            );
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * Rebuild the content type tree using their original data and configuration
 *
 * @param stageId
 * @param tree
 * @param parent
 */
function createRenderTree(
    stageId: string,
    tree: TreeItem,
    parent: ContentTypeCollectionInterface = null,
): Promise<ContentTypeCollectionInterface> {
    return createContentType(
        Config.getContentTypeConfig(tree.name),
        parent,
        stageId,
        tree.data,
        parent !== null ? tree.children.length : null,
    ).then((contentType: ContentTypeCollectionInterface) => {
        // Ensure  we retain the original tree ID's
        contentType.id = tree.id;

        if (tree.children.length > 0) {
            const childPromises: Array<Promise<ContentTypeInterface | ContentTypeCollectionInterface>> = [];
            tree.children.forEach((child) => {
                childPromises.push(createRenderTree(stageId, child, contentType));
            });
            return Promise.all(childPromises).then((children) => {
                children.forEach((child) => {
                    contentType.addChild(child);
                });
                return contentType;
            });
        }

        return contentType;
    });
}

/**
 * Generate the master format CSS
 *
 * @param registry
 */
function generateMasterCss(registry: StyleRegistry): string {
    return csso.minify(generateCss(registry.getAllStyles())).css;
}
