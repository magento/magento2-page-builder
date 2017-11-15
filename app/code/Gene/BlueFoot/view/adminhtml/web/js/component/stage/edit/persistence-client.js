define([], function () {
  /**
   * PersistenceClient
   *
   * Acts as the data provider client between our system and the UI component system
   */
  var PersistenceClient =
  /*#__PURE__*/
  function () {
    /**
     * @param {ModalComponent} modal
     * @param {DataStore} store
     * @param {string} id
     */
    function PersistenceClient(modal, store, id) {
      this.modal = void 0;
      this.store = void 0;
      this.id = void 0;
      this.modal = modal;
      this.store = store;
      this.id = id;
    }
    /**
     * Save any data which has been modified in the edit panel
     *
     * @param data
     * @param options
     */


    var _proto = PersistenceClient.prototype;

    _proto.save = function save(data, options) {
      this.store.update(this.id, data);
      this.modal.closeModal();
    };

    return PersistenceClient;
  }();

  return PersistenceClient;
});
//# sourceMappingURL=persistence-client.js.map
