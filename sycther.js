const SECTION_IDS = {
  GLOBAL: 'global',
  PLAYERS: 'players',
}

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
  item.className = 'list-group-item shadow-sm rounded';

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

function renderBoards(playerCount) {
  var playersSection = document.getElementById(SECTION_IDS.PLAYERS);
  if (playersSection === null) {
    console.log("No player section!");
    return;
  }

  var boards = pickBoards(playerCount);

  boards.forEach(function(selection) {
    var proximity = proximityScore(selection.faction, boards);
    playersSection.appendChild(renderBoardSelection(selection, proximity));
  });
}

function renderGlobalItem(icon, labelElem) {
  var itemElem = document.createElement('li');
  itemElem.className = 'list-group-item';

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
  var template = document.getElementById('buttonTemplate');
  template.removeAttribute('id');
  var form = template.parentNode;
  form.removeChild(template);
  for (var i=1; i <= DATA.factions.length; i++) {
    var button = template.cloneNode();
    button.type = 'submit';
    button.value = i;
    form.appendChild(button);
  }
}

function changePhase(isInputPhase /* boolean */) {
  $(isInputPhase ? '.input-phase' : '.output-phase').show();
  $(isInputPhase ? '.output-phase' : '.input-phase').hide();
}

function resetView() {
  document.getElementById(SECTION_IDS.GLOBAL).innerHTML = '';
  document.getElementById(SECTION_IDS.PLAYERS).innerHTML = '';
}

function addEventHandling() {
  var reshuffle = document.getElementById('reshuffle');
  reshuffle.onclick = function() {
    resetView();
    randomize();
    reshuffle.blur();
  };
}

function randomize() {
  const playerCount = (new URL(document.URL))
    .searchParams
    .get('playerCount');
  renderBoards(playerCount);
  renderGlobalSection();
}

function main() {
  addEventHandling();

  const playerCount = (new URL(document.URL))
    .searchParams
    .get('playerCount');
  if (playerCount !== null) {
    // Player count selected
    changePhase(false);
    randomize();
  } else {
    changePhase(true);
    renderButtons();
  }
};

window.onload = main;
