import { PositionComponent } from "./game";

describe("Game >>>", () => {
  it("Reflection should work", () => {
    let p = new PositionComponent({ x: 1, y: 2 });
    expect(p.x).toBe(1);
    expect(p.y).toBe(2);
    console.log(p);
  });
});
