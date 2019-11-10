import {fileAsText} from "../common/files.js";

const ENABLE_LOG = false;
export const EXAMPLE =
`Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4`;

export default async function main() {

    let {immuneSystem, infection} = parseArmies(EXAMPLE);
    fightTillEnd(immuneSystem, infection).toBe(5216);

    return fileAsText('day24/input.txt').then(input => {
        let {immuneSystem, infection} = parseArmies(input);
        const res =  fightTillEnd(immuneSystem, infection);
        res.notToBe(19428); // too high
        res.notToBe(19293); // too low
        res.toBe(19295);
        return res;
    });
};

export function parseArmies(input) {
    const armiesStr = input.split(/\n\n/);
    const armies = armiesStr.map(armyStr => new Army(armyStr));
    return {immuneSystem : getImmuneSystem(armies), infection : getInfection(armies)}
}

export function fightTillEnd(lArmy, rArmy) {
    let loopId = 0;
    while(lArmy.totalUnits && rArmy.totalUnits ) {
        fight(lArmy, rArmy);

        const newLoopId = lArmy.totalUnits + "_" + rArmy.totalUnits; // prevents deadlocks
        if(loopId === newLoopId) {
            throw "Stalemate";
        }
        loopId = newLoopId
    }
    return lArmy.totalUnits || rArmy.totalUnits
}

function log(...msg) { if(ENABLE_LOG) { console.log(...msg) } }

function fight(lArmy, rArmy) {
    log('----');
    logFightStart(lArmy, rArmy);
    let allGroups = lArmy.groups.concat(rArmy.groups).sort((left, right) => {
        let res = right.effectivePower - left.effectivePower;
        return res === 0 ? (right.initiative - left.initiative) : res;
    });
    let targetable = [... allGroups];

    // target selection phase
    allGroups.forEach(group => {
       const selected = group.selectTarget(targetable);
       targetable = targetable.filter(other => other !== selected);
    });

    // attacking phase
    allGroups = allGroups.sort((left, right) => right.initiative - left.initiative);
    log(' ');
    allGroups.forEach(group => group.attackTarget());

    log('----')
}
function logFightStart(lArmy, rArmy) {
    const logArmy = (army) => {
        log(army.name+":");
        army.groups.forEach((grp) => log(`${grp.name} contains ${grp.unitCnt} units`))
    };
    logArmy(lArmy);
    logArmy(rArmy);
    log('')
}

function getImmuneSystem(armies) {
    return armies.find(army => army.isImmuneSystem)
}
function getInfection(armies) {
    return armies.find(army => army.isInfection)
}

class Army {
    constructor(input) {
        const parsed = /^(.*):\n(.*)/s.exec(input);
        this.name = parsed[1];
        const groupsStr = parsed[2];
        this._groups = groupsStr.split('\n').map(gStr => new Group(gStr));
        this._groups.forEach((grp, idx) => grp.name = `${this.name } group ${idx+1}`);
        this._groups.forEach((grp) => grp.armyName = this.name)
    }
    boost(amount) {
        this.groups.forEach(group => group.boost(amount))
    }
    get isImmuneSystem() {
        return this.name === "Immune System";
    }
    get isInfection() {
        return this.name === "Infection";
    }
    get groups() {
        return this._groups.filter(grp => grp.unitCnt !== 0);
    }
    get totalUnits() {
        return this.groups.reduce((acc, group) => acc + group.unitCnt, 0);
    }
}

class Group {
    constructor(input) {
        const parsed = /(.*) units each with (.*) hit points.*with an attack that does (.*) (.*) damage at initiative (.*)/.exec(input);
        this.unitCnt = parseInt(parsed[1]);
        this.hp = parseInt(parsed[2]);
        this.damage = parseInt(parsed[3]);
        this.damageType = parsed[4];
        this.initiative = parseInt(parsed[5]);
        this.immunities = /immune to (.*?)[\);]/.exec(input);
        this.immunities = this.immunities ? this.immunities[1].split(', ') : [];
        this.weaknesses = /weak to (.*?)[\);]/.exec(input);
        this.weaknesses = this.weaknesses ? this.weaknesses[1].split(', ') : [];

        this.name = '';
        this.armyName = '';
        this.target = undefined;
    }
    boost(amount) {
        this.damage += amount;
    }
    get effectivePower() {
        return this.unitCnt * this.damage;
    }
    possibleDamage(other) {
        let res = this.effectivePower;
        if(other.immunities.includes(this.damageType)) {
            res = 0;
        } else if(other.weaknesses.includes(this.damageType)) {
            res = res * 2;
        }
        return res;
    }
    selectTarget(others) {
        this.target = undefined; // initialize previous target
        const possibletargets = others
            .filter(other => other.armyName !== this.armyName)
            .filter(other => this.possibleDamage(other) !== 0)
            .sort((left, right) => {
                let res =  this.possibleDamage(left) - this.possibleDamage(right);
                res = res === 0 ? left.effectivePower - right.effectivePower : res;
                res = res === 0 ? left.initiative - right.initiative : res;
                return res;
            });

        possibletargets.forEach(other => log(`${this.name} would deal ${other.name} ${this.possibleDamage(other)} damage`));
        while(possibletargets.length && !this.target) {
            const candidate = possibletargets.pop();
            this.target = candidate; // only select a target that is not immune to us
        }
        return this.target;
    }
    attackTarget() {
        if(this.target && this.possibleDamage(this.target) > 0 /*&& this.target.unitCnt > 0*/) {
            if(this.target.unitCnt === 0) {console.warn("no unitcnt but attacking",Object.assign({},this), Object.assign({},this.target))}
            const casualties = this.target.receiveDamage(this.possibleDamage(this.target));
            log(`${this.name} attacks ${this.target.name}, killing ${casualties} units`)
        }
    }
    receiveDamage(amount) {
        let lostUnits = Math.floor(amount / this.hp);
        lostUnits = Math.min(this.unitCnt, lostUnits); // cannot lose more units than exist
        this.unitCnt -= lostUnits;
        return lostUnits;
    }
}