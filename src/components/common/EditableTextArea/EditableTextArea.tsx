import React, { useState } from 'react'
import { ReactComponent as EditIcon } from '../../../assets/icons/ic-pencil.svg'
import { EditableTextAreaProps } from './types'
import { ButtonWithLoader } from '../formFields/ButtonWithLoader'

const TextArea = (
    props: EditableTextAreaProps & {
        setIsEditable: (boolean) => void
    },
) => {
    const { rows, placeholder, initialText, setIsEditable, updateContent } = props
    const [text, setText] = useState<EditableTextAreaProps['initialText']>(initialText)
    const [isLoading, setIsLoading] = useState(false)

    const handleCancelEdit = () => {
        setText(initialText)
        setIsEditable(false)
    }

    const handleSaveContent = () => {
        setIsLoading(true)
        updateContent(text)
            .then(() => {
                setIsEditable(false)
                setIsLoading(false)
            })
            .catch(() => {
                // keep editable true
                setIsLoading(false)
            })
    }

    return (
        <div className="flexbox-col flex-grow-1 dc__gap-12">
            <textarea
                rows={rows}
                placeholder={placeholder}
                value={text}
                className="form__textarea bcn-0 fs-13 lh-20 cn-9 dc__resizable-textarea--vertical"
                onChange={(e) => {
                    setText(e.target.value)
                }}
            />
            <div className="flex dc__gap-12 ml-auto">
                <button className="cta cancel lh-20-imp h-28" disabled={isLoading} onClick={handleCancelEdit}>
                    Cancel
                </button>
                <ButtonWithLoader
                    rootClassName="cta lh-20-imp h-28"
                    onClick={handleSaveContent}
                    disabled={false}
                    isLoading={isLoading}
                    loaderColor="white"
                >
                    Save
                </ButtonWithLoader>
            </div>
        </div>
    )
}

export const EditableTextArea = (props: EditableTextAreaProps) => {
    const { initialText = '' } = props
    const [isEditable, setIsEditable] = useState<boolean>(false)

    return (
        <>
            {isEditable ? (
                <TextArea {...props} initialText={initialText} setIsEditable={setIsEditable} />
            ) : (
                <div className="flexbox flex-justify dc__gap-10">
                    <div className="fs-13 fw-4 lh-20 cn-9">{initialText}</div>
                    <EditIcon className="icon-dim-16 cursor mw-16" onClick={() => setIsEditable(!isEditable)} />
                </div>
            )}
        </>
    )
}
