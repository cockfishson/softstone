import {Unit} from "../unit_basic_class/Unit";
import {IMassHeal} from "../unit_interfaces/IMassHeal";

export class massHealerUnit extends Unit implements IMassHeal {
    public healCount:number;
    public constructor(name: string, maxHealth: number, health: number,initiative: number, image: string,team: "red" | "green",healCount:number) {
        super(name, maxHealth, health, initiative, image, team);
        this.healCount = healCount;
    }
    public massHeal(target:Unit[]):void {
        target.forEach((t:Unit) => {
            if(!t.isDead){ t.getHealed(this.healCount); }
        });
    }
}