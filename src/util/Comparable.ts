
export default interface Comparable<T> {

    compareTo(other: T): number;
}

export function compare<T extends Comparable<T>>(a: T, b: T): number {
    return a.compareTo(b);
}

export function compareNumber(a: number, b: number): number {
    return (a === b ? 0 : (a < b ? -1 : 1));
}

export function compareDate(a: Date, b: Date): number {
    return compareNumber(a.getTime(), b.getTime());
}

export function compareJsonDate(a: string, b: string): number {
    return compareDate(new Date(a), new Date(b));
}
