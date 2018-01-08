/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import Block from "./block";
import ko from "knockout";
import $ from "jquery";
import _ from "underscore";
import "mage/backend/tabs";
'use strict';

export default class Map extends Block {
    element: Element;
    getMapUrl: KnockoutComputed<string>;

    constructor(parent: Block, config: object) {
        super(parent, config);

        // Declare position as it uses a container
        this.data.position = ko.observable('');

        // We need to compute the maps URL from the position
        this.getMapUrl = ko.computed(() => {
            const [lat, lng, zoom] = this.data.position().split(',');
            return 'https://www.google.com/maps/embed/v1/place?q=' + lat + ',' + lng + '&zoom=' + zoom + '&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw';
        });
    }
}
