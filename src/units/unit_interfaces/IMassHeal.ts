import {Unit} from "../unit_basic_class/Unit.ts";

export interface IMassHeal {
    massHeal(target:Unit[]):void;
}