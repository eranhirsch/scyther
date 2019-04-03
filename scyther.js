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

const HOME_BASES_ON_BOARD = 7; // This doesn't change with expansions!

function multiply(list, multiplier) {
  return list.flatMap(function(item) {
    return Array(multiplier).fill(item);
  });
}

function getIntInRange(from, to) {
  return from + Math.floor(Math.random() * (to - from + 1));
}

function extractFromPool(pool, amount = 1, filter = null) {
  var result = [];
  while (result.length < amount) {
    var idx = getIntInRange(0, pool.length - 1);
    var item = pool[idx];
    if (!result.includes(item) && (filter === null || filter(item))) {
      // Add item to result
      result.push(item);
      // and remove it from the general pool
      pool.splice(idx, 1);
    }
  }
  return result;
}

function pickFromArray(array) {
  // We need to copy the array before we extract from it otherwise we wouldn't
  // be able to reshuffle the results later on...
  return extractFromPool(array.slice())[0];
}

function factionDistance(a, b) {
  var biggerLocation = Math.max(a.location, b.location);
  var smallerLocation = Math.min(a.location, b.location);

  var clockwiseDistance = biggerLocation - smallerLocation;
  var counterClockwiseDistance = HOME_BASES_ON_BOARD - clockwiseDistance;
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

function getFactions() {
  let factions = Object.values(BASE.factions).slice();

  if (shouldIncludeInvadersBoards()) {
    factions = factions.concat(Object.values(INVADERS_FROM_AFAR.factions));
  }

  if (shouldIncludeFenrisFactions()) {
    factions = factions.concat(Object.values(RISE_OF_FENRIS.factions));
  }

  return factions;
}

function getPlayerBoards() {
  const baseBoards = Object.values(BASE.playerBoards);
  if (!shouldIncludeInvadersBoards()) {
    return baseBoards.slice();
  }

  return baseBoards.concat(Object.values(INVADERS_FROM_AFAR.playerBoards));
}

function getMechMods() {
  return multiply(RISE_OF_FENRIS.mechMods.generic, 3).concat(
    multiply(Object.keys(RISE_OF_FENRIS.mechMods.factionSpecific), 2),
  );
}

function getInfraMods() {
  return multiply(RISE_OF_FENRIS.infrastructureMods, 4);
}

function pickBoards() {
  var factions = getFactions();
  var playerBoards = getPlayerBoards();
  var allMechMods = getMechMods();
  var allInfraMods = getInfraMods();

  out = [];
  var playerCount = getPlayerCount();
  for (var i = 0; i < playerCount; i++) {
    const selection = {};

    selection.faction = extractFromPool(factions)[0];
    if (!selection.faction.location) {
      // Some factions don't have a persistant home-base (Fenris, Vesna). They
      // use a home-base drawn randomly from the remaining bases.
      selection.homeBaseFaction = extractFromPool(factions, 1, function(
        faction,
      ) {
        // We want to make sure the faction we choose has a homebase
        return !!faction.location;
      })[0];
    }

    // Vesna has a unique set up that requires picking random components too!
    const vesnaMechAbilities = RISE_OF_FENRIS.factions.VESNA.mechAbilities.slice();
    if (selection.faction === RISE_OF_FENRIS.factions.VESNA) {
      selection.mechAbilities = extractFromPool(vesnaMechAbilities, 6);
    }

    selection.playerBoard = extractFromPool(playerBoards)[0];

    if (withMechMods()) {
      selection.mechMods = extractFromPool(allMechMods, 4, function(mod) {
        return (
          RISE_OF_FENRIS.mechMods.factionSpecific[mod] !== selection.faction
        );
      });

      if (selection.faction === RISE_OF_FENRIS.factions.VESNA) {
        // When playing with mech mods, Vesna's mech abilities might clash with
        // the mods selected by the player. In those cases we will need to draw
        // additional mods so that the player still has 6 to choose from.

        const clashes = selection.mechMods.filter(function(mod) {
          return selection.mechAbilities.includes(mod);
        }).length;

        let altAbilities = extractFromPool(
          vesnaMechAbilities,
          // The player can only select 2 mech mods, so we only need to replace
          // up to 2 mods.
          Math.min(clashes, 2),
        );

        // Add a visual clue to the alt abilities
        altAbilities = altAbilities.map(function(ability) {
          return '(' + ability + ')';
        });

        selection.mechAbilities = selection.mechAbilities.concat(altAbilities);
      }
    }

    if (withInfraMods()) {
      selection.infraMods = extractFromPool(allInfraMods, 4);
    }

    const op = BAD_COMBOS.some(function(op) {
      return (
        op.faction === selection.faction &&
        op.playerBoard === selection.playerBoard
      );
    });
    if (op) {
      selection.warn = 'OP';
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

  const homeBaseFaction = selection.homeBaseFaction;
  if (homeBaseFaction) {
    const homeBaseElem = document.createElement('span');
    homeBaseElem.className = 'altHomeBase ' + homeBaseFaction.className;
    homeBaseElem.textContent = '(' + homeBaseFaction.shortName + ')';
    elem.appendChild(homeBaseElem);
  }

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

function renderMods(mods, label) {
  const containerElem = document.createElement('div');
  containerElem.className = 'rofMods';

  containerElem.appendChild(renderSimpleLabel(label + ':'));

  const listElem = document.createElement('ul');
  listElem.className = 'list-inline d-inline';
  listElem.append(
    ...mods.sort().map(function(mod) {
      const modElem = document.createElement('li');
      modElem.className = 'list-inline-item';
      modElem.textContent = mod;
      return modElem;
    }),
  );

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

  if (!!selection.mechMods) {
    elem.appendChild(renderMods(selection.mechMods, 'Mech'));
  }

  if (!!selection.mechAbilities) {
    let vesnaElem = renderMods(
      selection.mechAbilities,
      selection.faction.shortName,
    );
    vesnaElem.className += ' ' + selection.faction.className;
    elem.appendChild(vesnaElem);
  }

  if (!!selection.infraMods) {
    elem.appendChild(renderMods(selection.infraMods, 'Infra'));
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

function renderSimpleLabel(label = '', classNames = []) {
  var elem = document.createElement('span');
  elem.className = ['label'].concat(classNames).join(' ');
  elem.textContent = label;
  return elem;
}

function renderAirshipLabel() {
  var elem = renderSimpleLabel();

  var passiveElem = document.createElement('span');
  passiveElem.className = 'airship-passive';
  passiveElem.textContent = pickFromArray(WIND_GAMBIT.airshipAbilities.passive);
  elem.appendChild(passiveElem);

  elem.insertAdjacentHTML('beforeend', '&nbsp;&&nbsp;');

  var aggressive = WIND_GAMBIT.airshipAbilities.aggressive;
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

function renderTriumphTrackLabel() {
  const track = pickFromArray(RISE_OF_FENRIS.triumphTracks);

  let elem = renderSimpleLabel(
    track.name,
    track.className ? [track.className] : [],
  );

  const enhancement = pickFromArray(track.enhancements.concat(['']));
  if (enhancement) {
    let enhancementElem = document.createElement('span');
    enhancementElem.className = 'trackEnhancement';
    enhancementElem.textContent = ' with ' + enhancement;
    elem.appendChild(enhancementElem);
  }

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
        withProximityScores()
          ? proximityScore(selection.faction, boards)
          : null,
      );
    }),
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
      renderSimpleLabel(pickFromArray(BASE.buildingBonuses)),
    ),
  );
  if (shouldIncludeResolutions()) {
    globalSection.appendChild(
      renderGlobalItem(
        '🏆',
        renderSimpleLabel(pickFromArray(WIND_GAMBIT.resolutions)),
      ),
    );
  }
  if (shouldIncludeAirships()) {
    globalSection.appendChild(renderGlobalItem('🚢', renderAirshipLabel()));
  }

  if (withAltTriumphTracks()) {
    globalSection.appendChild(
      renderGlobalItem('⭐', renderTriumphTrackLabel()),
    );
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
  for (var i = 1; i <= Math.min(factions.length, HOME_BASES_ON_BOARD); i++) {
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
