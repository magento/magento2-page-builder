/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import "mage/backend/tabs";
import PreviewBlock from "./block";

export default class Map extends PreviewBlock {
    public getMapUrl: KnockoutComputed<string> = ko.computed(() => {
        let url = "https://www.google.com/maps/embed/v1/";
        let lat = 30.2672;
        let lng = -97.7431;
        let zoom = 8;
        const position = this.data.position();

        if (!position) {
            url += "view?center=";
        } else {
            [lat, lng, zoom] = position.split(",");
            url += "place?q=";
        }

        return url + lat + "," + lng + "&zoom=" + zoom + "&key=AIzaSyCw10cOO31cpxb2bcwnHPHKtxov8oUbxJw";
    });
    private element: Element;

    /**
     * Setup fields observables within the data class property
     */
    protected setupDataFields() {
        super.setupDataFields();

        // Declare our buttons, they'll get populated later
        this.updateDataValue("position", "");
    }
}
