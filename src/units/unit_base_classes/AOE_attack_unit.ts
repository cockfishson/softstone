import {Unit} from "../unit_basic_class/Unit";
import {IMassAttack} from "../unit_interfaces/IMassAttack";

export class AOEAttackUnit extends Unit implements IMassAttack {
    damage: number;
    public constructor(name: string, maxHealth: number, health: number, initiative: number, image: string, team: "red" | "green", damage: number) {
        super(name, maxHealth, health, initiative, image, team);
        this.damage = damage;
    }
    public massAttack(target: Unit[]) {
        target.forEach((t:Unit) => {
            if(!t.isDead){
                t.getDamaged(this.damage);
            }
        })
    }
}