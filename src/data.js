const ACTION_BUTTON = {
	labels:{
		IT:'Nuovo Sorteggio',
		EN:'Reshuffle'
	},
};

const BASE = {
  factions: {
    POLANIA: {
		labels:{
			IT:'Repubblica di Polania',
			EN:'Polania Republic'
		},
      shortName: 'Polania',
      location: 1,
      className: 'polania',
    },
    SAXONY: {
		labels:{
			IT:'Impero di Sassonia',
			EN:'Saxony Empire'
		},
      shortName: 'Saxony',
      location: 2,
      className: 'saxony',
    },
    CRIMEA: {
		labels:{
			IT:'Khanato di Crimea',
			EN:'Crimean Khanate'
		},
      shortName: 'Crimea',
      location: 3,
      className: 'crimea',
    },
    RUSVIET: {
		labels:{
			IT:'Unione Rusviet',
			EN:'Rusviet Union'
		},
      shortName: 'Rusviet',
      location: 5,
      className: 'rusviet',
    },
    NORDIC: {
		labels:{
			IT:'Regno Nordico',
			EN:'Nordic Kingdom'
		},
      shortName: 'Nordic',
      location: 6,
      className: 'nordic',
    },
  },

  playerBoards: {
    INDUSTRIAL: {
			labels:{
				IT:'Industriale',
				EN:'Industrial'
			}
		},
    ENGINEERING: {
			labels:{
				IT:'Ingegneristico',
				EN:'Engineering'
			}
		},
    PATRIOTIC: {
			labels:{
				IT:'Patriottico',
				EN:'Patriotic'
			}
		},
    MECHANICAL: {
			labels:{
				IT:'Meccanico',
				EN:'Mechanical'
			}
		},
    AGRICULTURAL: {
			labels:{
				IT:'Agricolo',
				EN:'Agricultural'
			}
		}
  },
  
  buildingBonuses:{
	  IT:[
		'Adiacente ai Tunnel',
		'Adiacente ai Laghi',
		'Adiacente agli Incontri',
		'Sopra i Tunnel',
		'In Liena',
		'Sopra Fattorie e Tundra',
	  ],
	  EN:[
		'Adjacent Tunnels',
		'Adjacent Lakes',
		'Adjacent Encounters',
		'On Tunnels',
		'In a Row',
		'On Farms and Tundras',
	  ]
  }
  
};

const INVADERS_FROM_AFAR = {
  factions: {
    TOGAWA: {
		labels:{
			IT:'Shogunato di Togawa',
			EN:'Togawa Shogunate'
		},
      shortName: 'Togawa',
      location: 4,
      className: 'togawa',
    },
    ALBION: {
		labels:{
			IT:'Clan di Albione',
			EN:'Clan Albion'
		},
      shortName: 'Albion',
      location: 7,
      className: 'albion',
    },
  },

  playerBoards: {
    MILITANT: {
			labels:{
				IT:'Militante',
				EN:'Militant'
			}
		},
    INNOVATIVE: {
			labels:{
				IT:'Innovativo',
				EN:'Innovative'
			}
		},
  },
};

