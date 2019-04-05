/** The precision to show proximity scores at */
const PROXIMITY_PRECISION = 1;

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
    homeBaseElem.textContent = '➔ ' + homeBaseFaction.shortName;
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

function renderBoardSelection(selection) {
  const elem = document.createElement('li');
  elem.className = 'list-group-item';

  elem.appendChild(renderBoardSelectionLabel(selection));

  if (!!selection.mechMods) {
    elem.appendChild(renderMods(selection.mechMods, 'Mech'));
  }

  if (selection.isAutoma) {
    if (!!selection.vesnaFactions) {
      // TODO: This is ugly, i need to merge this with the rendering logic for
      // the renderMods
      const factionsElem = document.createElement('div');
      factionsElem.className = 'rofMods';
      factionsElem.appendChild(renderSimpleLabel('Factions:'));
      const listElem = document.createElement('ul');
      listElem.className = 'list-inline d-inline';
      listElem.append(
        ...selection.vesnaFactions.map(function(faction) {
          const elem = document.createElement('li');
          elem.className = faction.className + ' list-inline-item';
          elem.textContent = faction.shortName;
          return elem;
        }),
      );
      factionsElem.appendChild(listElem);
      elem.appendChild(factionsElem);
    }

    if (!!selection.modifiers) {
      // We're faking it as a mod so that it renders in the same way...
      elem.appendChild(renderMods([selection.modifiers], 'Modifiers'));
    }
  }

  if (!!selection.mechAbilities) {
    let abilitiesElem = renderMods(
      selection.mechAbilities,
      selection.faction.shortName,
    );
    abilitiesElem.className += ' ' + selection.faction.className;

    if (!!selection.mechMods) {
      const hiddenHTML = abilitiesElem.innerHTML;
      const hiddenClassName = abilitiesElem.className;

      abilitiesElem.textContent = 'Click here to reveal mech abilities';
      abilitiesElem.className += ' revealCTA';

      abilitiesElem.addEventListener('click', function() {
        this.className = hiddenClassName;
        this.innerHTML = hiddenHTML;
      });
    }

    elem.appendChild(abilitiesElem);
  }

  if (!!selection.infraMods) {
    elem.appendChild(renderMods(selection.infraMods, 'Infra'));
  }

  if (!!selection.proximity) {
    elem.appendChild(renderProximity(selection.proximity));
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

function renderAirshipLabel(airships) {
  var elem = renderSimpleLabel();

  var passiveElem = document.createElement('span');
  passiveElem.className = 'airship-passive';
  passiveElem.textContent = airships.passive;
  elem.appendChild(passiveElem);

  elem.insertAdjacentHTML('beforeend', '&nbsp;&&nbsp;');

  var aggressiveElem = document.createElement('span');
  aggressiveElem.className = 'airship-aggressive';
  aggressiveElem.textContent = airships.aggressive;

  elem.appendChild(aggressiveElem);

  return elem;
}

function renderTriumphTrackLabel(track) {
  let elem = renderSimpleLabel(
    track.track.name,
    track.track.className ? [track.track.className] : [],
  );

  if (!!track.enhancement) {
    let enhancementElem = document.createElement('span');
    enhancementElem.className = 'trackEnhancement';
    enhancementElem.textContent = ' with ' + track.enhancement;
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

function populatePlayers(boards) {
  var playersSection = document.getElementById(SECTION_IDS.PLAYERS);
  if (playersSection === null) {
    console.log('No player section!');
    return;
  }
  // Reset previous results
  playersSection.innerHTML = '';
  playersSection.append(
    ...boards.map(function(selection) {
      return renderBoardSelection(selection);
    }),
  );
}

function populateGlobalSection(globals) {
  var globalSection = document.getElementById(SECTION_IDS.GLOBAL);
  if (globalSection === null) {
    console.log('No global section!');
    return;
  }

  // Reset previous values
  globalSection.innerHTML = '';

  globalSection.appendChild(
    renderGlobalItem('🏠', renderSimpleLabel(globals.buildingBonus)),
  );

  if (!!globals.resolution) {
    globalSection.appendChild(
      renderGlobalItem('🏆', renderSimpleLabel(globals.resolution)),
    );
  }

  if (!!globals.airships) {
    globalSection.appendChild(
      renderGlobalItem('🚢', renderAirshipLabel(globals.airships)),
    );
  }

  if (!!globals.triumphTrack) {
    globalSection.appendChild(
      renderGlobalItem('⭐', renderTriumphTrackLabel(globals.triumphTrack)),
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

  let factionsCount = HOME_BASES_ON_BOARD;
  if (!shouldIncludeInvadersBoards() && !shouldIncludeFenrisFactions()) {
    factionsCount -= 2;
  }

  for (var i = 1; i <= factionsCount; i++) {
    const isActive = Math.min(factionsCount, storedPlayerCount) === i;
    group.appendChild(renderPlayerCountButton(i, isActive));
  }
}

function populateGameResults(game) {
  populatePlayers(game.players);
  populateGlobalSection(game.globals);
}

function showOutputView() {
  // Switch views
  $('.input-phase').hide();
  $('.output-phase').show();

  const playerCount = getPlayerCount();
  const game = generateNewGame(playerCount);
  populateGameResults(game);
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
