const SECTION_IDS = {
  ROOT: 'root',
  GLOBAL: 'global',
  PLAYERS: 'players',
  INPUT_FORM: 'input',
};

const ELEMENT_CLASSES = {
  INPUT_BUTTON: 'btn btn-light btn-lg',
  BOARD_SELECTION: 'list-group-item shadow-sm rounded',
  GLOBAL_ITEM: 'list-group-item',
};

const GET_PARAMS = {
  PLAYER_COUNT: 'pc',
};

var G_PLAYER_COUNT = null;

function getIntInRange(from, to) {
  return from + Math.floor(Math.random() * (to-from+1));
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
  return others.map(function(other) {
    return factionDistance(faction, other.faction);
  }).reduce(function(accumulator, currVal) {
    return accumulator + currVal;
  }) / (others.length - 1);
}

function pickBoards(playerCount) {
  var factions = DATA.factions.slice();
  var playerBoards = DATA.playerBoards.slice();
  out = [];
  for (var i = 0; i < playerCount; i++) {
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

  const labelElem = document.createElement('div');
  labelElem.textContent =
    boardSelection.playerBoard.label + ' ' + boardSelection.faction.label;
  labelElem.className = boardSelection.faction.className;
  item.appendChild(labelElem);

  if (!!proximity) {
    const proximityElem = document.createElement('div');
    proximityElem.className = 'proximity';
    proximityElem.textContent =
      '(Proximity: ' + parseFloat(proximity).toFixed(1) + ')';
    item.appendChild(proximityElem);
  }

  return item;
}

function renderBoards() {
  var playersSection = document.getElementById(SECTION_IDS.PLAYERS);
  if (playersSection === null) {
    console.log("No player section!");
    return;
  }

  var boards = pickBoards(G_PLAYER_COUNT);

  boards.forEach(function(selection) {
    var proximity = proximityScore(selection.faction, boards);
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

  labelElem.insertAdjacentHTML('beforeend', "&nbsp;&&nbsp;")

  var aggressiveElem = document.createElement('span');
  aggressiveElem.className = 'airship-aggressive';
  aggressiveElem.textContent = pickFromArray(DATA.airshipAbilities.aggressive);
  labelElem.appendChild(aggressiveElem);

  return labelElem;
}

function renderGlobalSection() {
  var globalSection = document.getElementById(SECTION_IDS.GLOBAL);
  if (globalSection === null) {
    console.log("No global section!");
    return;
  }

  globalSection.appendChild(renderGlobalItem(
    '🏠',
    renderSimpleLabel(pickFromArray(DATA.buildingBonuses)),
  ));
  globalSection.appendChild(renderGlobalItem(
    '🏆',
    renderSimpleLabel(pickFromArray(DATA.resolutions)),
  ));
  globalSection.appendChild(renderGlobalItem('🚢', renderAirshipLabel()),
  );
}

function renderButtons() {
  var group = document.getElementById(SECTION_IDS.INPUT_FORM);

  if (group.children.length > 0) {
    // already has buttons;
    return;
  }

  // No need for an entry for 1 (the automa requires 2 factions) and no need for
  // the maximum as you can always deduce that from the remaining boards.
  for (var i=2; i < DATA.factions.length; i++) {
    var button = document.createElement('input');
    button.type = 'radio';
    button.name = 'player_count';
    button.value = i;

    var buttonLabel = document.createElement('label');
    buttonLabel.className = ELEMENT_CLASSES.INPUT_BUTTON;
    buttonLabel.onclick = function(event) {
      G_PLAYER_COUNT = event.currentTarget.firstElementChild.value;
      $('.input-phase').hide();
      $('.output-phase').show();
      renderOutput();
    };
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

function main() {
  document.getElementById('reshuffle').onclick = renderOutput;
  document.getElementById('close').onclick = renderInputForm;
  renderInputForm();
  show();
};

window.onload = main;
