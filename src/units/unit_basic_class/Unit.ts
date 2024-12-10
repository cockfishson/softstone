export abstract class Unit {
    public name: string;
    public maxHealth: number;
    public health: number;
    public initiative: number;
    public image: string;
    public isParalyzed: boolean = false;
    public isDead: boolean = false;
    public isDefending: boolean = false;
    public team: "red" | "green";
    protected constructor(name: string, maxHealth: number, health: number,initiative: number, image: string,team: "red" | "green") {
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = health;
        this.initiative = initiative;
        this.image = image;
        this.team = team;
    }
    public defend(): void {
        this.isDefending = true;
    }
    public getDamaged(damage: number): void {
        const damageTaken = this.isDefending ? damage/2 : damage;
        this.health -= damageTaken;
        if(this.health<=0) {
            this.health = 0;
            this.isDead = true;
        }
    }

    public getHealed(heal: number): void {
        this.health += heal;
        if(this.health>this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    public resetParalysis(): void {
        this.isParalyzed = false;
    }
    public resetDefence(): void {
        this.isDefending = false;
    }
}