import { Character, Element, Enemy } from './mini.ts';

const swirlElements: Element[] = ["Pyro", "Electro", "Hydro", "Cryo"];

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
    // target selection...
    const attack = char.attacks[atk];
    const targetEnemies = !attack.area ? [enemy] : attack.area === "all" ? this.enemies : this.enemies.slice(
        Math.max(0, this.enemies.indexOf(enemy) - Math.floor((attack.area - 1) / 2)),
        this.enemies.indexOf(enemy) + attack.area / 2 + 1
    );

    const spreadMap: { enemy: Enemy, element: Element }[] = [];
    targetEnemies.forEach(e => {
      const dmg = attack.atk - e.def;
      const swirlElement = swirlElements.find(it => e.infusions[it]);
      if (attack.dmgType === "Anemo" && swirlElement) { // swirl spread
        const swirlDamage = char.em;
        e.hp -= dmg + swirlDamage;
        const enemy1 = this.enemies[this.enemies.indexOf(e) - 1];
        const enemy2 = this.enemies[this.enemies.indexOf(e) + 1];
        if (enemy1) spreadMap.push({ enemy: enemy1, element: swirlElement });
        if (enemy2) spreadMap.push({ enemy: enemy2, element: swirlElement });
        msgs.push(`${e.name} took ${dmg} ${attack.dmgType} and ${swirlDamage} swirl ${swirlElement} damage!`);
      } else if (attack.dmgType === "Cryo" && e.infusions["Pyro"]) { // reverse melt
        e.hp -= dmg * 1.5 * char.em;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} melt damage!`);
        if (!e.infusions["Pyro"].melted)
          e.infusions["Pyro"].melted = true;
        else
          delete e.infusions["Pyro"];
        delete e.infusions["Cryo"];
      } else if (attack.dmgType === "Pyro" && e.infusions["Cryo"]) { // melt
        e.hp -= dmg * 2 * char.em;
        delete e.infusions["Pyro"];
        delete e.infusions["Cryo"];
        msgs.push(`${char.name} hit ${e.name} for ${dmg} Melt damage!`);
      } else if (attack.dmgType === "Pyro" && e.infusions["Hydro"]) { // reverse vaporize
        e.hp -= dmg * 1.5 * char.em;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} vaporize damage!`);
        if (!e.infusions["Hydro"].vaporized)
          e.infusions["Hydro"].vaporized = true;
        else
          delete e.infusions["Hydro"];
        delete e.infusions["Pyro"];
      } else if (attack.dmgType === "Hydro" && e.infusions["Pyro"]) { // vaporize
        e.hp -= dmg * 2 * char.em;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} Vaporize damage!`);
        delete e.infusions["Hydro"];
        delete e.infusions["Pyro"];
      } else if (attack.dmgType) {
        e.hp -= dmg;
        e.infusions[attack.dmgType] = { cooldown: 2 }
        msgs.push(`${char.name} hit ${e.name} for ${dmg} ${attack.dmgType} damage!`);
      } else {
        e.hp -= dmg;
        msgs.push(`${char.name} hit ${e.name} for ${dmg} damage!`);
      }
    });

    spreadMap.forEach(({ enemy, element}) => enemy.infusions[element] = { cooldown: 2 });
    this.enemies.forEach((e, i) => {
      if (e.infusions["Pyro"] && e.infusions["Electro"]) { // overload
        const overloadDmg = char.em;
        e.hp -= overloadDmg;
        msgs.push(`${e.name} ${i} took ${overloadDmg} overload damage!`);
        delete e.infusions["Pyro"];
        delete e.infusions["Electro"];
      }
    });

    const enemyDmg = enemy.attacks["normal"].atk - char.def;
    char.hp -= enemyDmg; // if not ranged
    msgs.push(`${enemy.name} hit back for ${enemyDmg}!`);

    this.enemies.filter(e => e.hp <= 0).forEach(f => msgs.push(`${f.name} fell!`));
    this.enemies = this.enemies.filter(e => e.hp > 0);

    this.logs.push(msgs);
    return msgs;
  }

  printState = (out = console) => {
    out.log("");
    this.logs[this.logs.length - 1].forEach(r => out.log(r));
    const colWidth = [16, 10, 10, 10];
    const maxLines = 2;
    const teamCells = this.team.myChars.map(c => [`${c.name} HP:${c.hp}/${c.maxHp}`]);
    const enemyCells = this.enemies.map(c => [c.name, `HP:${c.hp}/${c.maxHp}`]);
    for (let i = 0, paddingIdx = 0; i < maxLines; i++, paddingIdx = 0) {
      const teamLine = teamCells.map(c => (c[i] || "").padEnd(colWidth[paddingIdx++])).join("");
      const enemyLine = enemyCells.map(c => (c[i] || "").padEnd(colWidth[paddingIdx++])).join("");
      out.log(`${teamLine} - ${enemyLine}`);
    }
  }
}