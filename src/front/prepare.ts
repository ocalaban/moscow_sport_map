import { IObj, IPart, keys_IObj, keys_IPart } from './types';

import objs_src from './mock/object';
import parts_src from './mock/part';
import roles_src from './mock/role';
import fs from 'fs';

let objs = objs_src.map(arr => {
    let res = {};
    arr.forEach((v, i) => {
        let key = keys_IObj[i];
        res[key] = v;
    });

    roles_src.filter(rarr => arr[0] === rarr[0]);

    let squareSum = 0;
    (res as any).parts = parts_src.filter(parr => arr[0] === parr[0]).map(parr => {
        let res = {};
        parr.forEach((v, i) => {
            let key = keys_IPart[i];
            res[key] = v;
        });

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
