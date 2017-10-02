export interface EventEmitterInterface {
    emit: Function;
    addListener: Function;
    on: Function;
    removeListener: Function;
    off: Function;
    once: Function;
}