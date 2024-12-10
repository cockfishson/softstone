import {Unit} from "../unit_basic_class/Unit";
import {IHeal} from "../unit_interfaces/IHeal";

export class healerUnit extends Unit implements IHeal {
    healCount: number;
    public constructor(name: string, maxHealth: number, health: number, initiative: number, image: string, team: "red" | "green",healCount: number) {
        super(name, maxHealth, health, initiative, image, team);
        this.healCount = healCount;
    }
    heal(target: Unit) {
        if(!target.isDead){
            target.getHealed(this.healCount);
        }
    }
}