import {AOEAttackUnit} from "../unit_base_classes/AOE_attack_unit";

export class archimageUnit extends AOEAttackUnit{
    public constructor(team:"red"|"green") {
        super("Archimage",90,90,40,"./assets/Archimage.jpg",team,30);
    }
}