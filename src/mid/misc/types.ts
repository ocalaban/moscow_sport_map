export interface IObj {
    id: string | number,
    name: string,
    address: string,
    innerId: string,
    org: string,
    affinityId: number,
    lat: number,
    lng: number,
    parts: IPart[],
    square: number
};

// export const keys_IObj = ["id","name","address","innerId","org","affinityId","lat","lng"];

export interface IPart {
    id: string | number,
    sportzoneId: string | number,
    sportzone: string,
    sportzonetypeId: number,
    square: number,
    affinityName: string,
    sportzonetypeName: string,
    roles: number[]
};

// export const keys_IPart = ["id", "sportzoneId", "sportzone", "sportzonetypeId", "square"];

export type ICoord = [number, number];

export interface IPolygon extends Array<ICoord> {

}

export interface IDistrictRaw {
    name: string,
    region: string,
    square: number,
    population: number,
    squareFond: number,
    coords: IPolygon[]
}

export interface IDistrict extends IDistrictRaw {
    density: number,
    countSpecific: number,
    sumSpecific: number,
    countRolesSpecific: number
}

export type IRGBA = [number, number, number, number];

export function getInterjacentColorStr(step: number, stepCount: number, rgb1: IRGBA, rgb2: IRGBA) {
    let lambda = (step - 1) / stepCount;

    let rgb = rgb1.map((v, i) => Math.floor(rgb1[i] + lambda * (rgb2[i] - rgb1[i])));
    let res = 'RGBA(' + rgb.join(', ') + ')';

    return res;
}