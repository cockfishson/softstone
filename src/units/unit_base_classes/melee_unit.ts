import { Unit } from "../unit_basic_class/Unit";
import { IAttack } from "../unit_interfaces/IAttack";

export class meleeUnit extends Unit implements IAttack {
    public damage: number;

    public constructor(
        name: string,
        maxHealth: number,
        health: number,
        initiative: number,
        image: string,
        team: "red" | "green",
        damage: number
    ) {
        super(name, maxHealth, health, initiative, image, team);
        this.damage = damage;
    }

    public attack(target: Unit): void {
        if (!target.isDead) {
            target.getDamaged(this.damage);
        }
    }
}
