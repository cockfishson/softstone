import {BattlefieldGrid} from "../battlefield/battlefield";
import {Unit} from "../units/unit_basic_class/Unit";

export abstract class TurnSystem {
    public static createTurnOrder(battlefieldGrid: BattlefieldGrid): Unit[] {
        const turnOrder: Unit[] = [];
        for (let row = 0; row < battlefieldGrid.length; row++) {
            for (let col = 0; col < battlefieldGrid[row].length; col++) {
                const actor = battlefieldGrid[row][col];
                if (actor) {
                    turnOrder.push(actor);
                }
            }
        }
        return turnOrder.sort((a, b) => {
            if (b.initiative === a.initiative) {
                return Math.random() - 0.5;
            }
            return b.initiative - a.initiative;
        });
    }

    public static nextMove(turnOrder: Unit[], currentMove: number): number {
        const totalUnits = turnOrder.length;
        let nextMove = (currentMove + 1) % totalUnits;

        while (turnOrder[nextMove]?.isDead || turnOrder[nextMove]?.isParalyzed) {
            if (turnOrder[nextMove]?.isParalyzed) {
                turnOrder[nextMove].resetParalysis();
            }
            turnOrder[nextMove].resetDefence();
            nextMove = (nextMove + 1) % totalUnits;
        }
        return nextMove;
    }
}

export default TurnSystem;