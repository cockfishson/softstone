import {Unit} from "../unit_basic_class/Unit";
import {IAttack} from "../unit_interfaces/IAttack";

export class rangeUnit extends Unit implements IAttack{
    damage: number;
    public constructor(name: string, maxHealth: number, health: number,initiative: number, image: string,team: "red" | "green",damage: number)
    {
        super(name, maxHealth, health, initiative, image, team);
        this.damage = damage;
    }
    public attack(target: Unit) {
        if(!target.isDead){
            target.getDamaged(this.damage);
        }
    }
}