const FORM_PARAM_PLAYER_COUNT = 'playerCount';
const SHUFFLE_TIMES = 10007;

const FACTIONS = [
  {label: 'Polania Republic', icon: '🐻', location: 1, className: 'polania'},
  {label: 'Saxony Empire', icon: '🐺', location: 2, className: 'saxony'},
  {label: 'Crimean Khanate', icon: '🦅', location: 3, className: 'crimea'},
  {label: 'Togawa Shogunate', icon: '🐒', location: 4, className: 'togawa'},
  {label: 'Rusviet Union', icon: '🐅', location: 5, className: 'rusviet'},
  {label: 'Nordic Kingdom', icon: '🐂', location: 6, className: 'nordic'},
  {label: 'Clan Albion', icon: '🐗', location: 7, className: 'albion'},
];

const PLAYER_BOARDS = [
  {label: 'Industrial', icon: '🏭'},
  {label: 'Engineering', icon: '📐'},
  {label: 'Militant', icon: '🔫'},
  {label: 'Patriotic', icon: '🏴'},
  {label: 'Mechanical', icon: '⚙️'},
  {label: 'Innovative', icon: '💡'},
  {label: 'Agricultural', icon: '🚜'},
];

const BUILDING_BONUSES = [
  'Adjacent Tunnels',
  'Adjacent Lakes',
  'Adjacent Encounters',
  'On Tunnels',
  'In a Row',
  'On Farms and Tundras',
];

const RESOLUTION_TILES = [
  'Spoils of War',
  'Land Rush',
  'Deja Vu',
  'Factory Explosion',
  'Doomsday Clock',
  'Mission Possible',
  'King of the Hill',
  'Backup Plan',
];

const AIRSHIP_AGRESSIVE_ABILITIES = [
  'Bombard',
  'Bounty',
  'Siege Engine',
  'Distract',
  'Espionage',
  'Blitzkrieg',
  'Toll',
  'War Correspondent',
];

const AIRSHIP_PASSIVE_ABILITIES = [
  'Ferry',
  'Boost',
  'Drill',
  'Hero',
  'Safe Haven',
  'Reap',
  'Craft',
  'Negotiate',
];

function getIntInRange(from, to) {
  return from + Math.floor(Math.random() * (to-from+1));
}

function shuffleArray(array) {
  for (var i = 0; i < SHUFFLE_TIMES; i++) {
    var item = array.shift();
    var target_location = getIntInRange(1, array.length);
    array.splice(target_location, 0, item);
  }
}

function pickFromArray(array) {
  return array[getIntInRange(0, array.length - 1)];
}

function factionDistance(a, b) {
  var biggerLocation = Math.max(a.location, b.location);
  var smallerLocation = Math.min(a.location, b.location);

  var clockwiseDistance = biggerLocation - smallerLocation;
  var counterClockwiseDistance = FACTIONS.length - clockwiseDistance;
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
  shuffleArray(FACTIONS);
  shuffleArray(PLAYER_BOARDS);
  out = [];
  for (var i = 0; i < playerCount; i++) {
    out.push({faction: FACTIONS[i], playerBoard: PLAYER_BOARDS[i]});
  }
  return out;
}

function renderBoardSelection(boardSelection, proximity) {
  const item = document.createElement('li');

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
    pickFromArray(BUILDING_BONUSES),
  );
  renderGlobalDefinition(
    scoring,
    'Resolution',
    pickFromArray(RESOLUTION_TILES),
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
    pickFromArray(AIRSHIP_PASSIVE_ABILITIES),
  );
  renderGlobalDefinition(
    airship,
    'Airship Aggressive',
    pickFromArray(AIRSHIP_AGRESSIVE_ABILITIES),
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
  for (var i=1; i <= FACTIONS.length; i++) {
    var button = template.cloneNode();
    button.type = 'submit';
    button.value = i;

    if (playerCount == i) {
      button.className = button.className.replace(/btn-light/, 'btn-primary');
    }

    form.appendChild(button);
  }
}

function hideTitle() {
  document.getElementById('title').hidden = true;
}

function main() {
  const playerCount = (new URL(document.URL))
    .searchParams
    .get(FORM_PARAM_PLAYER_COUNT);
  if (playerCount !== null) {
    // Player count selected
    hideTitle();
    renderBoards(playerCount);
    renderGlobalSection();
  }

  // we render the buttons anyway
  renderButtons(playerCount);
};

window.onload = main;
