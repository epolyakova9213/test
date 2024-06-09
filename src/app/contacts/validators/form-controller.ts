import {Validator} from "@/app/contacts/validators/validator";
import {ChangeEvent, FocusEvent, useState} from "react";
import {IMessageForm} from "@/app/contacts/contracts";
import {IObjectType} from "@/app/contacts/validators/contracts";

type IState<T extends Record<string, any>> = {
    data: IObjectType<T>,
    error: string | undefined,
    isTouched: boolean,
}

/**
 * Class, that storing methods for input control and observe state changing
 */
export class FormController<T extends Record<string, any>> {
    /**
     * React useState returned function
     */
    setState: (value: (((prevState: IState<T>) => IState<T>) | IState<T>)) => void

    /**
     * React useState returned state
     */
    state: IState<T>

    /**
     * Does hook was called?
     */
    isReady = false

    constructor(private validator: Validator<T>) {
    }

    /**
     * Input value change listener
     */
    onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const field = event.currentTarget.dataset.name as keyof IMessageForm
        const value = event.currentTarget.value.trimStart()
        this.setState((prev) => {
            const newState = {...prev, data: {...prev.data, [field]: value}}
            this.validator.updateObject(newState.data)
            return newState as IState<T>
        })
    }

    /**
     * Here we are observing state changing
     */
    useHook = () => {
        // initialization value
        const [state, setState] = useState<IState<T>>({
            // user object
            data: this.validator.getObject(),
            // first error encountered
            error: undefined,
            // is form touched?
            isTouched: false,
        })
        this.setState = setState
        this.state = state
        if (!this.isReady) {
            // check the form at first invoke
            this.isReady = true
            this.checkFields()
        }
    }

    /**
     * Check all fields of state
     */
    private checkFields = () => {
        this.setState((prev) => {
            return {
                ...prev,
                error: this.validator.checkObject()
            }
        })
    }

    /**
     * Focus is gone listener. Check the object, change isTouching flag
     */
    onBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // React is bounds two setState results at next frame
        this.checkFields()
        this.setState(prev => {
            if (!prev.isTouched) return {
                ...prev,
                isTouched: true
            }
            return prev
        })
    }

    /**
     * Clear the state, reset the flags and errors
     */
    clearState = () => {
        this.setState((prev) => {
            const obj: any = {}
            const keys = Object.keys(prev.data)
            for (let key of keys) {
                obj[key] = ''
            }
            this.validator.updateObject(obj)
            return {data: obj, error: undefined, isTouched: false}
        })
        this.checkFields()
    }
}