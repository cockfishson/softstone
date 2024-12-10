import { UnitFactory } from "../units/unit_factory";
import TurnSystem from "../turn_system/turn_system";
import { Battlefield } from "../battlefield/battlefield";
import { Unit } from "../units/unit_basic_class/Unit";

describe("TurnSystem Tests", () => {
    const createMockUnit = (initiative: number, team: "red" | "green", isDead = false): Unit => {
        const unit = UnitFactory.createUnit("Skeleton", team);
        unit.initiative = initiative;
        unit.isDead = isDead;
        return unit;
    };

    test("createTurnOrder sorts by initiative", () => {
        const battlefield = new Battlefield(2, 2);

        const redUnit1 = createMockUnit(10, "red");
        const greenUnit1 = createMockUnit(20, "green");
        const redUnit2 = createMockUnit(15, "red");

        battlefield.grid[0][0] = redUnit1;
        battlefield.grid[0][1] = greenUnit1;
        battlefield.grid[1][0] = redUnit2;

        const turnOrder = TurnSystem.createTurnOrder(battlefield.grid);

        expect(turnOrder[0]).toBe(greenUnit1);
        expect(turnOrder[1]).toBe(redUnit2);
        expect(turnOrder[2]).toBe(redUnit1);
    });

    test("createTurnOrder handles ties randomly", () => {
        const battlefield = new Battlefield(2, 2);

        const redUnit1 = createMockUnit(10, "red");
        const greenUnit1 = createMockUnit(15, "green");
        const redUnit2 = createMockUnit(15, "red");

        battlefield.grid[0][0] = redUnit1;
        battlefield.grid[0][1] = greenUnit1;
        battlefield.grid[1][0] = redUnit2;

        const turnOrders = Array.from({ length: 1000 }, () =>
            TurnSystem.createTurnOrder(battlefield.grid)
        );

        const redFirst = turnOrders.some(order => order[0] === redUnit2 && order[1] === greenUnit1);
        const greenFirst = turnOrders.some(order => order[0] === greenUnit1 && order[1] === redUnit2);

        expect(redFirst).toBe(true);
        expect(greenFirst).toBe(true);
    });


    test("nextMove skips dead or paralyzed units", () => {
        const units = [
            createMockUnit(10, "red"),
            createMockUnit(20, "green", true),
            createMockUnit(15, "red"),
        ];

        const currentMove = 0;
        const nextMoveIndex = TurnSystem.nextMove(units, currentMove);
        expect(nextMoveIndex).toBe(2);
    });

    test("Battlefield turn order matches TurnSystem's order", () => {
        const battlefield = new Battlefield(2, 2);

        const redUnit1 = createMockUnit(10, "red");
        const greenUnit1 = createMockUnit(20, "green");
        const redUnit2 = createMockUnit(15, "red");

        battlefield.placeTeams([[redUnit1, greenUnit1]], [[redUnit2]]);

        const expectedOrder = [greenUnit1, redUnit2, redUnit1];
        expect(battlefield.getTurnOrder()).toEqual(expectedOrder);
    });
});
