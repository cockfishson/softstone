import {AOEAttackUnit} from "../unit_base_classes/AOE_attack_unit";

export class skeletonMageUnit extends AOEAttackUnit{
    public constructor(team:"red"|"green") {
        super("Skeleton mage",50,50,40,"./src/assets/Skeleton_Mage.jpg",team,20);
    }
}