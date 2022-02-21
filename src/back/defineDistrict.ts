import objs from '../front/mock/sport_objects.json';
import fs from 'fs';
import { getDistrictIndex } from '../mid/misc/helpers';

let res: any = {};

(objs as any).forEach(arr => {
    let coord = [arr.lat, arr.lng];

    let i = getDistrictIndex(coord as [number, number]);
    res[arr.id] = i;
});

fs.writeFileSync(__dirname + '/../front/mock/sport_objects_district.json', JSON.stringify(res));