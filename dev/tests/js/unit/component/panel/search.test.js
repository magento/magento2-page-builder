const searchAlgorithm = require('component/stage/panel/search');

const search = new searchAlgorithm([
    'test 1', 'test 2', 'test 3', 'complex string one', 'complex string two', 'espan~ol', 'mines'
]);

test('if keyword is empty, then no match is returned', function () {
    expect(search.filter('')).toEqual([]);
});

test('if keyword is matching one item it must return this item', function () {
    expect(search.filter('test 1')).toEqual(['test 1']);
});

test('if keyword is matching more than one item, then it returns back all items matching a keyword', function () {
    expect(search.filter('test')).toEqual(['test 1', 'test 2', 'test 3']);
});

test('if keyword matches begging of the word in the middle of the string', function () {
    expect(search.filter('str')).toEqual(['complex string one', 'complex string two']);
});

test('if keyword should only match begging of the word', function () {
    expect(search.filter('es')).toEqual(['espan~ol']);
});

