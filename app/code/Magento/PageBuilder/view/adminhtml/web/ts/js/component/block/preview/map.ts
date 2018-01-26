/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import "mage/backend/tabs";
import Block from "./block";

export default class Map extends Block {
    private element: Element;
    private getMapUrl: KnockoutComputed<string>;

    constructor(parent: Block, config: object) {
        super(parent, config);

        // Declare position as it uses a container
        this.data.position = ko.observable("");

        // We need to compute the maps URL from the position
        this.getMapUrl = ko.computed(() => {
            const [lat, lng, zoom] = this.data.position().split(",");
            return "https://www.google.com/maps/embed/v1/place?q=" + lat
                + "," + lng + "&zoom=" + zoom + "&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw";
        });
    }
}
