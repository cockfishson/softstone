import {healerUnit} from "../unit_base_classes/healer_unit";

export class monkUnit extends healerUnit{
    public constructor( team: "red" | "green") {
        super("Monk", 90, 90, 20, "./src/assets/Monk.jpg", team, 40);
    }
}