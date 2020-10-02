const goods = {
  11: {
    type: 'Common Electronics',
    availability: [],
    tons: {dice: 2, multiplier: 10},
    basePrice: 2000,
    purchaseDM: {
      In: 2,
      Ht: 3,
      Ri: 1,
    },
    saleDM: {
      Ni: 2,
      Lt: 1,
      Po: 1,
    },
  },
  12: {
    type: 'Common Industrial Goods',
    availability: [],
    tons: {dice: 2, multiplier: 10},
    basePrice: 1000,
    purchaseDM: {
      Na: 2,
      In: 5,
    },
    saleDM: {
      Ni: 3,
      Ag: 2,
    },
  },
  13: {
    type: 'Common Manufactured Goods',
    availability: [],
    tons: {dice: 2, multiplier: 10},
    basePrice: 2000,
    purchaseDM: {
      Na: 2,
      In: 5,
    },
    saleDM: {
      Ni: 3,
      Hi: 2,
    },
  },
  14: {
    type: 'Common Raw Materials',
    availability: [],
    tons: {dice: 2, multiplier: 20},
    basePrice: 500,
    purchaseDM: {
      Ag: 3,
      Ga: 2,
    },
    saleDM: {
      In: 2,
      Po: 2,
    },
  },
  15: {
    type: 'Common Conmsumables',
    availability: [],
    tons: {dice: 2, multiplier: 20},
    basePrice: 500,
    purchaseDM: {
      Ag: 3,
      Wa: 2,
      Ga: 1,
      As: -4,
    },
    saleDM: {
      As: 1,
      Fl: 1,
      Ic: 1,
      Hi: 1,
    },
  },
  16: {
    type: 'Common Ore',
    availability: [],
    tons: {dice: 2, multiplier: 20},
    basePrice: 1000,
    purchaseDM: {
      As: 4,
    },
    saleDM: {
      In: 3,
      Ni: 1,
    },
  },
  21: {
    type: 'Advanced Electronics',
    availability: ['In', 'Hi'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 100000,
    purchaseDM: {
      In: 2,
      Hi: 3,
    },
    saleDM: {
      Ri: 2,
      Ni: 1,
      As: 3,
    },
  },
  22: {
    type: 'Advanced Machine Parts',
    availability: ['In', 'Hi'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 75000,
    purchaseDM: {
      In: 2,
      Hi: 1,
    },
    saleDM: {
      Ni: 1,
      As: 2,
    },
  },
  23: {
    type: 'Advanced Manufactured Parts',
    availability: ['In', 'Hi'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 100000,
    purchaseDM: {
      In: 2,
    },
    saleDM: {
      Hi: 1,
      Ri: 2,
    },
  },
  24: {
    type: 'Advanced Weapons',
    availability: ['In', 'Hi'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 150000,
    purchaseDM: {
      Hi: 2,
    },
    saleDM: {
      Po: 1,
      Am: 2,
      Re: 4,
    },
  },
  25: {
    type: 'Advanced Vehicles',
    availability: ['In', 'Hi'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 180000,
    purchaseDM: {
      Hi: 2,
    },
    saleDM: {
      As: 2,
      Ri: 2,
    },
  },
  26: {
    type: 'Biochemicals',
    availability: ['Ag', 'Wa'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 50000,
    purchaseDM: {
      Ag: 1,
      Wa: 2,
    },
    saleDM: {
      In: 2,
    },
  },
  31: {
    type: 'Crystals and Gems',
    availability: ['As', 'De', 'Ic'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 20000,
    purchaseDM: {
      As: 2,
      De: 1,
      Ic: 2,
    },
    saleDM: {
      In: 3,
      Ri: 2,
    },
  },
  32: {
    type: 'Cybernetics',
    availability: ['Hi'],
    tons: {dice: 1, multiplier: 1},
    basePrice: 250000,
    purchaseDM: {
      Hi: 1,
    },
    saleDM: {
      As: 1,
      Ic: 1,
      Ri: 2,
    },
  },
  33: {
    type: 'Live Animals',
    availability: ['Ag', 'Ga'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 10000,
    purchaseDM: {
      Ag: 2,
    },
    saleDM: {
      Lo: 3,
    },
  },
  34: {
    type: 'Luxury Consumables',
    availability: ['Ag', 'Ga', 'Wa'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 20000,
    purchaseDM: {
      Ag: 2,
      Wa: 1,
    },
    saleDM: {
      Ri: 2,
      Hi: 2,
    },
  },
  35: {
    type: 'Luxury Goods',
    availability: ['Hi'],
    tons: {dice: 1, multiplier: 1},
    basePrice: 200000,
    purchaseDM: {
      Hi: 1,
    },
    saleDM: {
      Ri: 4,
    },
  },
  36: {
    type: 'Medical Supplies',
    availability: ['Ht', 'Hi'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 50000,
    purchaseDM: {
      Ht: 2,
    },
    saleDM: {
      In: 2,
      Po: 1,
      Ri: 1,
    },
  },
  41: {
    type: 'Petrochemicals',
    availability: ['De', 'Fl', 'Ic', 'Wa'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 10000,
    purchaseDM: {
      De: 2,
    },
    saleDM: {
      In: 2,
      Ag: 1,
      Lt: 2,
    },
  },
  42: {
    type: 'Pharmaceuticals',
    availability: ['As', 'De', 'Hi', 'Wa'],
    tons: {dice: 1, multiplier: 1},
    basePrice: 100000,
    purchaseDM: {
      As: 2,
      Hi: 1,
    },
    saleDM: {
      Ri: 2,
      Lt: 1,
    },
  },
  43: {
    type: 'Polymers',
    availability: ['In'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 7000,
    purchaseDM: {
      In: 1,
    },
    saleDM: {
      Ri: 2,
      Ni: 1,
    },
  },
  44: {
    type: 'Precious Metals',
    availability: ['As', 'De', 'Ic', 'Fl'],
    tons: {dice: 1, multiplier: 1},
    basePrice: 50000,
    purchaseDM: {
      As: 3,
      De: 1,
      Ic: 2,
    },
    saleDM: {
      In: 2,
      Ri: 3,
      Ht: 1,
    },
  },
  45: {
    type: 'Radioactives',
    availability: ['As', 'De', 'Lo'],
    tons: {dice: 1, multiplier: 1},
    basePrice: 1000000,
    purchaseDM: {
      As: 2,
      Lo: 2,
    },
    saleDM: {
      In: 3,
      Ht: 1,
      Ni: -2,
      Ag: -3,
    },
  },
  46: {
    type: 'Robots',
    availability: ['In'],
    tons: {dice: 1, multiplier: 5},
    basePrice: 400000,
    purchaseDM: {
      In: 1,
    },
    saleDM: {
      Ag: 2,
      Ht: 1,
    },
  },
  51: {
    type: 'Spices',
    availability: ['Ga', 'De', 'Wa', 'Ag'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 6000,
    purchaseDM: {
      De: 2,
    },
    saleDM: {
      Hi: 2,
      Ri: 3,
      Po: 3,
    },
  },
  52: {
    type: 'Textiles',
    availability: ['Ag', 'Ni'],
    tons: {dice: 1, multiplier: 20},
    basePrice: 3000,
    purchaseDM: {
      Ag: 7,
    },
    saleDM: {
      Hi: 3,
      Na: 2,
    },
  },
  53: {
    type: 'Uncommon Ore',
    availability: ['As', 'Ic'],
    tons: {dice: 1, multiplier: 20},
    basePrice: 5000,
    purchaseDM: {
      As: 4,
    },
    saleDM: {
      In: 3,
      Ni: 1,
    },
  },
  54: {
    type: 'Uncommon Raw Materials',
    availability: ['Ag', 'De', 'Wa'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 20000,
    purchaseDM: {
      Ag: 2,
      Wa: 1,
    },
    saleDM: {
      In: 2,
      Ht: 1,
    },
  },
  55: {
    type: 'Wood',
    availability: ['Ag', 'Ga'],
    tons: {dice: 1, multiplier: 20},
    basePrice: 1000,
    purchaseDM: {
      Ag: 6,
    },
    saleDM: {
      Ri: 2,
      In: 1,
    },
  },
  56: {
    type: 'Vehicles',
    availability: ['In', 'Ht'],
    tons: {dice: 1, multiplier: 10},
    basePrice: 15000,
    purchaseDM: {
      In: 2,
      Ht: 1,
    },
    saleDM: {
      Ni: 2,
      Hi: 1,
    },
  },
};

module.exports = goods;