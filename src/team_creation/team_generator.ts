import { UnitFactory, UnitType } from "../units/unit_factory.ts";
import { Unit } from "../units/unit_basic_class/Unit.ts";

export class TeamGenerator {
    private static unitTypes: UnitType[] = [
        "Archimage",
        "Bandit",
        "Bishop",
        "Centaur",
        "ElfArcher",
        "Monk",
        "SkeletonMage",
        "Skeleton",
        "Sirena",
    ];

    public static createRandomTeam(
        team: "red" | "green",
        rows: number,
        cols: number
    ): Unit[][] {
        const teamMatrix: Unit[][] = [];

        for (let i = 0; i < rows; i++) {
            const row: Unit[] = [];
            for (let j = 0; j < cols; j++) {
                const randomType = this.unitTypes[Math.floor(Math.random() * this.unitTypes.length)];
                row.push(UnitFactory.createUnit(randomType, team));
            }
            teamMatrix.push(row);
        }

        return teamMatrix;
    }
}