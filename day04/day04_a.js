import {fileAsText} from '../common/files.js'

export default async function main() {
    let guard = new Guard(99);
    guard.addMinsOfNap(0,10);
    guard.getTotalNapMins().toBe(10); // including the start and end minute

    parseLogEntry("[1518-11-05 00:55] wakes up").month.toBe(11);
    parseLogEntry("[1518-11-05 00:55] wakes up").day.toBe(5);
    parseLogEntry("[1518-11-05 00:55] wakes up").hour.toBe(0);
    parseLogEntry("[1518-11-05 00:55] wakes up").minute.toBe(55);
    parseLogEntry("[1518-11-05 00:55] wakes up").text.toBe('wakes up');
    parseLogEntry("[1518-11-05 00:55] wakes up").isWakesUp().toBe(true);
    parseLogEntry("[1518-11-05 00:55] wakes up").isBeginShift().toBe(false);
    parseLogEntry("[1518-11-05 00:55] wakes up").isFallAsleep().toBe(false);
    parseLogEntry("[1518-11-05 00:55] falls asleep").isFallAsleep().toBe(true);
    parseLogEntry("[1518-11-05 00:55] falls asleep").isBeginShift().toBe(false);
    parseLogEntry("[1518-11-05 00:55] falls asleep").isWakesUp().toBe(false);
    parseLogEntry("[1518-11-05 00:55] Guard #10 begins shift").isBeginShift().toBe(true);
    parseLogEntry("[1518-11-05 00:55] Guard #10 begins shift").isWakesUp().toBe(false);
    parseLogEntry("[1518-11-05 00:55] Guard #10 begins shift").isFallAsleep().toBe(false);
    parseLogEntry("[1518-11-05 00:55] Guard #10 begins shift").guardId.toBe(10);

    let logEntries10 = parseLogEntries("[1518-11-01 00:00] Guard #10 begins shift\n[1518-11-01 00:05] falls asleep\n[1518-11-01 00:25] wakes up");
    logEntries10.length.toBe(3);
    logEntries10[0].isBeginShift().toBe(true);
    logEntries10[1].isFallAsleep().toBe(true);
    logEntries10[2].isWakesUp().toBe(true);

    let parseGuards10 = parseGuards(logEntries10);
    parseGuards10.length.toBe(1);
    parseGuards10[0].getId().toBe(10);
    parseGuards10[0].getTotalNapMins().toBe(20);

    let logEntriesExample = parseLogEntries("[1518-11-01 00:00] Guard #10 begins shift\n[1518-11-01 00:05] falls asleep\n[1518-11-01 00:25] wakes up\n[1518-11-01 00:30] falls asleep\n[1518-11-01 00:55] wakes up\n[1518-11-01 23:58] Guard #99 begins shift\n[1518-11-02 00:40] falls asleep\n[1518-11-02 00:50] wakes up\n[1518-11-03 00:05] Guard #10 begins shift\n[1518-11-03 00:24] falls asleep\n[1518-11-03 00:29] wakes up\n[1518-11-04 00:02] Guard #99 begins shift\n[1518-11-04 00:36] falls asleep\n[1518-11-04 00:46] wakes up\n[1518-11-05 00:03] Guard #99 begins shift\n[1518-11-05 00:45] falls asleep\n[1518-11-05 00:55] wakes up");
    let parseGuardsExample = parseGuards(logEntriesExample);
    parseGuardsExample.length.toBe(2);
    parseGuardsExample[0].getId().toBe(10);
    parseGuardsExample[0].getTopNapMinute().toBe(24);
    parseGuardsExample[0].getTotalNapMins().toBe(20 + 5 + 25);
    parseGuardsExample[1].getId().toBe(99);
    parseGuardsExample[1].getTopNapMinute().toBe(45);
    parseGuardsExample[1].getTotalNapMins().toBe(10 + 10 + 10);

    solve(parseGuardsExample).toBe(10 * 24);

    return fileAsText('day04/input.txt').then(input => {
        const inputGuards = parseGuards(parseLogEntries(input));
        return solve(inputGuards).toBe(104764);
    });
};

function solve(guards) {
    const employeeOfTheMonth = guards.reduce((prev, curr) => prev.getTotalNapMins() > curr.getTotalNapMins() ? prev : curr);
    return employeeOfTheMonth.getId() * employeeOfTheMonth.getTopNapMinute();
}

export function parseGuards(logEntries) {
    let guardMap = new Map();
    let guardId = 0;
    let sleepStart = 0;
    for(let entry of logEntries) {
        if(entry.isBeginShift()) {
            guardId = entry.guardId;
        } else if(entry.isFallAsleep()) {
            sleepStart = entry.minute;
        } else if(entry.isWakesUp()) {
            let guard = guardMap.get(guardId);
            if(!guard) {
                guard = new Guard(guardId);
            }
            guard.addMinsOfNap(sleepStart, entry.minute);
            guardMap.set(guardId, guard);
        }
    }
    return [...guardMap.values()]
}

export function parseLogEntries(input) {
    return input.split(/\r?\n|\n/g).sort().map(entry => parseLogEntry(entry));
}

function parseLogEntry(txt) {
    return {
        month: parseInt(txt.substr(6, 2)),
        day: parseInt(txt.substr(9, 2)),
        hour: parseInt(txt.substr(12, 2)),
        minute: parseInt(txt.substr(15, 2)),
        text: txt.substr(19),
        guardId: parseGuardId(txt),
        isBeginShift: function() {
            return this.text.includes('begins shift');
        },
        isFallAsleep: function() {
            return this.text.includes('falls asleep');
        },
        isWakesUp: function() {
            return this.text.includes('wakes up');
        }
    }
}

function parseGuardId(txt) {
    let res = txt.match(/#[0-9]*/g);
    if(res) {
        res = parseInt(res[0].substr(1));
    }
    return res;
}

export class Guard {
    constructor(id){
        this.id = id;
        this.napMins = new Map();
    }
    addMinsOfNap(napStart, napEnd) {
        for(let i = napStart; i < napEnd; i++) {
            this.napMins.inc(i);
        }
    }
    getTotalNapMins() {
        return [...this.napMins.values()].reduce((prev, curr) => prev + curr, 0);
    }
    getTopNap() {// entry[0] minute, entry[1] how often slept in this minute
        return [...this.napMins.entries()].reduce((highest, entry) => {
            return entry[1] > highest[1] ? entry : highest;
        });
    }
    getTopNapMinute() {
        return this.getTopNap()[0];
    }
    getTopNapFrequency() {
        return this.getTopNap()[1];
    }
    getId() {
        return this.id;
    }
}