export type IObjectType<T> = {
    [property in keyof T]: string
}
export type IObjectValidators<T> = {
    [Property in keyof T]: {
        validators: Array<(value: keyof T, message?: string, args?: any) => string | undefined>
    }
}

export interface IValidator<T> {
}

export class Validator<T> implements IValidator<T> {
    constructor(private obj: IObjectType<T>, private validators?: IObjectValidators<T>) {
        this.obj = obj
        this.validators = validators
    }

    updateObject = (obj: IObjectType<T>) => {
        this.obj = obj
    }

    updateValidators = (validators: IObjectValidators<T>) => {
        this.validators = validators
    }

    getObject = () => {
        return this.obj
    }

    required = (message?: string) => {
        return (key: keyof T) => {
            if (this.obj[key]) return undefined
            return message || `${String(key)} is required field`
        }
    }

    compareWith = (key2: keyof T, message?: string) => {
        return (key: keyof T) => {
            if (this.obj[key] === this.obj[key2]) return undefined
            return message || `${String(key)} an ${String(key2)} are not equal`
        }
    }

    checkMaxStringLength = (length: number, message?: string) => {
        return (key: keyof T) => {
            if (this.obj[key].length <= length) return undefined
            return message || `Field ${String(key)} is exceed maximum length`
        }
    }

    checkMinStringLength = (length: number, message?: string) => {
        return (key: keyof T) => {
            if (this.obj[key].length >= length) return undefined
            return message || `Field ${String(key)} is exceed maximum length`
        }
    }

    checkTemplate = (template: RegExp, message?: string) => {
        return (key: keyof T) => {
            if (!template.test(this.obj[key])) {
                return message || `Field ${String(key)} is mismatching template`
            }
        }
    }

    checkField = (key: keyof T, message?: string, args?: any) => {
        if (this.validators) {
            for (let i = 0; i < this.validators[key].validators.length; i++) {
                const res = this.validators[key].validators[i](key, message, args)
                if (res) return res
            }
        }
        return undefined
    }

    checkObject = (): string | undefined => {
        let resError
        const keys = Object.keys(this.obj) as Array<keyof T>
        for (let key of keys) {
            resError = this.checkField(key)
            if (resError) return resError
        }
        return resError
    }
}