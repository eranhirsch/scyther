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

/**
 * calculate the 'edit distance' between 2 lists. Edit distance is the number
 * of mismatching tiles between the 2. It should be reflexive.
 */
function listDistance(a, b) {
  if (a.length !== b.length) {
    console.log(a, b);
    throw new Exception('Both lists need to be of the same length');
  }

  // We need a copy of b so we can do destructive changes to it
  return a.reduce(function(remaining, value) {
    const idx = remaining.indexOf(value);
    if (idx > -1) {
      remaining.splice(idx, 1);
    }
    return remaining;
  }, b.slice()).length;
}

function range(n) {
  return Array.from(Array(n).keys());
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

function getFactions(skipRiseOfFenris = false) {
  let factions = Object.values(BASE.factions).slice();

  if (shouldIncludeInvadersBoards()) {
    factions = factions.concat(Object.values(INVADERS_FROM_AFAR.factions));
  }

  if (!skipRiseOfFenris && shouldIncludeFenrisFactions()) {
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

function getInfraMods(withAutoma) {
  let mods = RISE_OF_FENRIS.infrastructureMods;
  if (withAutoma) {
    mods = mods.filter(function(mod) {
      return mod.supportedByAutoma;
    });
  }

  return multiply(
    mods.map(function(mod) {
      return mod.label;
    }),
    4,
  );
}

function selectFaction(factions) {
  const selection = {};

  selection.faction = extractFromPool(factions)[0];
  if (!selection.faction.location) {
    // Some factions don't have a persistant home-base (Fenris, Vesna). They
    // use a home-base drawn randomly from the remaining bases.
    selection.homeBaseFaction = extractFromPool(factions, 1, function(faction) {
      // We want to make sure the faction we choose has a homebase
      return !!faction.location;
    })[0];
  }

  return selection;
}

function pickBoards(playerCount) {
  var factions = getFactions();
  var playerBoards = getPlayerBoards();
  var allMechMods = getMechMods();
  var allInfraMods = getInfraMods(playerCount === 1 /* withAutoma */);

  out = [];
  for (var i = 0; i < playerCount; i++) {
    selection = selectFaction(factions);

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
          return '[' + ability + ']';
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
    const automa = selectFaction(factions);
    automa.isAutoma = true;

    if (automa.faction === RISE_OF_FENRIS.factions.VESNA) {
      // Vesna draws 2 random factions (Page 23)
      const allFactions = getFactions(true /* skipRiseOfFenris */);
      automa.vesnaFactions = extractFromPool(allFactions, 2);
    }

    out.push(automa);
  }

  return out;
}

function pickTriumphTrack() {
  const track = pickFromArray(Object.values(RISE_OF_FENRIS.triumphTracks));

  let out = {track: track};

  if (track === RISE_OF_FENRIS.triumphTracks.WAR) {
    out.distances = {
      war: 0,
      regular: 4,
    };
  } else if (track === RISE_OF_FENRIS.triumphTracks.PEACE) {
    out.distances = {
      war: 8,
      regular: 4,
    };
  } else if (track === RISE_OF_FENRIS.triumphTracks.REGULAR) {
    out.distances = {
      war: 4,
      regular: 0,
    };
  } else {
    // We want to maintain order so we shuffle indices instead of values
    out.tiles = extractFromPool(range(track.tiles.length), 10)
      // We then sort the indices because order is important
      .sort(function(a, b) {
        return a - b;
      })
      // and finally map the actual values to the indices for display
      .map(function(idx) {
        return track.tiles[idx];
      });

    out.distances = {
      // The distance from the regular track is a number in the range 0..6 (we
      // can build the regular track out of the random tile pieces).
      regular: listDistance(
        out.tiles,
        RISE_OF_FENRIS.triumphTracks.REGULAR.layout,
      ),

      // The distance to the war track is a number in the range 1..7, 0 and 8
      // are the actual war and peace tracks (respectively)
      war: listDistance(out.tiles, RISE_OF_FENRIS.triumphTracks.WAR.layout),
    };

    if (out.distances.regular === 0) {
      // When the distance is 0 we can simply use the track that is already
      // printed on the board
      out.track = RISE_OF_FENRIS.triumpTracks.REGULAR;
    }
  }

  // The likelihood of using Rivals (or Alliances) is based on how close the
  // current triumph track is to the War track. The closer it is, the more
  // likely we are to using that module vs Alliances.
  out.enhancement =
    Math.random() < out.distances.war / 8.0 ? 'Alliances' : 'Rivals';

  return out;
}

function pickGlobals(boards) {
  globals = {ruleBook: []};

  // We always have a building bonus tile
  globals.buildingBonus = pickFromArray(BASE.buildingBonuses);

  if (shouldIncludeResolutions()) {
    globals.resolution = pickFromArray(WIND_GAMBIT.resolutions);
  }

  const withAutoma = boards.some(function(board) {
    return board.isAutoma;
  });

  if (shouldIncludeAirships()) {
    var aggressive = WIND_GAMBIT.airshipAbilities.aggressive;
    if (withAutoma) {
      // Some aggressive abilities aren't supported by the automa
      aggressive = aggressive.filter(function(ability) {
        return ability.supportedByAutoma;
      });
    }

    globals.airships = {
      passive: pickFromArray(WIND_GAMBIT.airshipAbilities.passive),
      aggressive: pickFromArray(aggressive).label,
    };
  }

  if (withAltTriumphTracks()) {
    const track = pickTriumphTrack();

    const tiles = track.tiles || track.track.layout;

    if (!tiles.includes('Objective')) {
      globals.ruleBook.push('Remove ALL objective cards');
    } else if (!tiles.includes('Combat Victory')) {
      // Page 51
      globals.ruleBook.push('Remove objective card #23');
      if (
        boards.some(function(board) {
          return board.faction === BASE.factions.SAXONY;
        })
      ) {
        globals.ruleBook.push('Saxony starts with 3 objective cards');
      }
    }

    globals.triumphTrack = track;
  }

  if (withAutoma) {
    // Rules for fenris infra/mech mods when playing with the automa (Page 50)
    // Modifiers were calculated based on the table in page 6.
    if (withInfraMods()) {
      if (withMechMods()) {
        // "If you’re using both types of Mods, The Automa “buys” 4
        // Infrastructure Mods."
        globals.automaModifiers = 'Star Tracker: +2, Gain Stuff, Remove Card 4';
      } else {
        // "If you’re using Infrastructure Mods only, the Automa “buys” 2
        // Infrastructure Mods."
        globals.automaModifiers = 'Star Tracker: +1, Gain Stuff';
      }
    } else if (withMechMods()) {
      // "If you’re using Mech Mods only, the Automa “buys” 3 Mech Mods."
      globals.automaModifiers = 'Gain Stuff x2';
    }
  }

  return globals;
}

function generateNewGame(playerCount) {
  const boards = pickBoards(playerCount);

  if (withProximityScores()) {
    // Proximity scores are individual to each board selection, but can only be
    // computed after all boards are selected
    boards.forEach(function(board) {
      board.proximity = proximityScore(board.faction, boards);
    });
  }

  return {
    players: boards,
    globals: pickGlobals(boards),
  };
}
