export function array_unique(arr: any[]) {
	return [...new Set(arr)];
}

export function round(val: number, prec: number) {
    let div = 10**prec;
    let res = Math.round(val * div) / div;

    return res;
}

