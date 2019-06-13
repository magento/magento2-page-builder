import $ from "jquery";
import ko from "knockout";
import engine from "Magento_Ui/js/lib/knockout/template/engine";
import { TreeItem } from "../master-format/render/serialize";
import RenderViewModel from "./view-model";
import RenderContentType from "./content-type";
import filterHtml from "../master-format/filter-html";
import decodeAllDataUrlsInString from "../utils/directives";

/**
 * Listen for requests from the parent window for a render
 */
export default function listen(baseUrl: string) {
    window.addEventListener(
        "message",
        (event) => {
            if (event.ports && event.ports.length) {
                const port = event.ports[0];
                port.onmessage = (event) => {
                    render(event.data).then((output) => {
                        port.postMessage(output);
                    });
                };
            }
        },
        false,
    );
    window.parent.postMessage("PB_RENDER_READY", new URL(baseUrl).origin);
}

/**
 * Perform a render of the provided data
 * 
 * @param tree 
 */
function render(tree: TreeItem) {
    return new Promise((resolve, reject) => {
        const renderTree = createRenderTree(tree);
        const element = document.createElement("div");
        engine.waitForFinishRender().then(() => {
            ko.cleanNode(element);
            const filtered: JQuery = filterHtml($(element));
            const output = decodeAllDataUrlsInString(filtered.html());
            element.remove();
            resolve(output);
        });
        ko.applyBindingsToNode(
            element,
            {
                template: {
                    data: renderTree.content,
                    name: renderTree.content.template,
                },
            },
        );
    });
}

/**
 * Convert the serialised data back into a renderable tree conforming to the same interface as the previous renderer
 * 
 * @param tree 
 */
function createRenderTree(tree: TreeItem): RenderContentType {
    const contentType = new RenderContentType(
        new RenderViewModel(
            tree.template,
            tree.data
        )
    );
    if (tree.children.length > 0) {
        tree.children.forEach((child) => {
            contentType.children.push(
                createRenderTree(child)
            );
        });
    }
    return contentType;
}