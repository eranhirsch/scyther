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
  var counterClockwiseDistance =
    Object.values(DATA.factions).length - clockwiseDistance;
  var bestDistance = Math.min(clockwiseDistance, counterClockwiseDistance);

  return bestDistance;
}

function proximityScore(faction, others) {
  return others
    .map(function(other) {
      return factionDistance(faction, other.faction);
    })
    .filter(function(distance) {
      return distance > 0;
    })
    .sort()
    .reduce(function(proximity, distance, index) {
      return proximity + distance * Math.pow(0.5, index);
    }, 0);
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

function withInfraMods() {
  return document.getElementById(SECTION_IDS.RISE_OF_FENRIS_SWITCH).checked;
}

function withProximityScores() {
  return document.getElementById(SECTION_IDS.PROXIMITY_SWITCH).checked;
}

function getFactions() {
  const rawFactions = Object.values(DATA.factions);
  if (shouldIncludeInvadersBoards()) {
    return rawFactions.slice();
  }

  return rawFactions.filter(function(faction) {
    return !faction.invadersOnly;
  });
}

function getPlayerBoards() {
  const rawBoards = Object.values(DATA.playerBoards);
  if (shouldIncludeInvadersBoards()) {
    return rawBoards.slice();
  }

  return rawBoards.filter(function(board) {
    return !board.invadersOnly;
  });
}

function getInfraMods() {
  return DATA.infrastructureMods.flatMap(function(modType) {
    return Array(4).fill(modType);
  });
}

function pickBoards() {
  var factions = getFactions();
  var playerBoards = getPlayerBoards();
  var allInfraMods = getInfraMods();

  out = [];
  var playerCount = getPlayerCount();
  for (var i = 0; i < playerCount; i++) {
    var factionIdx = getIntInRange(0, factions.length - 1);
    var faction = factions[factionIdx];
    factions.splice(factionIdx, 1);

    var boardIdx = getIntInRange(0, playerBoards.length - 1);
    var board = playerBoards[boardIdx];
    playerBoards.splice(boardIdx, 1);

    var selection = {faction: faction, playerBoard: board};

    if (withInfraMods()) {
      var playerInfraMods = [];
      while (playerInfraMods.length < 4) {
        var modIdx = getIntInRange(0, allInfraMods.length - 1);
        var mod = allInfraMods[modIdx];
        if (!playerInfraMods.includes(mod)) {
          // Add mod to player
          playerInfraMods.push(mod);
          // and remove it from the general pool
          allInfraMods.splice(modIdx, 1);
        }
      }
      selection.infraMods = playerInfraMods;
    }

    const op = BAD_COMBOS.overPowered.some(function(op) {
      return op.faction === faction && op.playerBoard === board;
    });
    if (op) {
      selection.warn = 'OP';
    }

    const up = BAD_COMBOS.underPowered.some(function(up) {
      return up.faction === faction && up.playerBoard === board;
    });
    if (up) {
      selection.warn = 'UP';
    }

    out.push(selection);
  }

  if (playerCount === 1) {
    // Add a faction for the automa
    var automaFaction = pickFromArray(factions);
    out.push({faction: automaFaction, isAutoma: true});
  }

  return out;
}

function getPlayerCount() {
  var selector = "input[name='" + PLAYER_COUNT_GROUP_NAME + "']";
  var playerCount = $(selector + ':checked').val();
  return parseInt(playerCount);
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
  const elem = document.createElement('div');

  if (selection.warn) {
    elem.appendChild(renderWarning());
  }

  elem.className = selection.faction.className;
  if (selection.isAutoma) {
    elem.className += ' automa';
  }
  elem.append(renderPlayerBoard(selection), ' ', renderFaction(selection));
  return elem;
}

function renderInfraMods(infraMods) {
  const containerElem = document.createElement('div');
  containerElem.className = 'infraMods d-inline';

  containerElem.appendChild(renderIcon('🏗️'));

  const listElem = document.createElement('ul');
  listElem.className = 'list-inline d-inline';
  listElem.append(...infraMods.sort().map(function(mod) {
    const modElem = document.createElement('li');
    modElem.className = 'list-inline-item';
    modElem.textContent = mod;
    return modElem;
  }));

  containerElem.appendChild(listElem);

  return containerElem;
}

function renderProximity(proximity) {
  const elem = document.createElement('span');
  elem.className = 'proximity';
  elem.textContent =
    '\xA0(' + parseFloat(proximity).toFixed(PROXIMITY_PRECISION) + ')';
  return elem;
}

function renderWarning() {
  const elem = document.createElement('span');
  elem.textContent = '⚠️';
  return elem;
}

function renderIcon(icon) {
  var elem = document.createElement('span');
  elem.className = 'icon';
  elem.textContent = icon;
  return elem;
}

function renderBoardSelection(selection, proximity) {
  const elem = document.createElement('li');
  elem.className = 'list-group-item';

  elem.appendChild(renderBoardSelectionLabel(selection));

  if (!!selection.infraMods) {
    elem.appendChild(renderInfraMods(selection.infraMods));
  }

  if (proximity !== null) {
    elem.appendChild(renderProximity(proximity));
  }

  return elem;
}

function renderGlobalItem(icon, labelElem) {
  var elem = document.createElement('li');
  elem.className = 'list-group-item';

  elem.append(renderIcon(icon), labelElem);

  return elem;
}

function renderSimpleLabel(label = '') {
  var elem = document.createElement('span');
  elem.className = 'label';
  elem.textContent = label;
  return elem;
}

function renderAirshipLabel() {
  var elem = renderSimpleLabel();

  var passiveElem = document.createElement('span');
  passiveElem.className = 'airship-passive';
  passiveElem.textContent = pickFromArray(DATA.airshipAbilities.passive);
  elem.appendChild(passiveElem);

  elem.insertAdjacentHTML('beforeend', '&nbsp;&&nbsp;');

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

  elem.appendChild(aggressiveElem);

  return elem;
}

function renderPlayerCountButton(i, isActive) {
  var button = document.createElement('input');
  button.type = 'radio';
  button.name = PLAYER_COUNT_GROUP_NAME;
  button.value = i;
  button.checked = isActive;

  var elem = document.createElement('label');
  elem.className = 'btn btn-warning' + (isActive ? ' active' : '');
  elem.appendChild(button);
  elem.insertAdjacentHTML('beforeend', i);
  if (i === 1) {
    // Single player mode only works with an Automa player, label the button
    // clearly for that
    var automaElem = document.createElement('span');
    automaElem.className = 'automa-button';
    automaElem.textContent = '+A';
    elem.appendChild(automaElem);
  }
  elem.onclick = savePlayerCount;

  return elem;
}

function populatePlayers() {
  var playersSection = document.getElementById(SECTION_IDS.PLAYERS);
  if (playersSection === null) {
    console.log('No player section!');
    return;
  }
  // Reset previous results
  playersSection.innerHTML = '';

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

function populateGlobalSection() {
  var globalSection = document.getElementById(SECTION_IDS.GLOBAL);
  if (globalSection === null) {
    console.log('No global section!');
    return;
  }
  // Reset previous values
  globalSection.innerHTML = '';

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

function populatePlayerCountButtons() {
  var group = document.getElementById(SECTION_IDS.INPUT_FORM);
  if (group === null) {
    console.log('Missing player count button section');
  }
  group.innerHTML = '';

  const storedPlayerCount = state(function(state) {
    return state.playerCount || null;
  });
  var factions = getFactions();
  for (var i = 1; i <= factions.length; i++) {
    const isActive = Math.min(factions.length, storedPlayerCount) === i;
    group.appendChild(renderPlayerCountButton(i, isActive));
  }
}

function showOutputView() {
  // Switch views
  $('.input-phase').hide();
  $('.output-phase').show();

  // Render new values
  populatePlayers();
  populateGlobalSection();
}

function showInputView() {
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
    const selector =
      '#' + SECTION_IDS.SETTINGS_FORM + " input[type='checkbox']";
    state.settings = $(selector)
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

function readPreviousFormState() {
  state(function(state) {
    Object.entries(state.settings || []).forEach(function(setting) {
      const elem = document.getElementById(setting[0]);
      if (elem) {
        elem.checked = setting[1];
      }
    });
  });
}

function registerEventHandlers() {
  // Settings (input) form events
  var settings = document.getElementById(SECTION_IDS.SETTINGS_FORM);
  settings.addEventListener('change', saveSettings);
  settings.addEventListener('change', populatePlayerCountButtons);

  document.getElementById('close').onclick = showInputView;

  // Output rendering events events
  document.getElementById('actionButton').onclick = showOutputView;
}

function main() {
  readPreviousFormState();

  registerServiceWorker();
  registerEventHandlers();

  // We always start with the input form!
  populatePlayerCountButtons();
  showInputView();

  // When finished loading all the components, show the view
  show();
}

window.onload = main;
