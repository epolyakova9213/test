import {IObjectType, Validator} from "@/app/contacts/validators/Validator";
import {ChangeEvent, FocusEvent, useState} from "react";
import {IMessageForm} from "@/app/contacts/contracts";

type IState<T extends Record<string, any>> = {
    data: IObjectType<T>,
    error: string | undefined
}

export class FormController<T extends Record<string, any>> {
    setState: (value: (((prevState: IState<T>) => IState<T>) | IState<T>)) => void
    state: IState<T>

    isReady = false
    isTouched = false

    constructor(private validator: Validator<T>) {
    }

    onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = event.currentTarget.dataset.name as keyof IMessageForm
        const value = event.currentTarget.value.trimStart()
        this.setState((prev) => {
            const newState = {...prev, data: {...prev.data, [field]: value}}
            this.validator.updateObject(newState.data)
            return newState as IState<T>
        })
    }

    useHook = () => {
        const [state, setState] = useState<IState<T>>({
            data: this.validator.getObject(),
            error: undefined
        })
        this.setState = setState
        this.state = state
        if (!this.isReady) {
            this.isReady = true
            this.checkFields()
        }
    }

    private checkFields = () => {
        this.setState((prev) => {
            return {
                ...prev,
                error: this.validator.checkObject()
            }
        })
        return this.validator.checkObject()
    }

    onBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.checkFields()
        this.isTouched = true
    }

    clearState = () => {
        this.setState((prev) => {
            const obj: any = {}
            const keys = Object.keys(prev.data)
            for (let key of keys) {
                obj[key] = ''
            }
            this.validator.updateObject(obj)
            return {data: obj, error: undefined}
        })
    }
}