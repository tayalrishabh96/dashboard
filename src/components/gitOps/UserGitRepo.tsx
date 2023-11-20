import {
    CustomInput,
    InfoColourBar,
    RadioGroup,
    RadioGroupItem,
    ResizableTextarea,
} from '@devtron-labs/devtron-fe-common-lib'
import React, { useState } from 'react'
import { AppCreationType, repoType } from '../../config/constants'
import { ReactComponent as Warn } from '../../assets/icons/ic-warning.svg'

function UserGitRepo({ setRepoURL: string }) {
    const [selectedRepoType, setSelectedRepoType] = useState(repoType.DEFAULT)
    const [repoText, setRepoText] = useState('')

    const repoTypeChange = () => {
        if (selectedRepoType === repoType.DEFAULT) {
            setSelectedRepoType(repoType.CONFIGURE)
        } else {
            setSelectedRepoType(repoType.DEFAULT)
        }
    }

    const onChange = (event) => { 
        setRepoText(event.target.value)   
    }
        
    const inputUrlBox = () => {
        return (
            <div className="mr-10 ml-26">
                <div className="gitops__id fw-5 fs-13 mb-8 dc__required-field">Git Repo URL</div>
                <input
                    type="text"
                    autoComplete="off"
                    name="name"
                    value={repoText}
                    placeholder="Enter repository URL"
                    className="form__input"
                    onChange={(event) => onChange(event)}
                />
            </div>
        )
    }

    const renderInfoColorBar = () => {
        return (
            <InfoColourBar
                message="GitOps repository cannot be changed for this application once saved."
                classname="warn"
                Icon={Warn}
                iconClass="warning-icon"
            />
        )
    }

    return (
        <>
            <div>
                <div className="form__row flex left">
                    <div className="fw-6 cn-9 fs-14 mb-16">GitOps Configuration</div>
                    <RadioGroup
                        className="radio-group-no-border"
                        name="trigger-type"
                        value={selectedRepoType}
                        onChange={repoTypeChange}
                    >
                        <div className="">
                            <RadioGroupItem value={repoType.DEFAULT}>Auto-create repository</RadioGroupItem>
                            <div className="ml-26">Repository will be created automatically</div>
                        </div>
                        <div>
                            <RadioGroupItem value={repoType.CONFIGURE}>
                                Commit manifest to a desired repository.
                            </RadioGroupItem>
                        </div>
                    </RadioGroup>
                    {selectedRepoType === repoType.CONFIGURE && inputUrlBox()}
                </div>
                {renderInfoColorBar()}
                <hr />
            </div>
        </>
    )
}

export default UserGitRepo
