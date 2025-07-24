/**
 * Copyright 2018 Adobe
 * All Rights Reserved.
 */

export default function load(
    dependencies: string[],
    factory: (...results: any[]) => void,
    onError?: (error: Error) => void,
) {
    require(dependencies, factory, onError);
}
