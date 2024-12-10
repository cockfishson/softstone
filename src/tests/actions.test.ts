import { BattlefieldGrid } from "../battlefield/battlefield";
import {Action} from "../actions/action";
import { meleeUnit } from "../units/unit_base_classes/melee_unit";
import { rangeUnit } from "../units/unit_base_classes/ranged_unit";
import { AOEAttackUnit } from "../units/unit_base_classes/AOE_attack_unit";
import { healerUnit } from "../units/unit_base_classes/healer_unit";
import { massHealerUnit } from "../units/unit_base_classes/mass_healer_unit";
import { paralyzingUnit } from "../units/unit_base_classes/paralyzing_unit";

describe("Action Tests for All Hero Types", () => {
    let battlefield: BattlefieldGrid;
    let action: Action;

    beforeEach(() => {
        battlefield = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        action = new Action(battlefield);
    });

    test("Melee Unit can attack", () => {
        const attacker = new meleeUnit("Melee", 100, 100, 10, "", "red", 20);
        const target = new meleeUnit("Target", 100, 100, 10, "", "green", 20);

        battlefield[1][0] = attacker;
        battlefield[2][0] = target;

        const success = action.executeAction(attacker, 2, 0);
        expect(success).toBe(true);
        expect(target.health).toBe(80);
    });

    test("Range Unit can attack", () => {
        const attacker = new rangeUnit("Ranged", 100, 100, 10, "", "red", 15);
        const target = new meleeUnit("Target", 100, 100, 10, "", "green", 20);

        battlefield[0][0] = attacker;
        battlefield[2][0] = target;

        const success = action.executeAction(attacker, 2, 0);
        expect(success).toBe(true);
        expect(target.health).toBe(85);
    });

    test("AOE Unit can attack multiple targets", () => {
        const attacker = new AOEAttackUnit("AOE", 100, 100, 10, "", "red", 10);
        const target1 = new meleeUnit("Target1", 100, 100, 10, "", "green", 20);
        const target2 = new meleeUnit("Target2", 100, 100, 10, "", "green", 20);

        battlefield[1][0] = attacker;
        battlefield[2][0] = target1;
        battlefield[2][1] = target2;

        const success = action.executeAction(attacker, 2, 0);
        expect(success).toBe(true);
        expect(target1.health).toBe(90);
        expect(target2.health).toBe(90);
    });

    test("Healer Unit can heal a target", () => {
        const healer = new healerUnit("Healer", 100, 100, 10, "", "red", 10);
        const target = new meleeUnit("Target", 100, 50, 10, "", "red", 20);

        battlefield[1][0] = healer;
        battlefield[2][0] = target;

        const success = action.executeAction(healer, 2, 0);
        expect(success).toBe(true);
        expect(target.health).toBe(60);
    });

    test("Mass Healer Unit can heal multiple targets", () => {
        const healer = new massHealerUnit("MassHealer", 100, 100, 10, "", "red", 10);
        const target1 = new meleeUnit("Target1", 100, 50, 10, "", "red", 20);
        const target2 = new meleeUnit("Target2", 100, 60, 10, "", "red", 20);

        battlefield[1][0] = healer;
        battlefield[2][0] = target1;
        battlefield[2][1] = target2;

        const success = action.executeAction(healer, 2, 0);
        expect(success).toBe(true);
        expect(target1.health).toBe(60);
        expect(target2.health).toBe(70);
    });

    test("Paralyzing Unit can paralyze a target", () => {
        const paralyzer = new paralyzingUnit("Paralyzer", 100, 100, 10, "", "red");
        const target = new meleeUnit("Target", 100, 100, 10, "", "green", 20);

        battlefield[1][0] = paralyzer;
        battlefield[2][0] = target;

        const success = action.executeAction(paralyzer, 2, 0);
        expect(success).toBe(true);
        expect(target.isParalyzed).toBe(true);
    });

    test("Defence protects from 1/2 of damage", () => {
        const attacker = new meleeUnit("Melee", 100, 100, 10, "", "red", 20);
        const target = new meleeUnit("Target", 100, 100, 10, "", "green", 20);
        target.defend();
        battlefield[1][0] = attacker;
        battlefield[2][0] = target;

        const success = action.executeAction(attacker, 2, 0);
        expect(success).toBe(true);
        expect(target.health).toBe(90);
    });
});
