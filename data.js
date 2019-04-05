const BASE = {
  factions: {
    POLANIA: {
      label: 'Polania Republic',
      shortName: 'Polania',
      location: 1,
      className: 'polania',
    },
    SAXONY: {
      label: 'Saxony Empire',
      shortName: 'Saxony',
      location: 2,
      className: 'saxony',
    },
    CRIMEA: {
      label: 'Crimean Khanate',
      shortName: 'Crimea',
      location: 3,
      className: 'crimea',
    },
    RUSVIET: {
      label: 'Rusviet Union',
      shortName: 'Rusviet',
      location: 5,
      className: 'rusviet',
    },
    NORDIC: {
      label: 'Nordic Kingdom',
      shortName: 'Nordic',
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
      shortName: 'Togawa',
      location: 4,
      className: 'togawa',
    },
    ALBION: {
      label: 'Clan Albion',
      shortName: 'Albion',
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
    {label: 'Assembly Line', supportedByAutoma: true},
    {label: 'Automachines', supportedByAutoma: true},
    {label: 'Cavalry', supportedByAutoma: true},
    {label: 'Construction', supportedByAutoma: true},
    {label: 'Machinery', supportedByAutoma: true},
    {label: 'Propaganda', supportedByAutoma: true},
    {label: 'Recruitment Office', supportedByAutoma: true},
    {label: 'Spy', supportedByAutoma: false},
  ],

  triumphTracks: [
    {name: 'War Track', enhancements: ['Rivals'], className: 'warTrack'},
    {name: 'Regular Track', enhancements: ['Rivals', 'Alliances']},
    {name: 'Peace Track', enhancements: ['Alliances'], className: 'peaceTrack'},
  ],

  factions: {
    VESNA: {
      label: 'Vesna',
      shortName: 'Vesna',
      className: 'vesna',
      mechAbilities: [
        'Artillery',
        'Camaraderie',
        'Disarm',
        'Feint',
        'Regroup',
        'Ronin',
        'Scout',
        'Seaworthy',
        'Shield',
        'Stealth',
        'Submerge',
        'Suiton',
        'Sword',
        'Tactics',
        'Township',
        'Underpass',
        'Wayfare',
        "People's Army",
      ],
    },
    FENRIS: {
      label: 'Fenris',
      shortName: 'Fenris',
      className: 'fenris',
    },
  },
};

BAD_COMBOS = [
  {faction: BASE.factions.RUSVIET, playerBoard: BASE.playerBoards.INDUSTRIAL},
  {faction: BASE.factions.CRIMEA, playerBoard: BASE.playerBoards.PATRIOTIC},
];
