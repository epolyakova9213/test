'use client'

import styles from "./contact-form.module.scss";
import {Input} from "@/infra/controls/input/input";
import {Button} from "@/infra/controls/button/button";
import React, {useState} from "react";
import {Validator} from "@/app/contacts/validators/validator";
import {emailRegexp} from "@/constants";
import {IMessageForm} from "@/app/contacts/contracts";
import {FormController} from "@/app/contacts/validators/form-controller";
import {Tip} from "@/infra/alert/tip";
import {IObjectValidators} from "@/app/contacts/validators/contracts";

export const ContactForm: React.FC = () => {

    /**
     * simple value observing for form submit success message
     */
    const [submitMsg, setSubmitMsg] = useState('')
    const [controller] = useState(() => {
        const validator = new Validator<IMessageForm>({
            email: '',
            name: '',
            subject: '',
            message: '',
        })
        const validators: IObjectValidators<IMessageForm> = {
            email: {
                validators: [
                    validator.required(),
                    validator.checkMaxStringLength(40),
                    validator.checkTemplate(emailRegexp),
                ]
            },
            name: {
                validators: [
                    validator.required(),
                    validator.checkMaxStringLength(20),
                ]
            },
            subject: {
                validators: [
                    validator.required(),
                    validator.checkMaxStringLength(150)
                ]
            },
            message: {
                validators: [
                    validator.required(),
                    validator.checkMaxStringLength(1500)
                ]
            }

        }
        validator.updateValidators(validators)

        return new FormController<IMessageForm>(validator)
    })

    /**
     * observe form values changing
     */
    controller.useHook()


    return (
        <div className={styles.form}>
            <Input onChange={controller.onChange}
                   containerClass={styles.name}
                   onBlur={controller.onBlur}
                   data-name={'name'}
                   value={controller.state.data.name}
                   name={'Name'}
            />
            <Input onChange={controller.onChange}
                   containerClass={styles.email}
                   onBlur={controller.onBlur}
                   data-name={'email'}
                   value={controller.state.data.email}
                   name={'Email'}
            />
            <Input onChange={controller.onChange}
                   containerClass={styles.subject}
                   onBlur={controller.onBlur}
                   data-name={'subject'}
                   value={controller.state.data.subject}
                   name={'Subject'}
            />
            <Input onChange={controller.onChange}
                   containerClass={styles.message}
                   asTextArea
                   onBlur={controller.onBlur}
                   data-name={'message'}
                   value={controller.state.data.message}
                   name={'Message'}
            />
            {
                <Button text={controller.state.isTouched && controller.state.error || 'Send message'}
                        disabled={!!controller.state.error}
                        containerClassName={styles.submit}
                        onClick={() => {
                            if (controller.state.error) return
                            controller.clearState()
                            setSubmitMsg('Success!')
                        }}
                />
            }

            {
                submitMsg &&
                <Tip onAnimationEnd={() => {
                    // Delete text when it goes off screen
                    setSubmitMsg(null)
                }}>
                    {
                        submitMsg
                    }
                </Tip>
            }

        </div>
    )
}