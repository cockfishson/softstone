import {Unit} from "../unit_basic_class/Unit.ts";

export interface IMassAttack{
    massAttack(target:Unit[]):void;
}