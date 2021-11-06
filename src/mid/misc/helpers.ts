import districts_src from '../../../src/front/mock/districts.json';
import sport_objects_district from '../../front/mock/sport_objects_district.json';
import { inGon } from '../lib/geom';
import { array_unique, round } from '../lib/func';
import { IObj } from './types';

export function getDistrictIndex(coord: [number, number]) {
    let i;
    let isFound = false;

    loop:
    for (i = 0; i < districts_src.length; i++) {
        let elm = districts_src[i];

        if (elm.coords) {
            // идем по полигонам внутри района
            for (let j = 0; j < elm.coords.length; j++) {
                isFound = inGon(coord as [number, number], (elm.coords[j] as any), true);
                if (isFound) {
                    break loop;
                }
            }
        }
    }

    if (isFound) {
        return i;
    } else {
        return;
    }
}

export function isInMoscow(coord: [number, number]) {
    let index = getDistrictIndex(coord);
    let res = (index !== undefined);
    return res;
}

export default function getDistrictsWithCalc(objs: IObj[]) {
    let districts = districts_src.map((arr, i) => {
        let res: any = {
            ...arr
        };

        res.density = round(res.population / res.square, 1);
        return res;
    });

    districts.forEach((arr, i) => {
        let stats = getSportStats(objs, districts, sport_objects_district, i);
        let res = Object.assign(arr, stats, { density: (arr.population / arr.square) });
        return res;
    });

    return districts;
}

export function getSportStats(objsBig: IObj[], districts, sport_objects_district, i) {
    let objs = objsBig.filter(obj => sport_objects_district[obj.id] === i);

    let count = objs.reduce((prev, cur) => prev + cur.parts.length, 0);
    let sum = objs.reduce(
        (prev, cur) => {
            let res = prev + cur.parts.reduce(
                (prev1, cur1) => {
                    let res1 = prev1 + cur1.square;
                    return res1;
                }, 0);

            return res;
        }, 0);

    let rolesRaw = objs.reduce(
        (prev, cur) => {
            let resCur = cur.parts.reduce(
                (prev1, cur1) => {
                    let res1 = prev1.concat(cur1.roles);
                    return res1;
                },
                []);

            let res = prev.concat(resCur);
            return res;
        },
        []);

    let countRoles = array_unique(rolesRaw).length;

    let district = districts[i];
    let divider = district.population / 100000;

    let res = {
        countSpecific: round(count / divider, 1),
        sumSpecific: round(sum / divider, 1),
        countRolesSpecific: round(countRoles / divider, 1)
    };

    return res;
}