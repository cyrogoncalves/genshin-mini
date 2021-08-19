// model
// Amber (****) Ascension 6 (++++++) Constellation 0 (------)
//    talents Normal 0 (------) Elemental 6 (++++++) Burst 3 (+++---)

const unit = "Amber_A6C0_N1E6B1";
const weapon = "Amos_R1A6";
// Crimson Witch Atk Plume 5* (+++++) 1atk 3cr 2er 2cd
const artifact = "Witch_AP_S5A5_1a3p2r2c";

type Element = 'Pyro' | 'Hydro' | 'Electro' | 'Cryo' | 'Anemo' | 'Geo' | 'Dendro';

interface CharacterModel {
  name: string,
  def: number,
  maxHp: number,
  attacks: { normal, skill, burst }
}
interface Character extends CharacterModel {
  hp: number
}

const baronBunny = {
  name: "Baron Bunny",
  hp: 3,
  taunt: true,
  cooldown: 2,
  onEnd: { atk: 3, dmgType: "Pyro", area: 2 }
}
const amberModel: CharacterModel = {
  name: "Amber",
  def: 0,
  maxHp: 10,
  attacks: {
    normal: { atk: 1 },
    skill: { summon: baronBunny },
    burst: { atk: 2, dmgType: "Pyro", area: 3 }
  }
}
const lumineAnemoModel: CharacterModel = {
  name: "Lumine",
  def: 0,
  maxHp: 10,
  attacks: {
    normal: { atk: 1 },
    skill: { atk: [1, 2], dmgType: "Anemo", area: 2 },
    burst: { atk: 1, dmgType: "Anemo", area: "all" }
  }
}
const lisaModel: CharacterModel = {
  name: "Lisa",
  def: 0,
  maxHp: 10,
  attacks: {
    normal: { atk: 1, dmgType: "Electro" },
    skill: { atk: 1, dmgType: "Electro", debuff: "Conductive" },
    burst: { atk: 1, dmgType: "Electro", area: 3 }
  }
}

export const amber: Character = {
  ...amberModel,
  hp: amberModel.maxHp,
}
export const lumine: Character = { ...lumineAnemoModel, hp: amberModel.maxHp };
export const lisa: Character = { ...lisaModel, hp: amberModel.maxHp };

class Enemy {
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

  infuse = (e: Element) => this.infusions[e] = { cooldown: 2 };
}
export class Goomba extends Enemy {
  constructor() { super("Goomba", 2, { normal: { atk: 1 } }); }
}
export class Hilichurl extends Enemy {
  constructor() { super("Hilixú", 5, { normal: { atk: 1 } }); }
}

export class Encounter {
  logs: String[][] = [];

  constructor(
      public readonly description: string,
      public enemies: Enemy[],
      public team?
  ) {
    this.logs.push([description]);
  }

  get over() {
    return !this.enemies.length || this.team.myChars.every(c => c.hp <= 0);
  }

  hit = (char: Character, enemy: Enemy, atk = "normal") => {
    const msgs: String[] = [];

    const attack = char.attacks[atk];
    const targetEnemies = attack.area === "all" ? this.enemies : (() => {
      const enemyIdx = this.enemies.indexOf(enemy);
      const area = attack.area || 1;
      return this.enemies.slice(Math.max(0, enemyIdx - (area - 1) / 2), enemyIdx + area / 2 + 1);
    })();

    const charDmg: number[] = [];
    const spreadMap: {idx: number, element: Element}[] = [];
    targetEnemies.forEach(e => {
      const dmg = attack.atk - e.def;
      charDmg.push(dmg);
      e.hp -= dmg;

      if (attack.dmgType) {
        if (attack.dmgType === "Anemo") {
          const swirlElements: Element[] = ["Pyro", "Electro", "Hydro", "Cryo"];
          const swirlElement = swirlElements.find(it => e.infusions[it]);
          if (swirlElement) { // swirl
            e.hp -= 1; // TODO EM // TODO msg
            spreadMap.push({idx: this.enemies.indexOf(e) - 1, element: swirlElement});
            spreadMap.push({idx: this.enemies.indexOf(e) + 1, element: swirlElement});
          }
        } else {
          e.infusions[attack.dmgType] = { cooldown: 2 };
        }
      }
    });
    spreadMap.filter(({idx}) => this.enemies[idx]).forEach(({ idx, element}) => {
      this.enemies[idx].infusions[element] = { cooldown: 2 };
    });

    this.enemies.forEach(e => {
      if (e.infusions["Pyro"] && e.infusions["Electro"]) { // overload
        e.hp -= 1; // TODO EM // TODO msg
        delete e.infusions["Pyro"];
        delete e.infusions["Electro"];
      }
    });
    msgs.push(`${char.name} hit ${targetEnemies.map(e => e.name)} for ${charDmg}!`);

    const enemyDmg = enemy.attacks["normal"].atk - char.def;
    char.hp -= enemyDmg; // if not ranged
    msgs.push(`${enemy.name} hit back for ${enemyDmg}!`);

    const falls: Enemy[] = [];
    this.enemies.forEach(e => {
      if (e.hp <= 0) falls.push(e);
    });
    falls.forEach(f => msgs.push(`${f.name} fell!`));
    this.enemies = this.enemies.filter(e => e.hp > 0);

    this.logs.push(msgs);
    return msgs;
  }

  printState = (out = console.log) => {
    out.log("");
    this.logs[this.logs.length - 1].forEach(r => out.log(r));
    const colWidth = [16, 10, 10, 10];
    const maxLines = 2;
    const teamCells = this.team.myChars.map(c => [`${c.name} HP:${c.hp}/${c.maxHp}`]);
    const enemyCells = this.enemies.map(c => [c.name, `HP:${c.hp}/${c.maxHp}`]);
    for (let i = 0, paddingIdx = 0; i < maxLines; i++, paddingIdx = 0) {
      const teamLine = teamCells.map(c => (c[i] || "").padEnd(colWidth[paddingIdx++])).join("");
      const enemyLine = enemyCells.map(c => (c[i] || "").padEnd(colWidth[paddingIdx++])).join("");
      out(`${teamLine} - ${enemyLine}`);
    }
  }
}
