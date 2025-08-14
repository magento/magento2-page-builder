/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

interface MapUtilityInterface {
    map: any;
    markers: [any];

    onUpdate(newMarkers: [any], updateOptions: object): void;
    setMarkers(newMarkers: object): void;
}

type MapUtilityConstructorInterface = new(element: Element, markers: [any], additionalOptions: object)
    => MapUtilityInterface;

declare var mapUtilityConstructor: MapUtilityConstructorInterface;
declare module "Magento_PageBuilder/js/utils/map" {
    export = mapUtilityConstructor;
}
