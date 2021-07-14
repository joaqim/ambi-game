import { Engine, System, SignatureBuilder, Entity } from "@joaqim/ecs";
import { Model, Base, Primed } from "@joaqim/ecs";
import { Game } from "@ambi-ts/ambi-ts";

@Model("InputComponent")
export class InputComponent extends Base<InputComponent> {
  public key: string = "";
}

@Model("MoveComponent")
export class MoveComponent extends Base<MoveComponent> {
  public x: number = 0;
  public y: number = 0;
}

@Model("PositionComponent")
export class PositionComponent extends Base<PositionComponent> {
  static readonly tag = "PositionComponent";
  public x: number = 0;
  public y: number = 0;
}

export class TestSystem extends System {
  family: any;
  onAttach(engine: Engine) {
    // Needed to work properly
    super.onAttach(engine);
    // Families are an easy way to have groups of entities with some criteria.
    this.family = new SignatureBuilder(engine)
      .include(PositionComponent)
      .build();
  }
  update(_engine: Engine, delta: number): void {
    for (let entity of this.family.entities) {
      const position = entity.getComponent(PositionComponent);
      position.x += 10 * delta;
    }
  }
}

export class InputSystem extends System {
  family: any;
  onAttach(engine: Engine) {
    super.onAttach(engine);
    this.family = new SignatureBuilder(engine).include(InputComponent).build();
  }

  update(engine: Engine, delta: number): void {
    for (let entity of this.family.entities) {
      const input = entity.getComponent(InputComponent);
      input.key = "RIGHT";
    }
  }
}

export class MoveSystem extends System {
  static readonly MOVE_SPEED = 1;
  family: any;
  onAttach(engine: Engine) {
    super.onAttach(engine);
    this.family = new SignatureBuilder(engine)
      .include(PositionComponent)
      .include(InputComponent)
      .include(MoveComponent)
      .build();
  }

  update(engine: Engine, delta: number): void {
    for (let entity of this.family.entities) {
      const position = entity.getComponent(PositionComponent);
      const input = entity.getComponent(InputComponent);
      if (input.key == "LEFT") position.x -= MoveSystem.MOVE_SPEED * delta;
      else if (input.key == "RIGHT")
        position.x += MoveSystem.MOVE_SPEED * delta;
    }
  }
}

export class MyGame extends Base<Game> {}

/*
const PrimedEngine = (engine: Engine) => {
  if (engine === undefined) return new Engine();
};

const PrimedEntities = (entities: Entity[]) => {
  if (entities === undefined) return [];
};
@Model
export class MyGame extends Base<MyGame> {
  @Primed(PrimedEngine)
  public readonly engine!: Engine;

  private _lastTimestamp = 0;
  @Primed(PrimedEntities)
  public entities!: Entity[];

  awake(): void {
    console.log("awake()");
    this.engine.addSystem(new TestSystem());

    const e = new Entity({
      components: {
        PositionComponent: { x: 1, y: 0 },
        classes: { PositionComponent },
      },
    });

    // Make sure Update starts after all entities are awaken
    window.requestAnimationFrame(() => {
      // set initial timestamp
      this._lastTimestamp = Date.now();

      // start update loop
      this.update();
    });
  }

  update(): void {
    const delta = (Date.now() - this._lastTimestamp) / 1000;

    this.engine.update(delta);

    // update the timestamp
    this._lastTimestamp = Date.now();

    // Invoke on next frame
    window.requestAnimationFrame(() => this.update());
  }

  dispatch(): void {}
}
*/
