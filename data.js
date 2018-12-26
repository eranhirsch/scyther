const DATA = {
  factions: [
    {
      label: 'Polania Republic',
      location: 1,
      className: 'polania',
    },
    {
      label: 'Saxony Empire',
      location: 2,
      className: 'saxony',
    },
    {
      label: 'Crimean Khanate',
      location: 3,
      className: 'crimea',
    },
    {
      label: 'Togawa Shogunate',
      location: 4,
      className: 'togawa',
      invadersOnly: true,
    },
    {
      label: 'Rusviet Union',
      location: 5,
      className: 'rusviet',
    },
    {
      label: 'Nordic Kingdom',
      location: 6,
      className: 'nordic',
    },
    {
      label: 'Clan Albion',
      location: 7,
      className: 'albion',
      invadersOnly: true,
    },
  ],

  playerBoards: [
    {label: 'Industrial'},
    {label: 'Engineering'},
    {label: 'Militant', invadersOnly: true},
    {label: 'Patriotic'},
    {label: 'Mechanical'},
    {label: 'Innovative', invadersOnly: true},
    {label: 'Agricultural'},
  ],

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
      'Bombard',
      'Bounty',
      'Siege Engine',
      'Distract',
      'Espionage',
      'Blitzkrieg',
      'Toll',
      'War Correspondent',
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
}
