const SECTION_IDS = {
  ROOT: 'root',
  GLOBAL: 'global',
  PLAYERS: 'players',
  INPUT_FORM: 'input',
  INVADERS_SWITCH: 'invadersSwitch',
  WIND_GAMBIT_SWITCH: 'windGambitSwitch',
  PROXIMITY_SWITCH: 'proximityCheckbox',
  SETTINGS_FORM: 'settings',
};

const ELEMENT_CLASSES = {
  INPUT_BUTTON: 'btn btn-danger border',
  BOARD_SELECTION: 'list-group-item',
  GLOBAL_ITEM: 'list-group-item',
};

const PLAYER_COUNT_GROUP_NAME = 'player_count';

/** The precision to show proximity scores at */
const PROXIMITY_PRECISION = 1;

function getIntInRange(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}

function pickFromArray(array) {
  return array[getIntInRange(0, array.length - 1)];
}

function factionDistance(a, b) {
  var biggerLocation = Math.max(a.location, b.location);
  var smallerLocation = Math.min(a.location, b.location);

  var clockwiseDistance = biggerLocation - smallerLocation;
  var counterClockwiseDistance = DATA.factions.length - clockwiseDistance;
  var bestDistance = Math.min(clockwiseDistance, counterClockwiseDistance);

  return bestDistance;
}

function proximityScore(faction, others) {
  return Math.sqrt(
    others
      .map(function(other) {
        return factionDistance(faction, other.faction);
      })
      .map(function(distance) {
        return Math.pow(distance, 2);
      })
      .reduce(function(accumulator, currVal) {
        return accumulator + currVal;
      }) /
      (others.length - 1)
  );
}

function shouldIncludeInvadersBoards() {
  return document.getElementById(SECTION_IDS.INVADERS_SWITCH).checked;
}

function shouldIncludeAirships() {
  return document.getElementById(SECTION_IDS.WIND_GAMBIT_SWITCH).checked;
}

function shouldIncludeResolutions() {
  return document.getElementById(SECTION_IDS.WIND_GAMBIT_SWITCH).checked;
}

function withProximityScores() {
  return document.getElementById(SECTION_IDS.PROXIMITY_SWITCH).checked;
}

function getFactions() {
  if (shouldIncludeInvadersBoards()) {
    return DATA.factions.slice();
  }

  return DATA.factions.filter(function(faction) {
    return !faction.invadersOnly;
  });
}

function getPlayerBoards() {
  if (shouldIncludeInvadersBoards()) {
    return DATA.playerBoards.slice();
  }

  return DATA.playerBoards.filter(function(board) {
    return !board.invadersOnly;
  });
}

function pickBoards() {
  var factions = getFactions();
  var playerBoards = getPlayerBoards();

  out = [];
  var playerCount = getPlayerCount();
  for (var i = 0; i < playerCount; i++) {
    var factionIdx = getIntInRange(0, factions.length - 1);
    var faction = factions[factionIdx];
    factions.splice(factionIdx, 1);

    var boardIdx = getIntInRange(0, playerBoards.length - 1);
    var board = playerBoards[boardIdx];
    playerBoards.splice(boardIdx, 1);

    out.push({faction: faction, playerBoard: board});
  }

  if (playerCount === 1) {
    // Add a faction for the automa
    var automaFaction = pickFromArray(factions);
    out.push({faction: automaFaction, isAutoma: true});
  }

  return out;
}

function renderPlayerBoard(selection) {
  const elem = document.createElement('span');
  elem.className = 'player-board';
  elem.textContent = selection.isAutoma
    ? 'Automa:'
    : selection.playerBoard.label;
  return elem;
}

function renderFaction(selection) {
  const elem = document.createElement('span');
  elem.className = 'faction';
  elem.textContent = selection.faction.label.replace(' ', '\xa0');
  return elem;
}

function renderBoardSelectionLabel(selection) {
  const elem = document.createElement('span');
  elem.className = selection.faction.className;
  if (selection.isAutoma) {
    elem.className += ' automa';
  }
  elem.append(renderPlayerBoard(selection), ' ', renderFaction(selection));
  return elem;
}

function renderProximity(proximity) {
  const proximityElem = document.createElement('span');
  proximityElem.className = 'proximity';
  proximityElem.textContent =
    '\xA0(' + parseFloat(proximity).toFixed(PROXIMITY_PRECISION) + ')';
  return proximityElem;
}

function renderBoardSelection(boardSelection, proximity) {
  const item = document.createElement('li');
  item.className = ELEMENT_CLASSES.BOARD_SELECTION;
  item.appendChild(renderBoardSelectionLabel(boardSelection));
  if (proximity !== null) {
    item.appendChild(renderProximity(proximity));
  }
  return item;
}

function getPlayerCount() {
  var selector = "input[name='" + PLAYER_COUNT_GROUP_NAME + "']";
  var playerCount = $(selector + ':checked').val();
  return parseInt(playerCount);
}

function renderBoards() {
  var playersSection = document.getElementById(SECTION_IDS.PLAYERS);
  if (playersSection === null) {
    console.log('No player section!');
    return;
  }

  var boards = pickBoards();
  playersSection.append(
    ...boards.map(function(selection) {
      return renderBoardSelection(
        selection,
        withProximityScores() ? proximityScore(selection.faction, boards) : null
      );
    })
  );
}

