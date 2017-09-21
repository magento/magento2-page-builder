import Block from "../block";

export default class PreviewBlock {
    template: string = '';
    parent: Block;
    config: any;

    constructor(parent: Block, config: object) {

        this.parent = parent;
        this.config = config;
    }
}