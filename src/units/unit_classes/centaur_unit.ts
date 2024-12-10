import {meleeUnit} from "../unit_base_classes/melee_unit";

export class centaurUnit extends meleeUnit{
    public constructor(team:"red"|"green") {
        super("Centaur",150,150,50,"./src/assets/centaur.jpg",team,50);
    }
}