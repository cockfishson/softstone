import {Unit} from "../unit_basic_class/Unit";
import {IParalyze} from "../unit_interfaces/IParalyze";

export class paralyzingUnit extends Unit implements IParalyze {
    public constructor(name: string, maxHealth: number, health: number, initiative: number, image: string, team: "red" | "green") {
        super(name, maxHealth, health, initiative, image, team);
    }
    public paralyze(target: Unit) {
        if(!target.isDead){
            target.isParalyzed=true;
        }
    }
}