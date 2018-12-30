/** The local storage key to use for saving the settings */
const STORAGE_KEY = 'scyther_store';

function state(fn) {
  if (!window.localStorage) {
    console.log('No Local Storage');
    return;
  }

  var state = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  const ret = fn(state);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return ret;
}
