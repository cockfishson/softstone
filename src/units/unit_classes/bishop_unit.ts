import {massHealerUnit} from "../unit_base_classes/mass_healer_unit";

export class bishopUnit extends massHealerUnit{
    public constructor(team: "red" | "green") {
        super("Bishop",130,130,20,"./src/assets/Bishop.jpg",team,25);
    }
}