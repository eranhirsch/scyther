const DATA = {
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
    TOGAWA: {
      label: 'Togawa Shogunate',
      location: 4,
      className: 'togawa',
      invadersOnly: true,
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
    ALBION: {
      label: 'Clan Albion',
      location: 7,
      className: 'albion',
      invadersOnly: true,
    },
  },

  playerBoards: {
    INDUSTRIAL: {label: 'Industrial'},
    ENGINEERING: {label: 'Engineering'},
    MILITANT: {label: 'Militant', invadersOnly: true},
    PATRIOTIC: {label: 'Patriotic'},
    MECHANICAL: {label: 'Mechanical'},
    INNOVATIVE: {label: 'Innovative', invadersOnly: true},
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
    {faction: DATA.factions.RUSVIET, playerBoard: DATA.playerBoards.INDUSTRIAL},
    {faction: DATA.factions.CRIMEA, playerBoard: DATA.playerBoards.PATRIOTIC},
  ],
  underPowered: [],
};
