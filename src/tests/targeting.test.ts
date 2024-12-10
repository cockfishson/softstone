import { Battlefield } from "../battlefield/battlefield";
import { Action } from "../actions/action";
import { meleeUnit } from "../units/unit_base_classes/melee_unit";
import { rangeUnit } from "../units/unit_base_classes/ranged_unit";
import { AOEAttackUnit } from "../units/unit_base_classes/AOE_attack_unit";
import { healerUnit } from "../units/unit_base_classes/healer_unit";
import { massHealerUnit } from "../units/unit_base_classes/mass_healer_unit";
import { paralyzingUnit } from "../units/unit_base_classes/paralyzing_unit";

describe("Targeting Logic", () => {
    let battlefield: Battlefield;

    beforeEach(() => {
        battlefield = new Battlefield(4, 3);
    });

    test("Melee unit targets closest enemy", () => {
        const melee = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const enemy1 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy2 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy3 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        enemy1.isDead = true;
        enemy2.isDead = true;
        battlefield.grid[1][0] = melee;
        battlefield.grid[2][0] = enemy1;
        battlefield.grid[2][1] = enemy2;
        battlefield.grid[2][2] = enemy3;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(melee);
        expect(targets).toEqual([{ row: 2, col: 2 }]);
    });

    test("Melee unit targets anyone in a front line if adjacent enemies are dead ", () => {
        const melee = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const enemy = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        battlefield.grid[1][1] = melee;
        battlefield.grid[2][1] = enemy;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(melee);
        expect(targets).toEqual([{ row: 2, col: 1 }]);
    });

    test("Melee unit next row if front line is dead", () => {
        const melee = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const enemy1 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy2 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy3 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy4 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        enemy1.isDead = true;
        enemy2.isDead = true;
        enemy3.isDead = true;
        battlefield.grid[1][1] = melee;
        battlefield.grid[2][0] = enemy1;
        battlefield.grid[2][1] = enemy2;
        battlefield.grid[2][2] = enemy3;
        battlefield.grid[3][1] = enemy4;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(melee);
        expect(targets).toEqual([{ row: 3, col: 1 }]);
    });

    test("Melee unit backlines target each other if frontlines are dead", () => {
        const melee1 = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const melee2 = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const melee3 = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const melee4 = new meleeUnit("Melee", 100, 100, 10, "melee.png", "red",0);
        const enemy1 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy2 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy3 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        const enemy4 = new rangeUnit("Enemy", 50, 50, 10, "enemy.png", "green",0);
        melee1.isDead = true;
        melee2.isDead = true;
        melee3.isDead = true;
        enemy1.isDead = true;
        enemy2.isDead = true;
        enemy3.isDead = true;
        battlefield.grid[1][1] = melee1;
        battlefield.grid[1][1] = melee2;
        battlefield.grid[1][2] = melee3;
        battlefield.grid[0][1] = melee4;
        battlefield.grid[2][0] = enemy1;
        battlefield.grid[2][1] = enemy2;
        battlefield.grid[2][2] = enemy3;
        battlefield.grid[3][1] = enemy4;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(melee4);
        expect(targets).toEqual([{ row: 3, col: 1 }]);
    });

    test("Ranged unit targets any enemy", () => {
        const ranged = new rangeUnit("Ranged", 100, 100, 10, "ranged.png", "red",0);
        const enemy1 = new meleeUnit("Enemy1", 50, 50, 10, "enemy1.png", "green",0);
        const enemy2 = new AOEAttackUnit("Enemy2", 70, 70, 10, "enemy2.png", "green",0);
        battlefield.grid[0][0] = ranged;
        battlefield.grid[3][2] = enemy1;
        battlefield.grid[2][1] = enemy2;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(ranged);
        expect(targets).toEqual([
            { row: 3, col: 2 },
            { row: 2, col: 1 },
        ]);
    });

    test("AOE unit targets all enemies", () => {
        const aoe = new AOEAttackUnit("AOE", 120, 120, 15, "aoe.png", "red",0);
        const enemy1 = new meleeUnit("Enemy1", 50, 50, 10, "enemy1.png", "green",0);
        const enemy2 = new rangeUnit("Enemy2", 70, 70, 10, "enemy2.png", "green",0);
        battlefield.grid[1][1] = aoe;
        battlefield.grid[3][2] = enemy1;
        battlefield.grid[0][0] = enemy2;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(aoe);
        expect(targets).toEqual([
            { row: 3, col: 2 },
            { row: 0, col: 0 },
        ]);
    });

    test("Healer targets allies", () => {
        const healer = new healerUnit("Healer", 90, 90, 12, "healer.png", "red",0);
        const ally = new meleeUnit("Ally", 50, 50, 10, "ally.png", "red",0);
        const enemy = new rangeUnit("Enemy", 70, 70, 10, "enemy.png", "green",0);
        battlefield.grid[1][1] = healer;
        battlefield.grid[1][0] = ally;
        battlefield.grid[2][1] = enemy;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(healer);
        expect(targets).toEqual([{ row: 1, col: 0 }]);
    });

    test("Mass Healer targets all allies", () => {
        const massHealer = new massHealerUnit("MassHealer", 100, 100, 12, "mass_healer.png", "red",0);
        const ally1 = new meleeUnit("Ally1", 50, 50, 10, "ally1.png", "red",0);
        const ally2 = new rangeUnit("Ally2", 70, 70, 10, "ally2.png", "red",0);
        battlefield.grid[1][1] = massHealer;
        battlefield.grid[0][0] = ally1;
        battlefield.grid[2][2] = ally2;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(massHealer);
        expect(targets).toEqual([
            { row: 2, col: 2 },
            { row: 0, col: 0 },
        ]);
    });

    test("Paralyzing unit targets any enemy", () => {
        const paralyzer = new paralyzingUnit("Paralyzer", 100, 100, 14, "paralyze.png", "red");
        const enemy = new meleeUnit("Enemy", 60, 60, 12, "enemy.png", "green",0);
        battlefield.grid[1][1] = paralyzer;
        battlefield.grid[2][2] = enemy;

        const action = new Action(battlefield.grid);
        const targets = action.getTargetsForUnit(paralyzer);
        expect(targets).toEqual([{ row: 2, col: 2 }]);
    });
});
