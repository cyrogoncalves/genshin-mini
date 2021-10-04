// model
// Amber (****) Ascension 6 (++++++) Constellation 0 (------)
//    talents Normal 0 (------) Elemental 6 (++++++) Burst 3 (+++---)

const unit = "Amber_A6C0_N1E6B1";
const weapon = "Amos_R1A6";
// Crimson Witch Atk Plume 5* (+++++) 1atk 3cr 2er 2cd
const artifact = "Witch_AP_S5A5_1a3p2r2c";

export type Element = 'Pyro' | 'Hydro' | 'Electro' | 'Cryo' | 'Anemo' | 'Geo' | 'Dendro';

export abstract class Character {
  public readonly cooldowns: { [k in string]: number } = {};

  protected constructor(
      public readonly name: string,
      public readonly attacks: { normal, skill, burst },
      public maxHp: number = 10,
      public def: number = 0,
      public em = 1,
      public hp: number = maxHp,
  ) {}

  cooldown = () => Object.entries(this.cooldowns)
      .filter(([_, v]) => v > 0)
      .forEach(([c]) => this.cooldowns[c]--);
}

const baronBunny = {
  name: "Baron Bunny",
  hp: 3,
  taunt: true,
  cooldown: 2,
  onEnd: { atk: 3, dmgType: "Pyro", area: 2 }
}
export class Amber extends Character {
  constructor() { super("Amber", {
    normal: { atk: 1 },
    skill: { summon: baronBunny, cooldown: 3 },
    burst: { atk: 2, dmgType: "Pyro", area: 3, cooldown: 5 }
  })}
}
export class Traveler extends Character {
  constructor(name = "Lumine") { super(name, {
    normal: { atk: 1 },
    skill: { atk: [1, 2], dmgType: "Anemo", area: 2, cooldown: 3 },
    burst: { atk: 1, dmgType: "Anemo", area: "all", cooldown: 5 }
  })}
}
export class Lisa extends Character {
  constructor() { super("Lisa", {
    normal: { atk: 1, dmgType: "Electro" },
    skill: { atk: 1, dmgType: "Electro", debuff: "Conductive", cooldown: 1 },
    burst: { summon: { atk: 1, dmgType: "Electro", area: 3, duration: 3, cooldown: 5 } }
  })}
}
export class Kaeya extends Character {
  constructor() { super("Kaeya", {
    normal: { atk: 1 },
    skill: { atk: 2, dmgType: "Cryo", area: 2, cooldown: 2 },
    burst: { summon: { atk: 1, dmgType: "Cryo", duration: 3, target: 0, cooldown: 5 } }
  })}
}
export class Ningguang extends Character {
  constructor() { super("Ningguang", {
    normal: { atk: 1, dmgType: "Geo" },
    skill: { atk: 2, dmgType: "Cryo", area: 2, cooldown: 2 }, // TODO
    burst: { summon: { atk: 1, dmgType: "Cryo", duration: 3, target: 0, cooldown: 5 } }  // TODO
  })}
}

export class Enemy {
  hp: number;
  infusions: {
    [k in Element]?: any
  };

  protected constructor(
      public name: string,
      public maxHp: number,
      public attacks,
      public def: number = 0
  ) {
    this.hp = this.maxHp;
    this.infusions = {};
  }
}
export class Goomba extends Enemy {
  constructor() { super("Goomba", 2, { normal: { atk: 1 } }); }
}
export class Hilichurl extends Enemy {
  constructor(maxHp = 5) { super("Hilixú", maxHp, { normal: { atk: 1 } }); }
}
