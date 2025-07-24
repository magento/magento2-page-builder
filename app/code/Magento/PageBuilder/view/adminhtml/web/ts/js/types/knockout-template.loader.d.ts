/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

declare let loader: {
    formatPath(path: string): string;
};

declare module "Magento_Ui/js/lib/knockout/template/loader" {
    export = loader;
}
