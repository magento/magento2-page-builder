export default class Search {
    items: Array<string>

    constructor(items:Array<any>) {
        this.items = items;
    }
    
    filter(keyword: string): Array<string> {
        if (keyword.length === 0) {
            return [];
        }

        return this.items.filter(
            (item) => {
                if (item.indexOf(keyword) === 0) {
                    return true;
                }
                const words = item.split(/\s+/);
                const wordsMatch = words.filter((word) => word.indexOf(keyword) === 0);
                return wordsMatch.length > 0;
            }
        );
    }
}
