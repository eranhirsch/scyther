const SECTION_IDS = {
  GLOBAL: 'global',
  INPUT_FORM: 'input',
  INVADERS_SWITCH: 'invadersSwitch',
  PLAYERS: 'players',
  PROXIMITY_SWITCH: 'proximityCheckbox',
  RISE_OF_FENRIS_SWITCH: 'riseOfFenrisSwitch',
  ROOT: 'root',
  SETTINGS_FORM: 'settings',
  WIND_GAMBIT_SWITCH: 'windGambitSwitch',
};

const PLAYER_COUNT_GROUP_NAME = 'player_count';

function shouldIncludeInvadersBoards() {
  return document.getElementById(SECTION_IDS.INVADERS_SWITCH).checked;
}

function shouldIncludeAirships() {
  return document.getElementById(SECTION_IDS.WIND_GAMBIT_SWITCH).checked;
}

function shouldIncludeResolutions() {
  return document.getElementById(SECTION_IDS.WIND_GAMBIT_SWITCH).checked;
}

function withMechMods() {
  return document.getElementById(SECTION_IDS.RISE_OF_FENRIS_SWITCH).checked;
}

function withInfraMods() {
  return document.getElementById(SECTION_IDS.RISE_OF_FENRIS_SWITCH).checked;
}

function withAltTriumphTracks() {
  return document.getElementById(SECTION_IDS.RISE_OF_FENRIS_SWITCH).checked;
}

function shouldIncludeFenrisFactions() {
  return document.getElementById(SECTION_IDS.RISE_OF_FENRIS_SWITCH).checked;
}

function withProximityScores() {
  return document.getElementById(SECTION_IDS.PROXIMITY_SWITCH).checked;
}

function getPlayerCount() {
  var selector = "input[name='" + PLAYER_COUNT_GROUP_NAME + "']";
  var playerCount = $(selector + ':checked').val();
  return parseInt(playerCount);
}
