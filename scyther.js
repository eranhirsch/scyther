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
  INPUT_BUTTON: 'btn btn-danger btn-lg',
  BOARD_SELECTION: 'list-group-item',
  GLOBAL_ITEM: 'list-group-item',
};

const PLAYER_COUNT_GROUP_NAME = 'player_count';

const STORAGE_KEY = 'scyther_store';

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
  return (
    others
      .map(function(other) {
        return factionDistance(faction, other.faction);
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
  for (var i = 0; i < getPlayerCount(); i++) {
    var factionIdx = getIntInRange(0, factions.length - 1);
    var faction = factions[factionIdx];
    factions.splice(factionIdx, 1);

    var boardIdx = getIntInRange(0, playerBoards.length - 1);
    var board = playerBoards[boardIdx];
    playerBoards.splice(boardIdx, 1);

    out.push({faction: faction, playerBoard: board});
  }
  return out;
}

function renderBoardSelection(boardSelection, proximity) {
  const item = document.createElement('li');
  item.className = ELEMENT_CLASSES.BOARD_SELECTION;

  const labelElem = document.createElement('span');
  labelElem.textContent =
    boardSelection.playerBoard.label + ' ' + boardSelection.faction.label;
  labelElem.className = boardSelection.faction.className;
  item.appendChild(labelElem);

  if (!!proximity) {
    const proximityElem = document.createElement('span');
    proximityElem.className = 'proximity';
    proximityElem.textContent =
      '\xA0(' + parseFloat(proximity).toFixed(1) + ')';
    item.appendChild(proximityElem);
  }

  return item;
}

function getPlayerCount() {
  var selector = "input[name='" + PLAYER_COUNT_GROUP_NAME + "']";
  return $(selector + ':active').val() || $(select + ':checked').val();
}

function renderBoards() {
  var playersSection = document.getElementById(SECTION_IDS.PLAYERS);
  if (playersSection === null) {
    console.log('No player section!');
    return;
  }

  var boards = pickBoards();

  boards.forEach(function(selection) {
    var proximity = withProximityScores()
      ? proximityScore(selection.faction, boards)
      : null;
    playersSection.appendChild(renderBoardSelection(selection, proximity));
  });
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

  var aggressiveElem = document.createElement('span');
  aggressiveElem.className = 'airship-aggressive';
  aggressiveElem.textContent = pickFromArray(DATA.airshipAbilities.aggressive);
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

function renderButtons() {
  var group = document.getElementById(SECTION_IDS.INPUT_FORM);
  group.innerHTML = '';
  group.onclick = function(event) {
    $('.input-phase').hide();
    $('.output-phase').show();
    renderOutput();
  };

  if (group.children.length > 0) {
    // already has buttons;
    return;
  }

  // No need for an entry for 1 (the automa requires 2 factions)
  var factions = getFactions();
  for (var i = 2; i <= factions.length; i++) {
    var button = document.createElement('input');
    button.type = 'radio';
    button.name = PLAYER_COUNT_GROUP_NAME;
    button.value = i;

    var buttonLabel = document.createElement('label');
    buttonLabel.className = ELEMENT_CLASSES.INPUT_BUTTON;
    buttonLabel.appendChild(button);
    buttonLabel.insertAdjacentHTML('beforeend', i);

    group.appendChild(buttonLabel);
  }
}

function resetOutputView() {
  document.getElementById(SECTION_IDS.GLOBAL).innerHTML = '';
  document.getElementById(SECTION_IDS.PLAYERS).innerHTML = '';
}

function renderOutput() {
  resetOutputView();
  renderBoards();
  renderGlobalSection();
}

function renderInputForm() {
  $('.input-phase').show();
  $('.output-phase').hide();
  renderButtons();
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
  if (!window.localStorage) {
    console.log('No Local Storage');
    return;
  }

  var formState = $('#' + SECTION_IDS.SETTINGS_FORM + " input[type='checkbox']")
    .map(function(_, elem) {
      return {id: elem.id, checked: elem.checked};
    })
    .get()
    .reduce(function(out, elem) {
      out[elem.id] = elem.checked;
      return out;
    }, {});

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
}

function loadSettings() {
  if (!window.localStorage) {
    console.log('No Local Storage');
    return;
  }

  var formState = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
  if (formState === null) {
    // Nothing stored yet...
    return;
  }

  Object.entries(formState).forEach(function(setting) {
    document.getElementById(setting[0]).checked = setting[1];
  });
}

function main() {
  registerServiceWorker();
  var settings = document.getElementById(SECTION_IDS.SETTINGS_FORM);
  settings.addEventListener('change', saveSettings);
  settings.addEventListener('change', renderButtons);
  document.getElementById('reshuffle').onclick = renderOutput;
  document.getElementById('close').onclick = renderInputForm;
  loadSettings();
  renderInputForm();
  show();
}

window.onload = main;
