define([], function () {
  /**
   * Create a mapping of strings to booleans
   *
   * @param array
   * @returns {DataObject}
   */
  function toDataObject(array) {
    return array.reduce(function (acc, next) {
      acc[next] = true;
      return acc;
    }, {});
  }
  /**
   * Filters attributes in a DataObject
   *
   * @param data
   * @param attributes
   * @returns {DataObject}
   */


  function filterAttributes(data, attributes) {
    var result = {};

    for (var key in data) {
      if (attributes[key]) {
        result[key] = data[key];
      }
    }

    return result;
  }

  return {
    toDataObject: toDataObject,
    filterAttributes: filterAttributes
  };
});
//# sourceMappingURL=data-object.js.map
