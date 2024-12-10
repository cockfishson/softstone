import {Unit} from "../unit_basic_class/Unit.ts";

export interface IAttack {
    attack(target:Unit):void;
}