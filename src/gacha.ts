const fourStarChars = ["Amber", "Barbara", "Beidou", "Bennett", "Chongyun", "Diona", "Fischl", "Kaeya",
  "Lisa", "Ningguang", "Noelle", "Rosaria", "Razor", "Sara", "Sayu", "Sucrose", "Xiangling", "Xingqiu",
  "Xinyan", "Yanfei"];
const fiveStarChars = ["Jean", "Diluc", "Qiqi", "Keqing", "Mona"];
const fiveStarWeapons = ["Skyward Blade"]; // TODO
const fourStarWeapons = ["Rust"]; // TODO
const threeStarWeapons = ["Recurve Bow"]; // TODO

const fourStarPool = [...fourStarChars, ...fourStarWeapons];

const rates = [
  { rank: 5, rate: .006, pity: 73, pool: [...fiveStarChars, ...fiveStarWeapons] },
  { rank: 4, rate: .051, pity: 8, pool: [...fourStarChars, ...fourStarWeapons] },
  { rank: 3, rate: 1, pity: 1, pool: threeStarWeapons }
];

const standardBanner = [
  { rank: 5, rate: .006, pity: 73, pools: [{ pool: [...fiveStarChars, ...fiveStarWeapons] }] },
  { rank: 4, rate: .051, pity: 8, pools: [{ pool: fourStarPool }] },
  { rank: 3, pools: [{ pool: threeStarWeapons }] }
];

const kkomiBanner = [
  { rank: 5, rate: .006, pity: 73, pools: [
      { pool: ["Kokomi"], rate: .5 }, { pool: fiveStarChars }]},
  { rank: 4, rate: .051, pity: 8, pools: [
      { pool: ["Xingqiu", "Beidou", "Rosaria"], rate: .5 },
      { pool: [...fourStarChars, ...fourStarWeapons] }] },
  { rank: 3, pools: [{ pool: threeStarWeapons }] }
];

const createCharacterBanner = (feature5Stars: string[], feature4Stars: string[]) => [
  { rank: 5, rate: .006, pity: 73, pools: [{ pool: feature5Stars, rate: .5 }, { pool: fiveStarChars }]},
  { rank: 4, rate: .051, pity: 8, pools: [{ pool: feature4Stars, rate: .5 }, { pool: fourStarPool }] },
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

export type UserHistory = {
  [rate: number]: {
    counter: number,
    poolCounter: number,
    featureChoiceCounter?: number,
    featureChoice?: number
  }
}

const getDrop = (banner, counters: UserHistory) => {
  const x = Math.random();
  let sumRate = 0;
  return banner.find(({ rank, rate = 1, pity = 0 }) => {
    sumRate += rate + Math.max(0, (counters[rank].counter - pity) * 10 * rate);
    return x < sumRate;
  });
}

export const gachaPull = (
    counters: UserHistory,
    banner = standardBanner,
    rankRng = Math.random(),
    poolRng = Math.random(),
    pickRng = Math.random()
) => {
  let sumRate = 0;
  const drop = banner.find(({ rank, rate = 1, pity = 0 }) => {
    sumRate += rate + Math.max(0, (counters[rank]?.counter - pity) * 10 * rate);
    return rankRng < sumRate;
  });
  const counter = counters[drop.rank];

  Object.keys(counters).forEach(k => counters[k].counter++);
  counter.counter = 0;

  let poolSumRate = 0;
  const pool = drop.pools.find(({ rate = 1, pity = 0 }) => {
    poolSumRate += rate + Math.max(0, (counter.poolCounter - pity) * 10 * rate);
    return poolRng < poolSumRate;
  });
  // console.log( { drop, counter, pool });
  // counter.poolCounter = (counter.poolCounter + 1) % pool.length;
  if (pool.choicePity && counter.featureChoiceCounter++ > pool.choicePity) {
    counter.featureChoiceCounter = 0;
    counter.poolCounter = 0;
    return pool.pool[counter.featureChoice];
  }
  return pool.pool[Math.floor(pickRng * pool.pool.length)];
}

// featureChoice && poolCounter > choicePity ? featureChoice : Math.floor(Math.random() * (poolCounter > poolPity ? poolPityLength : pool.length))