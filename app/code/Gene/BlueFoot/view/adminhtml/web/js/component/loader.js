define(["require"], function (_require) {
  function load(dependencies, factory, onError) {
    (0, _require)(dependencies, factory, onError);
  }

  return load;
});