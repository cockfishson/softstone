import {meleeUnit} from "../unit_base_classes/melee_unit";

export class skeletonUnit extends meleeUnit{
    public constructor(team:"red"|"green") {
        super("Skeleton",100,100,50,"./assets/Skeleton.jpg",team,25);
    }
}