import {Team} from "./mini";
import {Encounter} from "./encounter";

type Location = {
  encounter?: Encounter
  minerals?: boolean
  wish, // 1%
  crystalfly,
  cookingPot, // TODO pot quality
  flowers?
  chest
  bossEncounter
  archonTower // heal all 1 time
  domains // TODO vai ter mesmo?
  animals? // crabs, birds, boars
  fish?
  // fireflies, frogs, lizards
}

export type Expedition = {
  team: Team,
  area: string
  locations: Location[]
}

// Region(Mondstat) -> Area(StarfellValley) -> Location(encounter1+uncommonChest)

const StarfellValley = {
  // boars fishPonds dandelions grassLamps
  // encounters: [hilix3,sama,mitaAxe], [hilix3,sama,hilishooterx2,abyssMagePyro], [slimeAnemox3,slimeBigAnemo]
  // talents
  // domains[MidsummerCourtyard(thunderbird)]
  // bosses: [HypostasisAnemo, RegisvineCryo]
  // specialties: [Calla Lily,Cecilia,Dandelion Seed,Philanemo Mushroom,Small Lamp Grass,Valberry
}
const GalesongHill = {
// bosses: [HypostasisElectro]
  // specialties: [Calla Lily,Dandelion Seed,Small Lamp Grass,Windwheel Aster]
}
const BrightcrownMountains = {
  // weeklyBoss: [Stormterror]
  // specialties: [Calla Lily,Windwheel Aster]
}
const WindwailHighland = {
  // domains:[Cecilia Garden(tile,tooth,fetters), Forsaken Rift(teachingsFreedom,resistance,ballad),
  //   Valley of Remembrance(VV,MaidenBeloved)
  // weeklyBoss: [Andreus]
  // specialties: [Calla Lily,Dandelion Seed,Philanemo Mushroom,Small Lamp Grass,WindwheelAster,WolfHook
}
const Dragonspine = {
  // domains:[Peak of Vindagnyr(BlizzardStrayer,HeartOfDepth)]
  // bosses: [HypostasisCryo]
}

// Liuye
const BishuiPlain = {

}