function renderGlobalItem(icon, labelElem) {
  var itemElem = document.createElement('li');
  itemElem.className = ELEMENT_CLASSES.GLOBAL_ITEM;

  var iconElem = document.createElement('span');
  iconElem.className = 'icon';
  iconElem.textContent = icon;
  itemElem.appendChild(iconElem);
  itemElem.appendChild(labelElem);

  return itemElem;
}

function renderSimpleLabel(label = '') {
  var labelElem = document.createElement('span');
  labelElem.className = 'label';
  labelElem.textContent = label;
  return labelElem;
}

function renderAirshipLabel() {
  var labelElem = renderSimpleLabel();

  var passiveElem = document.createElement('span');
  passiveElem.className = 'airship-passive';
  passiveElem.textContent = pickFromArray(DATA.airshipAbilities.passive);
  labelElem.appendChild(passiveElem);

  labelElem.insertAdjacentHTML('beforeend', '&nbsp;&&nbsp;');

  var aggressive = DATA.airshipAbilities.aggressive;
  if (getPlayerCount() === 1) {
    // Some aggressive abilities aren't supported by the automa
    aggressive = aggressive.filter(function(ability) {
      return ability.supportedByAutoma;
    });
  }

  var aggressiveElem = document.createElement('span');
  aggressiveElem.className = 'airship-aggressive';
  aggressiveElem.textContent = pickFromArray(aggressive).label;

  labelElem.appendChild(aggressiveElem);

  return labelElem;
}

function renderGlobalSection() {
  var globalSection = document.getElementById(SECTION_IDS.GLOBAL);
  if (globalSection === null) {
    console.log('No global section!');
    return;
  }

  globalSection.appendChild(
    renderGlobalItem(
      '🏠',
      renderSimpleLabel(pickFromArray(DATA.buildingBonuses))
    )
  );
  if (shouldIncludeResolutions()) {
    globalSection.appendChild(
      renderGlobalItem('🏆', renderSimpleLabel(pickFromArray(DATA.resolutions)))
    );
  }
  if (shouldIncludeAirships()) {
    globalSection.appendChild(renderGlobalItem('🚢', renderAirshipLabel()));
  }
}

function renderPlayerCountButton(i, isActive) {
  var button = document.createElement('input');
  button.type = 'radio';
  button.name = PLAYER_COUNT_GROUP_NAME;
  button.value = i;
  button.checked = isActive;

  var buttonLabel = document.createElement('label');
  buttonLabel.className =
    ELEMENT_CLASSES.INPUT_BUTTON + (isActive ? ' active' : '');
  buttonLabel.appendChild(button);
  buttonLabel.insertAdjacentHTML('beforeend', i);
  if (i === 1) {
    // Single player mode only works with an Automa player, label the button
    // clearly for that
    buttonLabel.insertAdjacentHTML('beforeend', '+A');
  }
  buttonLabel.onclick = savePlayerCount;

  return buttonLabel;
}

function renderPlayerCountButtons() {
  var group = document.getElementById(SECTION_IDS.INPUT_FORM);
  group.innerHTML = '';

  const storedPlayerCount = state(function(state) {
    return state.playerCount || null;
  });
  var factions = getFactions();
  for (var i = 1; i <= factions.length; i++) {
    group.appendChild(renderPlayerCountButton(i, storedPlayerCount === i));
  }
}

function renderOutput() {
  // Switch views
  $('.input-phase').hide();
  $('.output-phase').show();

  // Reset previous values
  document.getElementById(SECTION_IDS.GLOBAL).innerHTML = '';
  document.getElementById(SECTION_IDS.PLAYERS).innerHTML = '';

  // Render new values
  renderBoards();
  renderGlobalSection();
}

function switchToInputForm() {
  $('.input-phase').show();
  $('.output-phase').hide();
}

function show() {
  var root = document.getElementById(SECTION_IDS.ROOT);
  root.className = root.className.replace(/hide-all/, '');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
}

function saveSettings() {
  state(function(state) {
    state.settings = $(
      '#' + SECTION_IDS.SETTINGS_FORM + " input[type='checkbox']"
    )
      .map(function(_, elem) {
        return {id: elem.id, checked: elem.checked};
      })
      .get()
      .reduce(function(out, elem) {
        out[elem.id] = elem.checked;
        return out;
      }, {});
  });
}

function savePlayerCount(event) {
  state(function(state) {
    state.playerCount = parseInt(event.currentTarget.firstChild.value);
  });
}

function updateSettingsStateFromStorage() {
  state(function(state) {
    Object.entries(state.settings || []).forEach(function(setting) {
      document.getElementById(setting[0]).checked = setting[1];
    });
  });
}

function registerEventHandlers() {
  // Settings (input) form events
  var settings = document.getElementById(SECTION_IDS.SETTINGS_FORM);
  settings.addEventListener('change', saveSettings);
  settings.addEventListener('change', renderPlayerCountButtons);

  document.getElementById('close').onclick = switchToInputForm;

  // Output rendering events events
  document.getElementById('actionButton').onclick = renderOutput;
}

function main() {
  updateSettingsStateFromStorage();

  registerServiceWorker();
  registerEventHandlers();

  // We always start with the input form!
  renderPlayerCountButtons();
  switchToInputForm();

  // When finished loading all the components, show the view
  show();
}

window.onload = main;
