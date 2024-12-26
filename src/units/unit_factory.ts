import { archimageUnit} from "./unit_classes/archimage_unit";
import { banditUnit } from "./unit_classes/bandit_unit";
import { bishopUnit } from "./unit_classes/bishop_unit";
import { centaurUnit } from "./unit_classes/centaur_unit";
import { elfArcherUnit } from "./unit_classes/elf_archer_unit";
import { monkUnit } from "./unit_classes/monk_unit";
import { skeletonMageUnit } from "./unit_classes/skeleton_mage_unit";
import { skeletonUnit } from "./unit_classes/skeleton_unit";
import { sirenaUnit } from "./unit_classes/unit_sirena";
import {Unit} from "./unit_basic_class/Unit";
export type UnitType =
    | "Archimage"
    | "Bandit"
    | "Bishop"
    | "Centaur"
    | "ElfArcher"
    | "Monk"
    | "SkeletonMage"
    | "Skeleton"
    | "Sirena";

type UnitConstructor = new (team: "red" | "green") => Unit;

export class UnitFactory {
    private static unitMapping: Record<UnitType, UnitConstructor> = {
        Archimage: archimageUnit,
        Bandit: banditUnit,
        Bishop: bishopUnit,
        Centaur: centaurUnit,
        ElfArcher: elfArcherUnit,
        Monk: monkUnit,
        SkeletonMage: skeletonMageUnit,
        Skeleton: skeletonUnit,
        Sirena: sirenaUnit,
    };

    public static createUnit(type: UnitType, team: "red" | "green"): Unit {
        const UnitConstructor = this.unitMapping[type];
        if (!UnitConstructor) {
            throw new Error(`Unit type "${type}" is not supported.`);
        }
        return new UnitConstructor(team);
    }
}
