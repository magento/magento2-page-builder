/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

declare let loader: {
    formatPath(path: string): string;
};

declare module "Magento_Ui/js/lib/knockout/template/loader" {
    export = loader;
}
