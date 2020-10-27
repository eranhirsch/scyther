/** The precision to show proximity scores at */
const PROXIMITY_PRECISION = 1;

const TRIUMPH_TILES_DISPLAY_LABELS = {
  'Upgrades': 'UPGD',
  'Mechs': 'MECH',
  'Structures': 'BLDG',
  'Recruits': 'RECR',
  'Workers': 'WORK',
  'Objective': 'OBJC',
  'Combat Victory': 'CBAT',
  'Popularity': 'POPT',
  'Power': 'POWR',
  'Combat Cards': 'CCRD',
  'Encounters': 'ENCR',
  'Factory': 'FACT',
  'Resources': 'RSRC',
};

function renderPlayerBoard(selection) {
	
	  var lang = document.getElementById('lang').value;
  const elem = document.createElement('span');
  elem.className = 'player-board';
  elem.textContent = selection.isAutoma
    ? 'Automa:'
    : selection.playerBoard.labels[lang];
  return elem;
}

function renderFaction(selection) {
  const elem = document.createElement('span');
  var lang = document.getElementById('lang').value;
  elem.className = 'faction';
  elem.textContent = selection.faction.labels[lang].replace(' ', '\xa0');

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
  return renderInlineItemsList(mods.map(mod => ({label: mod})), label);
}

function renderInlineItemsList(items, label) {
	
  const containerElem = document.createElement('div');
  containerElem.className = 'rofMods';

  containerElem.appendChild(renderSimpleLabel(label + ':'));

  const listElem = document.createElement('ul');
  listElem.className = 'list-inline d-inline';
  listElem.append(
    ...items.sort().map(item => {
      const itemElem = document.createElement('li');
      itemElem.className =
        'list-inline-item' + (!!item.className ? ' ' + item.className : '');
      itemElem.textContent = item.label;
      return itemElem;
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
      elem.appendChild(
        renderInlineItemsList(selection.vesnaFactions, 'Factions'),
      );
    }

    if (!!selection.modifiers) {
      elem.appendChild(
        renderInlineItemsList([{label: selection.modifiers}], 'Modifiers'),
      );
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

      abilitiesElem.addEventListener('click', () => {
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
  elem.className = 'globalItem list-group-item';

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
  const wrapperElem = document.createElement('span');

  if (!!track.tiles) {
    wrapperElem.className = [
      'randomTrack',
      'regCol_' + track.distances.regular,
      'warCol_' + track.distances.war,
    ].join(' ');
    const tilesElem = document.createElement('ol');
    tilesElem.className = 'list-inline d-inline';
    tilesElem.append(
      ...track.tiles.map(tile => {
        const listElem = document.createElement('li');
        listElem.className = 'list-inline-item';
        listElem.textContent = TRIUMPH_TILES_DISPLAY_LABELS[tile];
        return listElem;
      }),
    );
    wrapperElem.appendChild(tilesElem);
  } else {
    wrapperElem.className = track.track.className + ' d-inline';
    wrapperElem.appendChild(renderSimpleLabel(track.track.name));
  }

  if (!!track.enhancement) {
    let enhancementElem = document.createElement('span');
    enhancementElem.className = 'trackEnhancement';
    enhancementElem.textContent = 'with ' + track.enhancement;
    wrapperElem.append('\x0a', enhancementElem);
  }

  return wrapperElem;
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
    ...boards.map(selection => renderBoardSelection(selection)),
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

  if (!!globals.ruleBook && globals.ruleBook.length > 0) {
    globalSection.appendChild(
      renderGlobalItem(
        '📖',
        renderSimpleLabel(globals.ruleBook.join(', '), ['ruleBook']),
      ),
    );
  }

  if (!!globals.automaModifiers) {
    globalSection.appendChild(
      renderGlobalItem(
        '🤖',
        renderSimpleLabel(globals.automaModifiers, ['ruleBook']),
      ),
    );
  }
}

function populatePlayerCountButtons() {
  var group = document.getElementById(SECTION_IDS.INPUT_FORM);
  if (group === null) {
    console.log('Missing player count button section');
  }
  group.innerHTML = '';

  const storedPlayerCount = state(state => state.playerCount || null);

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
  // TODO: replace hiding the landing page with removing it from the DOM via:
  //    document.getElementById('landingScreen').remove();
  $('#landingScreen').hide();

  $('#gameScreen').show();
    var lang = document.getElementById('lang').value;
  document.getElementById('actionButton').textContent = ACTION_BUTTON.labels[lang];

  const playerCount = getPlayerCount();
  const game = generateNewGame(playerCount);
  populateGameResults(game);
}

function showInputView() {
  $('#gameScreen').hide();
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
  state(state => {
    const selector =
      '#' + SECTION_IDS.SETTINGS_FORM + " input[type='checkbox']";
    state.settings = $(selector)
      .map((_, elem) => ({id: elem.id, checked: elem.checked}))
      .get()
      .reduce((out, elem) => {
        out[elem.id] = elem.checked;
        return out;
      }, {});
  });
}

function savePlayerCount(event) {
  state(state => {
    state.playerCount = parseInt(event.currentTarget.firstChild.value);
  });
}

function readPreviousFormState() {
  state(state => {
    Object.entries(state.settings || []).forEach(setting => {
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

  // Output rendering events events
  document.getElementById('actionButton').onclick = showOutputView;
}

function main() {
  readPreviousFormState();

  //registerServiceWorker();
  registerEventHandlers();

  // We always start with the input form!
  populatePlayerCountButtons();
  showInputView();

	document.getElementById('lang').getElementsByTagName('option')[0].selected = 'selected'
	
  // When finished loading all the components, show the view
  show();
}

window.onload = main;
