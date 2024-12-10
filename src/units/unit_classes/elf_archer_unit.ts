import {rangeUnit} from "../unit_base_classes/ranged_unit";

export class elfArcherUnit extends rangeUnit{
    public constructor(team:"red"| "green") {
        super("Elf Archer",90,90,60,"./src/assets/Elf_Archer.jpg",team,45);
    }
}