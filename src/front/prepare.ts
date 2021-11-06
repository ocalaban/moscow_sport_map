import { IObj, IPart } from '../mid/misc/types';

import objs_src from './mock/object';
import parts_src from './mock/part';
import roles_src from './mock/role';
import fs from 'fs';
import getDistrictsWithCalc from '../mid/misc/helpers';

let objs = objs_src.map(arr => {
    let res = {};

    res["id"] = arr[0];
    res["name"] = arr[1];
    res["address"] = arr[2];
    res["innerId"] = arr[3];
    res["org"] = arr[4];
    res["affinityId"] = arr[5];
    res["lat"] = +arr[6];
    res["lng"] = +arr[7];

    roles_src.filter(rarr => arr[0] === rarr[0]);

    let squareSum = 0;
    (res as any).parts = parts_src.filter(parr => arr[0] === parr[0]).map(parr => {
        let res = {};

        res["id"] = parr[0];
        res["sportzoneId"] = parr[1];
        res["sportzone"] = parr[2];
        res["sportzonetypeId"] = parr[3];
        res["square"] = +parr[4];

        (res as any).roles = [];
        let roles = roles_src.filter(rarr => {
            let res = parr[1] === rarr[0];
            return res;
        });

        roles.forEach(rarr => {
            (res as any).roles.push(rarr[1]);
        });

        squareSum += +(res as any).square;

        return res as IPart;
    }) as IPart[];

    (res as any).square = squareSum;

    return res as IObj;
});

fs.writeFileSync(__dirname + '/mock/sport_objects.json', JSON.stringify(objs));

let districts = getDistrictsWithCalc(objs);

fs.writeFileSync(__dirname + '/mock/districts.json', JSON.stringify(districts));