/** The local storage key to use for saving the settings */
const STORAGE_KEY = 'scyther_store';

function state(fn) {
  if (!window.localStorage) {
    console.log('No Local Storage');
    return;
  }

  var savedState = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
  const ret = fn(savedState);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
  return ret;
}
