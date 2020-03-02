import Config from "./config";

interface AclResources {
    TEMPLATE_SAVE: string;
    TEMPLATE_APPLY: string;
}

export const resources: AclResources = {
    TEMPLATE_SAVE: "template_save",
    TEMPLATE_APPLY: "template_apply",
};

/**
 * Determine if the current user is allowed to access this resource
 *
 * Usage: isAllowed(resources.TEMPLATE_SAVE)
 *
 * @param resource
 */
export function isAllowed(resource: string) {
    return Config.getConfig("acl")[resource] === true;
}
