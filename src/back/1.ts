import fs from 'fs';

import { distanceLatLng } from '../mid/lib/geom';
import { isInMoscow } from '../mid/misc/helpers';

import objs from '../front/mock/sport_objects.json';

// const GRID_SIZE_LAT = 100;
const GRID_SIZE_LAT = 1000;
const GRID_SIZE_LNG = GRID_SIZE_LAT;
const STEP_LAT = -0.001; // ~ 1000 м
const STEP_LNG = -STEP_LAT * 2; // ~ 1000 м
const LAT0 = 56; // .123456
const LNG0 = 36; // .123456;

const dir = __dirname + '/../../src/front/mock_net/';
// const file = dir + 'net_near_10_step100m.json';
const file_cover = dir + 'net_cover_step100m.json';

const radii = [5000, 3000, 1000, 500];

// const LAT0 = 55.95; // левый верхний угол, но до Зеленограда
// const LNG0 = 37.34;

//const XLSX = require('xlsx');

let t0 = Date.now();
let arr = [];
let arr_cover = [];

async function main() {
    // await fs.promises.writeFile(file, '[');
    await fs.promises.writeFile(file_cover, '[');

    let lng, lat;
    let isFirst = true;

    for (let i = 0; i < GRID_SIZE_LAT; i++) {
        lat = LAT0 + STEP_LAT * i;

        console.log(i);

        for (let j = 0; j < GRID_SIZE_LNG; j++) {
            lng = LNG0 + STEP_LNG * j;

            if (!isInMoscow([lat, lng])) {
                continue;
            }

            let raw = [];
            let cur_cover = {
                lat,
                lng,
                qty: 0
            };

            let cur_near: any = {
                lat,
                lng,
            };

            (objs as any).forEach((obj) => {
                let d = distanceLatLng(
                    [lat, lng],
                    [obj.lat, obj.lng]
                );

                raw.push({
                    d: d,
                    lat,
                    lng,
                    id: obj.id,
                });

                let radius = obj.affinityId ? radii[obj.affinityId - 1] : null;

                if (radius && (d <= radius)) {
                    cur_cover.qty += 1;
                }
            });

            let newArr = raw.sort(function (a, b) {
                return a.d - b.d;
            });

            newArr.slice(0, 10).forEach((row, i) => {
                cur_near['id' + i] = row.id;
                cur_near['d' + i] = row.d;
            });

            arr.push(cur_near);
            arr_cover.push(cur_cover);

            // await fs.promises.writeFile(file, (!isFirst ? ',' : '') + '\n' +'\t' + JSON.stringify(cur_near), { flag: 'a' });
            await fs.promises.writeFile(file_cover, (!isFirst ? ',' : '') + '\n' + '\t' + JSON.stringify(cur_cover), { flag: 'a' });
            isFirst = false;
        }

        arr = [];
        arr_cover = [];
    }

    // await fs.promises.writeFile(file, ']', { flag: 'a' });
    await fs.promises.writeFile(file_cover, ']', { flag: 'a' });

    let t1 = Date.now();
    console.log(Math.round((t1 - t0) / 1000) + ' сек');

    process.exit();
}

main();