export type IObjectType<T> = {
    [property in keyof T]: string
}

export type IObjectValidators<T> = {
    [Property in keyof T]: {
        validators: Array<(value: keyof T, message?: string, args?: any) => string | undefined>
    }
}