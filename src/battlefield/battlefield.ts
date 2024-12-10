import { Unit } from "../units/unit_basic_class/Unit";
import { Action } from "../actions/action";
import { TurnSystem } from "../turn_system/turn_system";

export type BattlefieldGrid = Array<Array<Unit | null>>;

export class Battlefield {
    readonly grid: BattlefieldGrid;
    private turnOrder: Unit[] = [];
    private currentMove = 0;

    constructor(private rows: number = 4, private cols: number = 3) {
        this.grid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => null)
        );
    }

    public placeTeams(redTeam: Unit[][], greenTeam: Unit[][]): void {
        this.placeTeam(redTeam, 0);
        this.placeTeam(greenTeam, this.rows - greenTeam.length);
        this.initializeTurnOrder();
    }

    private initializeTurnOrder(): void {
        this.turnOrder = TurnSystem.createTurnOrder(this.grid);
    }

    private placeTeam(team: Unit[][], startRow: number): void {
        for (let i = 0; i < team.length; i++) {
            const row = startRow + i;
            if (row >= this.rows) break;

            for (let j = 0; j < this.cols; j++) {
                if (j < team[i].length) {
                    this.grid[row][j] = team[i][j];
                }
            }
        }
    }

    public invokeAction(targetRow: number, targetCol: number): boolean {
        const performer = this.getCurrentUnit();
        if (!performer) return false;

        const action = new Action(this.grid);
        const success = action.executeAction(performer, targetRow, targetCol);
        if (success) this.nextMove();
        return success;
    }

    public defendCurrentUnit(): void {
        const currentUnit = this.getCurrentUnit();
        if (currentUnit) {
            currentUnit.defend();
            this.nextMove();
        }
    }

    private nextMove(): void {
        this.currentMove = TurnSystem.nextMove(this.turnOrder, this.currentMove);
    }

    public getCurrentUnit(): Unit | null {
        const currentUnit = this.turnOrder[this.currentMove] || null;
        if (currentUnit) {
            currentUnit.resetDefence();
        }
        return currentUnit;
    }

    public getHighlightedCells(): { row: number; col: number }[] {
        const currentUnit = this.getCurrentUnit();
        if (!currentUnit) return [];
        const action = new Action(this.grid);
        return action.getTargetsForUnit(currentUnit);
    }

    public getGrid(): BattlefieldGrid {
        return this.grid;
    }

    public getTurnOrder(): Unit[] {
        return this.turnOrder;
    }

    public getCurrentMoveIndex(): number {
        return this.currentMove;
    }
}
