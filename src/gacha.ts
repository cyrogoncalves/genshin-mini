const fourStarChars = ["Amber", "Barbara", "Beidou", "Bennett", "Chongyun", "Diona", "Fischl", "Kaeya",
  "Lisa", "Ningguang", "Noelle", "Rosaria", "Razor", "Sara", "Sayu", "Sucrose", "Xiangling", "Xingqiu",
  "Xinyan", "Yanfei"];
const fiveStarChars = ["Jean", "Diluc", "Qiqi", "Keqing", "Mona"];
const fiveStarWeapons = ["Skyward Blade"]; // TODO
const fourStarWeapons = ["Rust"]; // TODO
const threeStarWeapons = ["Recurve Bow"]; // TODO

const fourStarPool = [...fourStarChars, ...fourStarWeapons];

const standardBanner = [
  { rank: 5, rate: .006, pity: 73, pools: [{ pool: [...fiveStarChars, ...fiveStarWeapons] }] },
  { rank: 4, rate: .051, pity: 8, pools: [{ pool: fourStarPool }] },
  { rank: 3, pools: [{ pool: threeStarWeapons }] }
];

const createCharacterBanner = (feature5Stars: string[], feature4Stars: string[]) => [
  { rank: 5, rate: .006, pity: 73, pools: [{ pool: feature5Stars, rate: .5 }, { pool: fiveStarChars }]},
  { rank: 4, rate: .051, pity: 7, pools: [{ pool: feature4Stars, rate: .5 }, { pool: fourStarPool }] },
  { rank: 3, pools: [{ pool: threeStarWeapons }] }
];

const createWeaponBanner = (feature5Stars: string[], feature4Stars: string[]) => [
  { rank: 5, rate: .007, pity: 63, pools: [
      { pool: feature5Stars, rate: .75, choicePity: 2 }, { pool: fiveStarWeapons }]},
  { rank: 4, rate: .06, pity: 7, pools: [
      { pool: feature4Stars, rate: .5 }, { pool: fourStarPool }] },
  { rank: 3, pools: [{ pool: threeStarWeapons }] }
];

export const kokomiBanner = createCharacterBanner(["Kokomi"], ["Xingqiu", "Beidou", "Rosaria"]);
export const donutBanner = createWeaponBanner(["Everlasting Moonglow", "Primordial Jade Cutter"],
    ["Stringless", "The Flute", "Favonius Codex", "Dragon's Bane", "Favonius Greatsword"]);

export type UserHistory = {
  [rate: number]: {
    counter: number,
    poolCounter: number,
    featureChoiceCounter?: number,
    featureChoice?: number
  }
}

export const gachaPull = (
    counters: UserHistory,
    banner = standardBanner,
    rankRng = Math.random(),
    poolRng = Math.random(),
    pickRng = Math.random()
) => {
  let sumRate = 0;
  const drop = banner.find(({ rank, rate = 1, pity = 0 }) =>
      rankRng < (sumRate += rate + Math.max(0, (counters[rank]?.counter - pity) * 10 * rate)));
  const counter = counters[drop.rank];

  let poolSumRate = 0;
  const pool = drop.pools.find(({ rate = 1, pity = 0 }) =>
      poolRng < (poolSumRate += rate + Math.max(0, (counter.poolCounter - pity) * 10 * rate)));

  const pick = pool.choicePity && counter.featureChoiceCounter++ > pool.choicePity
      ? counter.featureChoice : Math.floor(pickRng * pool.pool.length)
  return pool.pool[pick];
}
