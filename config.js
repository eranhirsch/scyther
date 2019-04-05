const EXPANSIONS = {
  INAVADERS: 'Invaders from Afar',
  WG: 'The Wind Gambit',
  ROF: 'The Rise of Fenris',
};

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

function hasExpansion(expansion) {
  switch (expansion) {
    case EXPANSIONS.INVADERS:
      return document.getElementById(SECTION_IDS.INVADERS_SWITCH).checked;
    case EXPANSIONS.WG:
      return document.getElementById(SECTION_IDS.WIND_GAMBIT_SWITCH).checked;
    case EXPANSIONS.ROF:
      return document.getElementById(SECTION_IDS.RISE_OF_FENRIS_SWITCH).checked;
  }
  throw new Exception('Unknown expansion: ' + expansion);
}

function shouldIncludeInvadersBoards() {
  return hasExpansion(EXPANSIONS.INVADERS);
}

function shouldIncludeAirships() {
  return hasExpansion(EXPANSIONS.WG);
}

function shouldIncludeResolutions() {
  return hasExpansion(EXPANSIONS.WG);
}

function withMechMods() {
  return hasExpansion(EXPANSIONS.ROF);
}

function withInfraMods() {
  return hasExpansion(EXPANSIONS.ROF);
}

function withAltTriumphTracks() {
  return hasExpansion(EXPANSIONS.ROF);
}

function shouldIncludeFenrisFactions() {
  return hasExpansion(EXPANSIONS.ROF);
}

function withProximityScores() {
  return document.getElementById(SECTION_IDS.PROXIMITY_SWITCH).checked;
}

function getPlayerCount() {
  var selector = "input[name='" + PLAYER_COUNT_GROUP_NAME + "']";
  var playerCount = $(selector + ':checked').val();
  return parseInt(playerCount);
}
