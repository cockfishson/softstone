import { Unit } from "../units/unit_basic_class/Unit";
import { BattlefieldGrid } from "../battlefield/battlefield";
import { meleeUnit } from "../units/unit_base_classes/melee_unit";
import {rangeUnit} from "../units/unit_base_classes/ranged_unit";
import {AOEAttackUnit} from "../units/unit_base_classes/AOE_attack_unit";
import {healerUnit} from "../units/unit_base_classes/healer_unit";
import {massHealerUnit} from "../units/unit_base_classes/mass_healer_unit";
import {paralyzingUnit} from "../units/unit_base_classes/paralyzing_unit";

export class Action {
    readonly battlefieldGrid: BattlefieldGrid;

    constructor(battlefieldGrid: BattlefieldGrid) {
        this.battlefieldGrid = battlefieldGrid;
    }

    public executeAction(performer: Unit, targetRow: number, targetCol: number): boolean {
        const target = this.battlefieldGrid[targetRow][targetCol];
        if (!target || target.isDead) return false;

        if (performer instanceof meleeUnit || performer instanceof rangeUnit) {
            performer.attack(target);
            return true;
        } else if (performer instanceof AOEAttackUnit) {
            const targets = this.getAllEnemyHeroes(performer);
            const unitTargets: Unit[] = targets.map(t => this.battlefieldGrid[t.row][t.col]!).filter(Boolean);
            performer.massAttack(unitTargets);
            return true;
        } else if (performer instanceof healerUnit) {
            performer.heal(target);
            return true;
        } else if(performer instanceof massHealerUnit) {
            const targets = this.getAllAlliedHeroes(performer);
            const unitTargets: Unit[] = targets.map(t => this.battlefieldGrid[t.row][t.col]!).filter(Boolean);
            performer.massHeal(unitTargets);
            return true;
        } else if(performer instanceof paralyzingUnit) {
            performer.paralyze(target);
            return true;
        }

        console.warn(`Unhandled Performer type: ${performer.constructor.name}`);
        console.log(performer instanceof paralyzingUnit);
        console.log(performer);
        return false;
    }

    public getTargetsForUnit(unit: Unit): { row: number; col: number }[] {
        if (unit instanceof meleeUnit) {
            return this.getMeleeTargets(unit);
        } else if (unit instanceof rangeUnit || unit instanceof AOEAttackUnit || unit instanceof paralyzingUnit) {
            return this.getAllEnemyHeroes(unit);
        } else if (unit instanceof healerUnit) {
            return this.getAllAlliedHeroes(unit);
        }else if (unit instanceof massHealerUnit) {
            return this.getAllAlliedHeroes(unit);
        }
        return [];
    }

    public getMeleeTargets(attacker: Unit): { row: number; col: number }[] {
        const attackerRow = this.findUnitRow(attacker);
        const attackerCol = this.findUnitCol(attacker);

        if (attackerRow === -1 || attackerCol === -1) {
            throw new Error("Attacker is not on the battlefield");
        }

        const alliedFrontlineRow = this.getAlliedFrontlineRow(attacker.team);
        const opponentFrontlineRow = this.getOpponentFrontlineRow(attacker.team);

        const isAlliedFrontlineDead = this.isRowDead(alliedFrontlineRow);
        if (!isAlliedFrontlineDead && attackerRow !== alliedFrontlineRow) {
            return [];
        }

        let targetRow = opponentFrontlineRow;
        while (this.isRowDead(targetRow) && targetRow !== -1) {
            targetRow = this.getNextRow(targetRow, attacker.team === "red" ? "down" : "up");
        }

        if (targetRow === -1) {
            return [];
        }

        const adjacentEnemiesDead = this.areAdjacentEnemiesDead(attackerCol, targetRow);
        if (adjacentEnemiesDead) {
            return this.getAllLivingUnitsInRow(targetRow);
        }

        return this.getTargetCoordinatesInRange(attackerCol, targetRow);
    }


    public getAllEnemyHeroes(attacker: Unit): { row: number; col: number }[] {
        const targets: { row: number; col: number }[] = [];

        for (let row = 0; row < this.battlefieldGrid.length; row++) {
            for (let col = 0; col < this.battlefieldGrid[row].length; col++) {
                const target = this.battlefieldGrid[row][col];
                if (target && !target.isDead && target.team !== attacker.team) {
                    targets.push({row, col});
                }
            }
        }
        return targets.sort((a, b) => (b.row - a.row) || (b.col - a.col));
    }

    public getAllAlliedHeroes(actor: Unit): { row: number; col: number }[] {
        const targets: { row: number; col: number }[] = [];

        for (let row = 0; row < this.battlefieldGrid.length; row++) {
            for (let col = 0; col < this.battlefieldGrid[row].length; col++) {
                const target = this.battlefieldGrid[row][col];
                if (target && !target.isDead && target.team === actor.team && target != actor) {
                    targets.push({ row, col });
                }
            }
        }
        return targets.sort((a, b) => (b.row - a.row) || (b.col - a.col));
    }

    private areAdjacentEnemiesDead(attackerCol: number, targetRow: number): boolean {
        for (
            let col = Math.max(0, attackerCol - 1);
            col <= Math.min(this.battlefieldGrid[targetRow].length - 1, attackerCol + 1);
            col++
        ) {
            const target = this.battlefieldGrid[targetRow][col];
            if (target && !target.isDead) {
                return false;
            }
        }
        return true;
    }

    private getAllLivingUnitsInRow(rowIndex: number): { row: number; col: number }[] {
        const coordinates: { row: number; col: number }[] = [];
        for (let col = 0; col < this.battlefieldGrid[rowIndex].length; col++) {
            const target = this.battlefieldGrid[rowIndex][col];
            if (target && !target.isDead) {
                coordinates.push({ row: rowIndex, col });
            }
        }
        return coordinates;
    }

    private findUnitRow(unit: Unit): number {
        for (let row = 0; row < this.battlefieldGrid.length; row++) {
            if (this.battlefieldGrid[row].some(cell => cell === unit)) {
                return row;
            }
        }
        return -1;
    }

    private findUnitCol(unit: Unit): number {
        const row = this.findUnitRow(unit);
        if (row === -1) return -1;
        return this.battlefieldGrid[row].findIndex(cell => cell === unit);
    }

    private getOpponentFrontlineRow(team: string): number {
        return team === "red" ? 2 : 1;
    }

    private getAlliedFrontlineRow(team: string): number {
        return team === "red" ? 1 : 2;
    }

    private isRowDead(rowIndex: number): boolean {
        if (rowIndex < 0 || rowIndex >= this.battlefieldGrid.length) return true;
        return this.battlefieldGrid[rowIndex].every(unit => !unit || unit.isDead);
    }

    private getNextRow(rowIndex: number, direction: "up" | "down"): number {
        const nextRow = direction === "down" ? rowIndex + 1 : rowIndex - 1;
        return nextRow >= 0 && nextRow < this.battlefieldGrid.length ? nextRow : -1;
    }

    private getTargetCoordinatesInRange(attackerCol: number, targetRow: number): { row: number; col: number }[] {
        const coordinates: { row: number; col: number }[] = [];
        for (
            let col = Math.max(0, attackerCol - 1);
            col <= Math.min(this.battlefieldGrid[targetRow].length - 1, attackerCol + 1);
            col++
        ) {
            const target = this.battlefieldGrid[targetRow][col];
            if (target && !target.isDead) {
                coordinates.push({ row: targetRow, col });
            }
        }
        return coordinates.sort((a, b) => (b.row - a.row) || (b.col - a.col));
    }
}
