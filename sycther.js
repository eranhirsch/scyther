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
  var playersSection = document.getElementById('players');
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

function renderGlobalDefinition(container, title, selection) {
  var titleElem = document.createElement('dt');
  titleElem.textContent = title;
  container.appendChild(titleElem);

  var definitionElem = document.createElement('dd');
  definitionElem.textContent = selection;
  container.appendChild(definitionElem);
}

function renderScoringSection() {
  var scoring = document.getElementById('scoring');
  if (scoring === null) {
    console.log("No scoring section!");
    return;
  }
  renderGlobalDefinition(
    scoring,
    'Building Bonus',
    pickFromArray(DATA.buildingBonuses),
  );
  renderGlobalDefinition(
    scoring,
    'Resolution',
    pickFromArray(DATA.resolutions),
  );
}

function renderAirshipSection() {
  var airship = document.getElementById('airship');
  if (airship === null) {
    console.log("No airship section!");
    return;
  }
  renderGlobalDefinition(
    airship,
    'Airship Passive',
    pickFromArray(DATA.airshipAbilities.passive),
  );
  renderGlobalDefinition(
    airship,
    'Airship Aggressive',
    pickFromArray(DATA.airshipAbilities.aggressive),
  );
}

function renderGlobalSection() {
  renderScoringSection();
  renderAirshipSection();
}

function renderButtons(playerCount) {
  var template = document.getElementById('buttonTemplate');
  template.removeAttribute('id');
  var form = template.parentNode;
  form.removeChild(template);
  for (var i=1; i <= DATA.factions.length; i++) {
    var button = template.cloneNode();
    button.type = 'submit';
    button.value = i;

    if (playerCount == i) {
      button.className += ' selected';
    }

    form.appendChild(button);
  }
}

function changePhase(isInputPhase /* boolean */) {
  $(isInputPhase ? '.input-phase' : '.output-phase').show();
  $(isInputPhase ? '.output-phase' : '.input-phase').hide();
}

function main() {
  const playerCount = (new URL(document.URL))
    .searchParams
    .get('playerCount');
  if (playerCount !== null) {
    // Player count selected
    changePhase(false);
    renderBoards(playerCount);
    renderGlobalSection();
  } else {
    changePhase(true);
    renderButtons(playerCount);
  }
};

window.onload = main;
