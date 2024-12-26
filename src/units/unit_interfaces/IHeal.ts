import {Unit} from "../unit_basic_class/Unit.ts";

export interface IHeal {
    heal(target:Unit):void;
}