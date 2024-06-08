export type IPoint = [number, number]

export interface IDebounced<T extends Function = any> {
    (f: () => void, delay: number): (() => void);
}

