// model
// Amber (****) Ascension 6 (++++++) Constellation 0 (------)
//    talents Normal 0 (------) Elemental 6 (++++++) Burst 3 (+++---)

// const unit = "Amber_A6C0_N1E6B1";
// const weapon = "Amos_R1A6";
// // Crimson Witch Atk Plume 5* (+++++) 1atk 3cr 2er 2cd
// const artifact = "Witch_AP_S5A5_1a3p2r2c";

import {Encounter} from "./encounter";

export type Element = "pyro" | "hydro" | "electro" | "cryo" | "anemo" | "geo" | "dendro";

export type Team = {
  myChars: Character[],
  cur?: number // current
  shields?: { [name in string]: { hp: number, type: Element, cooldown: number } }
}

type Attack = {
  atk?: number,
  dmgType?: Element,
  area?: number | "all",
  cooldown?: number,
  summon?: any,
  debuff?: string
}

export abstract class Character {
  public readonly cooldowns: { [k in string]: number } = {};

  protected constructor(
      public readonly name: string,
      public readonly attacks: { normal: Attack, skill: Attack, burst: Attack },
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
  onEnd: { atk: 3, dmgType: "pyro", area: 2 }
}
export class Amber extends Character {
  constructor() { super("Amber", {
    normal: { atk: 1 },
    skill: { summon: baronBunny, cooldown: 3 },
    burst: { atk: 2, dmgType: "pyro", area: 3, cooldown: 5 }
  })}
}
export class Traveler extends Character {
  constructor(name = "Lumine") { super(name, {
    normal: { atk: 1 },
    skill: { atk: 2, dmgType: "anemo", area: 2, cooldown: 3 },
    burst: { atk: 1, dmgType: "anemo", area: "all", cooldown: 5 }
  })}
}
export class Lisa extends Character {
  constructor() { super("Lisa", {
    normal: { atk: 1, dmgType: "electro" },
    skill: { atk: 1, dmgType: "electro", debuff: "Conductive", cooldown: 1 },
    burst: { summon: { atk: 1, dmgType: "electro", area: 3, duration: 3, cooldown: 5 } }
  })}
}
export class Kaeya extends Character {
  constructor() { super("Kaeya", {
    normal: { atk: 1 },
    skill: { atk: 2, dmgType: "cryo", area: 2, cooldown: 2 },
    burst: { summon: { atk: 1, dmgType: "cryo", duration: 3, target: 0, cooldown: 5 } }
  })}
}
export class Ningguang extends Character {
  constructor() { super("Ningguang", {
    normal: { atk: 1, dmgType: "geo" },
    skill: { atk: 2, dmgType: "cryo", area: 2, cooldown: 2 }, // TODO
    burst: { summon: { atk: 1, dmgType: "cryo", duration: 3, target: 0, cooldown: 5 } }  // TODO
  })}
}

/** ENEMIES */

export abstract class Enemy {
  hp: number;
  infusions: {
    [k in Element]?: {
      cooldown: number,
      cristalized?: boolean,
      melted?: boolean,
      vaporized?: boolean
    };
  };

  protected constructor(
      public name: string,
      public maxHp: number,
      // public attacks: {[k in "normal" | "skill" | "burst"]?: Attack},
      public def: number = 0
  ) {
    this.hp = this.maxHp;
    this.infusions = {};
  }

  abstract attack(encounter: Encounter): {atk?:number[], msg:string}
}
export class Goomba extends Enemy {
  constructor() { super("Goomba", 2); }

  attack(encounter: Encounter): { atk?: number[]; msg: string } {
    return { atk: [1], msg:"O goomba bateu 1" };
  }
}
export class Hilichurl extends Enemy {
  constructor(maxHp = 5) { super("Hilixú", maxHp); }

  attack(encounter: Encounter): { atk?: number[]; msg: string } {
    return { atk: [1], msg:"O hilixú bateu 1" };
  }
}
export class MitachurlAxePyro extends Enemy {
  infusedPyro = false;
  constructor(maxHp = 15) { super("Mitaxú🪓", maxHp); }
  attack(encounter) {
    if (!this.infusedPyro && Math.random() > 0.5) {
      this.infusedPyro = true;
      return {msg:"O mitaxú infundiu seu machado com pyro🔥!"}
    }
    if (encounter.turns.length === 0) {
      return {atk:[2, 2], msg:"O mitaxú atacou com seu machado e deu 2 + 2 de dano!"};
    }
    if (this.infusedPyro) {
      switch (Math.floor(Math.random()*3)) {
        case 0: return {atk:[4, 4], dmgType:"pyro", msg:"O mitaxú atacou com seu machado e deu 4🔥 + 4🔥"}
        case 1: return {atk:[3, 3, 3], dmgType:"pyro", msg:"O mitaxú começou a girar! Deu 3🔥 + 3🔥 + 3🔥"}
        default: return {atk:[5], dmgType:"pyro", msg:"O mitaxú pulou com tudo em você! Deu 7🔥"}
      }
    } else {
      switch (Math.floor(Math.random()*3)) {
        case 0: return {atk:[2, 2], msg:"O mitaxú atacou com seu machado e deu 2 + 2"}
        case 1: return {atk:[2, 2, 2], msg:"O mitaxú começou a girar! Deu 2 + 2 + 2"}
        default: return {atk:[5], msg:"O mitaxú pulou com tudo em você! Deu 5"}
      }
    }
  }
}
export class SamachurlHydro extends Enemy {
  healing = 0;
  constructor(maxHp = 5) { super("Samaxú🌊", maxHp); }
  resistances: {hydro:2}
  attack(encounter: Encounter) {
    const enemies = encounter.enemies;
    if (this.healing-- < 1 && enemies.some(e => e.hp < e.maxHp * 0.6))
      this.healing = 2;
    if (this.healing) {
      const enemy: Enemy = enemies.reduce((e, min) => e.hp < min.hp ? e : min, enemies[0]);
      encounter.targets(enemy, 3).forEach(e => e.hp = Math.min(e.maxHp, e.hp + 4));
      return {msg:this.healing === 2 ? "O samaxú hydro começou uma chuva de cura 🌊"
            : "O samaxú continua dançando e curando 🌊"}
    }
    return {atk:[1], dmgType:"hydro", msg:"O samaxú hydro ataca! 1🌊"};
  }
}
// export class RuinGuard extends Enemy {
//   constructor(maxHp = 35) {
//     super("Guarda das Ruínas", maxHp, {
//       stomp: {atk:5},
//       clap: {atk:8},
//       beyblade: {atk:[3,3,3], stance:"beyblade"},
//       missiles: {atk:[2,2,2,2,2,2], ranged:true}
//     });
//   }
// }
export class SlimePyro extends Enemy {
  infusedPyro = true;
  constructor(maxHp = 4) { super("Geleco🔥", maxHp); }
  onFaint: (encounter) => "explode with 1 damage";
  resistances: {pyro:9999} //⚡ 🌊 💥 💧 💦 🔥 ⚡ ❄ ⛰ ▰▱
  attack(encounter) {
    if (!this.infusedPyro && Math.random() > 0.5) {
      this.infusedPyro = true;
      return {msg:"O slime pyro acendeu de volta! 🔥"}
    }
    return !this.infusedPyro ? {atk:[1], msg:"O slime pyro bateu com 1"}
        : {atk:[2], dmgType:"pyro", msg:"O slime pyro bateu com 2🔥"};
  }
}
