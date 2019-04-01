const BASE = {
  factions: {
    POLANIA: {
      label: 'Polania Republic',
      location: 1,
      className: 'polania',
    },
    SAXONY: {
      label: 'Saxony Empire',
      location: 2,
      className: 'saxony',
    },
    CRIMEA: {
      label: 'Crimean Khanate',
      location: 3,
      className: 'crimea',
    },
    RUSVIET: {
      label: 'Rusviet Union',
      location: 5,
      className: 'rusviet',
    },
    NORDIC: {
      label: 'Nordic Kingdom',
      location: 6,
      className: 'nordic',
    },
  },

  playerBoards: {
    INDUSTRIAL: {label: 'Industrial'},
    ENGINEERING: {label: 'Engineering'},
    PATRIOTIC: {label: 'Patriotic'},
    MECHANICAL: {label: 'Mechanical'},
    AGRICULTURAL: {label: 'Agricultural'},
  },

  buildingBonuses: [
    'Adjacent Tunnels',
    'Adjacent Lakes',
    'Adjacent Encounters',
    'On Tunnels',
    'In a Row',
    'On Farms and Tundras',
  ],
};

const INVADERS_FROM_AFAR = {
  factions: {
    TOGAWA: {
      label: 'Togawa Shogunate',
      location: 4,
      className: 'togawa',
    },
    ALBION: {
      label: 'Clan Albion',
      location: 7,
      className: 'albion',
    },
  },

  playerBoards: {
    MILITANT: {label: 'Militant'},
    INNOVATIVE: {label: 'Innovative'},
  },
};

const WIND_GAMBIT = {
  resolutions: [
    'Spoils of War',
    'Land Rush',
    'Deja Vu',
    'Factory Explosion',
    'Doomsday Clock',
    'Mission Possible',
    'King of the Hill',
    'Backup Plan',
  ],

  airshipAbilities: {
    aggressive: [
      {label: 'Bombard', supportedByAutoma: true},
      {label: 'Bounty', supportedByAutoma: true},
      {label: 'Siege Engine', supportedByAutoma: true},
      {label: 'Distract', supportedByAutoma: true},
      {label: 'Espionage', supportedByAutoma: true},
      {label: 'Blitzkrieg', supportedByAutoma: true},
      {label: 'Toll', supportedByAutoma: false},
      {label: 'War Correspondent', supportedByAutoma: true},
    ],

    passive: [
      'Ferry',
      'Boost',
      'Drill',
      'Hero',
      'Safe Haven',
      'Reap',
      'Craft',
      'Negotiate',
    ],
  },
};

const RISE_OF_FENRIS = {
  mechMods: {
    generic: [
      'Armor',
      'Entrenched',
      'Feint',
      'Foothold',
      'Pontoons',
      'Regroup',
      'Reinforce',
      'Stealth',
      'Tactics',
    ],
    factionSpecific: {
      Artillery: BASE.factions.NORDIC,
      Camaraderie: BASE.factions.POLANIA,
      Scout: BASE.factions.CRIMEA,
      Suiton: INVADERS_FROM_AFAR.factions.TOGAWA,
      Sword: INVADERS_FROM_AFAR.factions.ALBION,
      Township: BASE.factions.RUSVIET,
      Underpass: BASE.factions.SAXONY,
    },
  },

  infrastructureMods: [
    'Assembly Line',
    'Automachines',
    'Cavalry',
    'Construction',
    'Machinery',
    'Propaganda',
    'Recruitment Office',
    'Spy',
  ],
};

BAD_COMBOS = {
  overPowered: [
    {faction: BASE.factions.RUSVIET, playerBoard: BASE.playerBoards.INDUSTRIAL},
    {faction: BASE.factions.CRIMEA, playerBoard: BASE.playerBoards.PATRIOTIC},
  ],
  underPowered: [],
};
