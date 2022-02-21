const GEOM_EPS = 1E-15;
const const_gradToMetrCoef = 111111;
const const_etalLat = 55.03011111017; // эталонная широта
const const_etalCosCoef = Math.cos(const_etalLat / 180 * Math.PI);

/**
* принадлежность точки многоугольнику в 2Gis системе координат
* 
* @param point точка, т.е. массив из 2-х координат [x,y]
* @param vs многоугольник, т.е. массив точек
* 
* @returns {Boolean}
*/
export function inGon(point: [number, number], vs: [number, number][], isInner: boolean = false): boolean {
    let np: [number, number] = [point[1], -point[0]]; // parseFloat( // @@##
    let nvs: [number, number][] = [];

    for (let i = 0; i < vs.length; i++) {
        nvs[i] = [vs[i][1], -vs[i][0]]; // почему-то приходится здесь делать parseFloat, без этого в строку переводит // @@##
    }

    let res = inGonDefault(np, nvs, isInner);
    return res;
}

/**
* принадлежность точки многоугольнику в декартовой евклидовой системе 
* 
* @param point точка, т.е. массив из 2-х координат [x,y]
* @param vs многоугольник, т.е. массив точек
* 
* @returns {Boolean}
*/
export function inGonDefault(point: [number, number], vs: [number, number][], isInner: boolean = false): boolean {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    //?? - попытка сделать универсальный алго, для иннеров и без них, неудачная. Пример - квадрат, точка на левой стороне, по центру

    // луч испускается вдоль оси икс вправо
    let x = point[0];
    let y = point[1];

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i][0];
        let yi = vs[i][1];
        let xj = vs[j][0];
        let yj = vs[j][1];

        if ((xi == xj) && (yi == yj)) {
            // считаем, что попали на дюбель
            continue;
        }

        let isVertex = (Math.abs(xi - x) + Math.abs(yi - y)) < GEOM_EPS;
        if (isVertex) {
            inside = !isInner; // считаем, что близкие к вершине точки заведомо попадают на границу
            break;
        }

        let isOnSide = Math.abs((xj - xi) * (y - yi) - (yj - yi) * (x - xi)) < GEOM_EPS;
        if (isOnSide) {
            inside = !isInner; // считаем, что близкие к краю точки заведомо попадают на границу
            break;
        }

        let cond1 = ((yi > y) != (yj > y)); // прямая пересекает отрезок
        let cond2;

        if (cond1) {
            let agr = (xj - xi) * (y - yi) / (yj - yi);
            // условие, что пересекается именно луч. Нетривиальное геом. условие, не стал доказывать досконально.				
            //?? cond2 = (isInner ?  (x - xi < agr) : (x - xi <= agr));
            cond2 = (x - xi) < agr;
        }
        else {
            cond2 = false;
        }

        let intersect = (cond1 && cond2);
        //?? if (!isInner) { intersect = intersect || ((yi == y) && (yj == y)); }; // случай, что точка лежит на ребре, которое параллельно оси икс
        if (intersect) {
            inside = !inside;
        }
    }

    return inside;
}

export function distance(p1: [number, number], p2: [number, number]) {
    let res = Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2));
    return res;
}

export function distanceLatLng(p1: [number, number], p2: [number, number]) {
    let np1 = [p1[1], p1[0]] as [number, number];
    let np2 = [p2[1], p2[0]] as [number, number];
    let res = distanceLngLat(np1, np2);

    return res;
}

export function distanceLngLat(p1: [number, number], p2: [number, number]) {
    var res = Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow((p2[0] - p1[0]) * const_etalCosCoef, 2)) * const_gradToMetrCoef;
    return res;
}

