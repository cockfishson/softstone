import {rangeUnit} from "../unit_base_classes/ranged_unit";

export class banditUnit extends rangeUnit{
    public constructor(team:"red"| "green") {
        super("Bandit",75,75,60,"./src/assets/Bandit.jpg",team,30);
    }
}