export type tMessage = {
    name: string,
    email: string,
    subject: string,
    message: string,
}

export type tLoginParams = {
    email: string,
    password: string,
}

export type tErrors = {
    [key: string]: string
} | undefined

export type tPos = {
    x: number,
    y: number
}

export type tValidator = (value: string, text?: string) => string | undefined
export const required: tValidator = (value: string, text?: string) => {
    if (value) {
        return undefined
    }
    return text || 'Field is required'
}