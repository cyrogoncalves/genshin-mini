import { Character, Element, Enemy, Team } from './mini.ts';

const swirlElements: Element[] = ["pyro", "electro", "hydro", "cryo"];

export class Encounter {
  logs: string[][] = [];

  constructor(
      public readonly description: string,
      public enemies: Enemy[],
      public team: Team
  ) {
    this.logs.push([description]);
  }

  get over() {
    return !this.enemies.length || this.team.myChars.every(c => c.hp <= 0);
  }

  hit = (
      atk: "normal" | "skill" | "burst" = "normal",
      enemy: Enemy = this.enemies[0],
      char: Character = this.team.myChars[this.team.cur || 0]
  ) => {
    const msgs: string[] = [];
    // target selection...
    const attack = char.attacks[atk];
    const targetEnemies = !attack.area ? [enemy] : attack.area === "all" ? this.enemies : this.enemies.slice(
        Math.max(0, this.enemies.indexOf(enemy) - Math.floor((attack.area - 1) / 2)),
        this.enemies.indexOf(enemy) + attack.area / 2 + 1
    );

    const spreadMap: { enemy: Enemy, element: Element }[] = [];
    let cristalizeElement: Element | undefined;
    if (!attack.atk) return;
    targetEnemies.forEach(e => {
      const dmg = attack.atk ?? 0 - e.def;
      const swirlElement = swirlElements.find(it => e.infusions[it]);
      if (attack.dmgType === "anemo" && swirlElement) { // swirl spread
        const swirlDamage = char.em;
        e.hp -= dmg + swirlDamage;
        const enemy1 = this.enemies[this.enemies.indexOf(e) - 1];
        const enemy2 = this.enemies[this.enemies.indexOf(e) + 1];
        if (enemy1) spreadMap.push({ enemy: enemy1, element: swirlElement });
        if (enemy2) spreadMap.push({ enemy: enemy2, element: swirlElement });
        msgs.push(`${e.name} took ${dmg} ${attack.dmgType} and ${swirlDamage} swirl ${swirlElement} damage!`);
      } else if (attack.dmgType === "geo"  && swirlElement) { // cristalize
        e.hp -= dmg;
        cristalizeElement = swirlElement;
        if (!e.infusions[swirlElement]?.cristalized)
          e.infusions[swirlElement]!.cristalized = true;
        else
          delete e.infusions[swirlElement];
        msgs.push(`${e.name} took ${dmg} ${attack.dmgType} damage!`);
      } else if (attack.dmgType === "cryo" && e.infusions["pyro"]) { // reverse melt
        e.hp -= dmg * 1.5 * char.em;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} melt damage!`);
        if (!e.infusions["pyro"].melted)
          e.infusions["pyro"].melted = true;
        else
          delete e.infusions["pyro"];
        delete e.infusions["cryo"];
      } else if (attack.dmgType === "pyro" && e.infusions["cryo"]) { // melt
        e.hp -= dmg * 2 * char.em;
        delete e.infusions["pyro"];
        delete e.infusions["cryo"];
        msgs.push(`${char.name} hit ${e.name} for ${dmg} Melt damage!`);
      } else if (attack.dmgType === "pyro" && e.infusions["hydro"]) { // reverse vaporize
        e.hp -= dmg * 1.5 * char.em;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} vaporize damage!`);
        if (!e.infusions["hydro"].vaporized)
          e.infusions["hydro"].vaporized = true;
        else
          delete e.infusions["hydro"];
        delete e.infusions["Pyro"];
      } else if (attack.dmgType === "hydro" && e.infusions["pyro"]) { // vaporize
        e.hp -= dmg * 2 * char.em;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} Vaporize damage!`);
        delete e.infusions["hydro"];
        delete e.infusions["pyro"];
      } else if (attack.dmgType) {
        e.hp -= dmg;
        e.infusions[attack.dmgType] = { cooldown: 2 }
        msgs.push(`${char.name} hit ${e.name} for ${dmg} ${attack.dmgType} damage!`);
      } else {
        e.hp -= dmg;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} damage!`);
      }
      // TODO superConduct overload freeze
    });

    spreadMap.forEach(({ enemy, element }) => enemy.infusions[element] = { cooldown: 2 });
    this.enemies.forEach((e, i) => {
      if (e.infusions["pyro"] && e.infusions["electro"]) { // overload
        const overloadDmg = char.em;
        e.hp -= overloadDmg;
        msgs.push(`${e.name} ${i} took ${overloadDmg} overload damage!`);
        delete e.infusions["pyro"];
        delete e.infusions["electro"];
      }
    });

    const enemyAttack = enemy.attack(this);
    [...enemyAttack.atk].forEach(enemyAtk => {
      if (!this.team.shields) this.team.shields = {};
      const maxShield = Object.values(this.team.shields!)
          .reduce((max, shield) => shield.hp > max ? shield.hp : max, 0);
      if (maxShield > 0) {
        // TODO shield types
        Object.values(this.team.shields!).forEach(s => s.hp -= enemyAtk);
        Object.entries(this.team.shields!)
            .filter(([_n, s]) => s.hp <= 0)
            .map(([n]) => n)
            .forEach(it => delete this.team.shields![it]);
      }
      const enemyDmg = enemyAtk - (maxShield || char.def);
      if (enemyDmg > 0) char.hp -= enemyDmg; // if not ranged TODO
    })
    msgs.push(enemyAttack.msg);

    if (cristalizeElement)
      this.team.shields.cristalize =
        { type: cristalizeElement, cooldown: 2, hp: char.em };

    this.enemies.filter(e => e.hp <= 0).forEach(f => msgs.push(`${f.name} fell!`));
    this.enemies = this.enemies.filter(e => e.hp > 0);

    this.logs.push(msgs);
    return msgs;
  }
}