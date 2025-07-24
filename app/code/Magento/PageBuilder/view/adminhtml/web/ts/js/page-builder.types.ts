/**
 * Copyright 2019 Adobe
 * All Rights Reserved.
 */

import Panel from "./panel";
import Stage from "./stage";

export default interface PageBuilderInterface  {
    template: string;
    panel: Panel;
    stage: Stage;
    isStageReady: KnockoutObservable<boolean>;
    config: object;
    initialValue: string;
    id: string;
    originalScrollTop: number;
    isFullScreen: KnockoutObservable<boolean>;
    loading: KnockoutObservable<boolean>;
    wrapperStyles: KnockoutObservable<{[key: string]: string}>;
}
