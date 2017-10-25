import requireJs from 'require';

export default function load(dependencies: string[], factory: Function, onError?: Function) {
    requireJs(dependencies, factory, onError);
}
