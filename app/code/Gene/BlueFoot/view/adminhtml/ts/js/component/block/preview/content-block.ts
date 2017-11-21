/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _, {Dictionary} from "underscore";
import ko from "knockout";
import PreviewBlock from "./block";
import Config from "../../config";

interface PreviewData {
    [key: string]: KnockoutObservable<any>;
}

export default class ContentBlock extends PreviewBlock {
    html: KnockoutObservable<string> = ko.observable('default');
    /**
     * Get the content of a static block
     *
     * @returns {DataObject}
     */
    getContent() {
        const url        = Config.getInitConfig('preview_url'),
              identifier = this.data.identifier(),
              data       = {
                  identifier: identifier,
                  role: this.config.name
              };

        console.log('ko');
        console.log(this.html());
        this.html('anthoula');

        jQuery.post(url, data, function(data) {
            let html = JSON.stringify(data.content);
            console.log(typeof data);
            console.log(data);
            console.log(typeof html);
            console.log(html);
            // this.html(html);
        });

        return identifier;
    }
}