const WIND_GAMBIT = {
  resolutions: {
    IT:[
		'Bottini di Guerra',
		'La Corsa Alla Terra',
		'Deja Vu',
		'Esplosione della Fabbrica',
		'Orologio dell\'Apocalisse',
		'Missione Possibile',
		'Re della Collina',
		'Piano di Backup'
	],
	EN:[
		'Spoils of War',
		'Land Rush',
		'Deja Vu',
		'Factory Explosion',
		'Doomsday Clock',
		'Mission Possible',
		'King of the Hill',
		'Backup Plan'
	],
  },
  
  airshipAbilities: {
    aggressive: [
      {
			labels:{
				IT:'Bombardare a Tappeto',
				EN:'Bombard'
			},
		  supportedByAutoma: true
		  },
      {
			labels:{
				IT:'Premio',
				EN:'Bounty'
			},
		  supportedByAutoma: true
		  },
      {
			labels:{
				IT:'Macchina d\'Assedio',
				EN:'Siege Engine'
			},
		  upportedByAutoma: true
		  },
      {
			labels:{
				IT:'Distrarre',
				EN:'Distract'
			},
		  supportedByAutoma: true
		  },
      {
			labels:{
				IT:'Spionaggio',
				EN:'Espionage'
			},
		  supportedByAutoma: true
		  },
      {
			labels:{
				IT:'Guerra Lampo',
				EN:'Blitzkrieg'
			},
		  supportedByAutoma: true
		  },
      {
			labels:{
				IT:'Tributo',
				EN:'Toll'
			},
		  supportedByAutoma: false
		  },
      {
			labels:{
				IT:'Corrispondente di Guerra',
				EN:'War Correspondent'
			},
		  supportedByAutoma: true
		  },
    ],
	
  passive: {
    IT:[
      'Traghetto',
      'Incoraggiamento',
      'Perforazione',
      'Eroe',
      'Porto Sicuro',
      'Mietere',
      'Tecnica',
      'Negoziare',
	],
	EN:[
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
  },
};

const RISE_OF_FENRIS = {
  mechMods: {
    generic: {
		IT:[
		  'Armatura',
		  'Trincea',
		  'Finta',
		  'Punto d\'Appoggio',
		  'Ponti Galleggianti',
		  'Raggrupparsi',
		  'Rinforzi',
		  'Stealth',
		  'Tattica'
		],
		EN:[
		  'Armor',
		  'Entrenched',
		  'Feint',
		  'Foothold',
		  'Pontoons',
		  'Regroup',
		  'Reinforce',
		  'Stealth',
		  'Tactics'
		]
	},
	
	factionSpecificLabels:{
		IT:[
			'Artiglieria',
			'Cameratismo',
			'Ricognizione',
			'Suiton',
			'Spada',
			'Distretto',
			'Sottovia',
		],
		EN:[
			'Artillery',
			'Camaraderie',
			'Scout',
			'Suiton',
			'Sword',
			'Township',
			'Underpass',
		]
	},
	
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
    {		
		labels:{
				IT:'Linea di Assemblaggio',
				EN:'Assembly Line'
			},
		supportedByAutoma: true
		},
    {
		labels:{
				IT:'Automacchine',
				EN:'Automachines'
			},
		supportedByAutoma: true
		},
    {
		labels:{
				IT:'Cavalleria',
				EN:'Cavalry'
			},
		supportedByAutoma: true
		},
    {
		labels:{
				IT:'Fabbricazione',
				EN:'Construction'
			},
		supportedByAutoma: true
	},
    {
		labels:{
				IT:'Macchinario',
				EN:'Machinery'
			},
		supportedByAutoma: true
		},
    {
		labels:{
				IT:'Propaganda',
				EN:'Propaganda'
			},
		supportedByAutoma: true
		},
    {
		labels:{
				IT:'Ufficio Reclutamento',
				EN:'Recruitment Office'
			},
		supportedByAutoma: true
		},
    {
		labels:{
				IT:'Spia',
				EN:'Spy'
			},
		supportedByAutoma: false
		},
  ],

  triumphTracks: {
    REGULAR: {
      name: 'Regular Track',
      className: 'regularTrack',
      layout: [
        'Upgrades',
        'Mechs',
        'Structures',
        'Recruits',
        'Workers',
        'Objective',
        'Combat Victory',
        'Combat Victory',
        'Popularity',
        'Power',
      ],
    },
    WAR: {
      name: 'War Track',
      className: 'warTrack',
      layout: [
        // Page 16
        'Upgrades/Structures',
        'Mechs',
        'Recruits',
        'Objective',
        'Combat Victory',
        'Combat Victory',
        'Combat Victory',
        'Combat Victory',
        'Power',
        'Combat Cards',
      ],
    },
    PEACE: {
      name: 'Peace Track',
      className: 'peaceTrack',
      layout: [
        // Page 18
        'Upgrades',
        'Structures',
        'Mechs/Recruits',
        'Workers',
        'Objective',
        'Objective',
        'Popularity',
        'Encounters',
        'Factory',
        'Resources',
      ],
    },
    RANDOM: {
      tiles: [
        // Dont sort these, the order is important for display
        'Upgrades',
        'Mechs',
        'Structures',
        'Recruits',
        'Workers',
        'Objective',
        'Combat Victory',
        'Combat Victory',
        'Combat Victory',
        'Combat Victory',
        'Popularity',
        'Power',
        'Combat Cards',
        'Encounters',
        'Factory',
        'Resources',
      ],
    },
  },

  factions: {
    VESNA: {
		labels:{
			IT:'Vesna',
			EN:'Vesna'
		},
      shortName: 'Vesna',
      className: 'vesna',
	  mechAbilities:{
		  IT:[
			'Artiglieria',
			'Cameratismo',
			'Disarmo',
			'Finta',
			'Raggrupparsi',
			'Ronin',
			'Ricognizione',
			'Navigatori',
			'Scudo',
			'Stealth',
			'Immersione',
			'Suiton',
			'Spada',
			'Tattica',
			'Distretto',
			'Sottovia',
			'Viandante',
			"Esercito del Popolo",
		  ],
		  EN:[
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
		  ]
	  },
    },
    FENRIS: {
	  		labels:{
			IT:'Fenris',
			EN:'Fenris'
		},
      shortName: 'Fenris',
      className: 'fenris',
    },
  },
};

BAD_COMBOS = [
  {faction: BASE.factions.RUSVIET, playerBoard: BASE.playerBoards.INDUSTRIAL},
  {faction: BASE.factions.CRIMEA, playerBoard: BASE.playerBoards.PATRIOTIC},
];
