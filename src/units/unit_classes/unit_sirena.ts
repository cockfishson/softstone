import {paralyzingUnit} from "../unit_base_classes/paralyzing_unit";

export class sirenaUnit extends paralyzingUnit {
    public constructor(team: "red" | "green") {
        super("Sirena", 80, 80, 20, "./assets/Sirena.jpg", team);
    }
}