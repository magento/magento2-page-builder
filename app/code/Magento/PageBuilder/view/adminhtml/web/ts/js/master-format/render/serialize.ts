import ContentTypeCollection from "../../content-type-collection";
import ContentTypeInterface from "../../content-type.types";
import appearanceConfig from "../../content-type/appearance-config";
import { DataObject } from "../../data-store";

export interface TreeItem {
    template: string;
    data: DataObject;
    children: TreeItem[];
}

/**
 * Serailize the tree as a simplified object for rendering
 *
 * @param contentType
 */
export function buildTree(contentType: ContentTypeInterface) {
    const data = getMasterData(contentType);
    const tree: TreeItem = {
        template: getTemplate(contentType, data.appearance),
        data,
        children: [],
    };

    if (contentType instanceof ContentTypeCollection && contentType.getChildren()().length > 0) {
        contentType.getChildren()().forEach((child) => {
            tree.children.push(buildTree(child));
        });
    }

    return tree;
}

/**
 * Get a serialized version of the tree
 *
 * @param contentType
 */
export function getSerializedTree(contentType: ContentTypeInterface) {
    return buildTree(contentType);
}

/**
 * Retrieve the template for the content type \
 * @param contentType
 * @param appearance
 */
function getTemplate(contentType: ContentTypeInterface, appearance: string): string {
    return appearanceConfig(contentType.config.name, appearance).master_template;
}

/**
 * Retrieve the master data from the content types instance
 *
 * @param contentType
 */
function getMasterData(contentType: ContentTypeInterface) {
    return contentType.content.getBindings() || {};
}
