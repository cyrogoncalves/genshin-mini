import {omastar} from "./omastar";

describe('path', () => {
  // beforeEach(() => {
  //   handlerInput = {...handlerInputMock};
  //   handlerInput.attributesManager.clearSessionAttributes();
  //   handlerInput.requestEnvelope.request.intent.name = "buscaPorGeneroIntent";
  // });

  it("from [0,0] to [8,5]", () => {
    const omastar1 = omastar({x:0, y:0}, {x:8, y:5});
    expect(omastar1.map(o=>`${o.x}_${o.y}`)).toEqual(["1_0", "2_0", "2_1", "2_2", "2_3", "2_4", "2_5", "3_5", "4_5", "5_5", "6_5", "7_5", "8_5"]);
  });

  it("from [0,0] to [2,3]", () => {
    const star = omastar({x:0, y:0}, {x:2, y:3});
    expect(star.map(o=>`${o.x}_${o.y}`)).toEqual(["1_0", "2_0", "2_1", "2_2", "2_3"]);
  });
});