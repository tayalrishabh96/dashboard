import React from 'react'
import ReactSelect from 'react-select'
import Tippy from '@tippyjs/react'
import { CustomInput } from '@devtron-labs/devtron-fe-common-lib'
import { renderOptionIcon, repositoryControls, repositoryOption } from './CIBuildpackBuildOptions'
import { _multiSelectStyles } from './CIConfig.utils'
import { CISelfDockerBuildOptionProps } from './types'

export default function CISelfDockerBuildOption({
    readOnly,
    sourceConfig,
    readonlyDockerfileRelativePath,
    selectedMaterial,
    dockerFileValue,
    configOverrideView,
    currentMaterial,
    repositoryError,
    handleOnChangeConfig,
    handleFileLocationChange,
    dockerfileError,
}: CISelfDockerBuildOptionProps) {
    if (readOnly) {
        return (
            <div className={`${configOverrideView ? 'mb-12' : ''}  form-row__docker`}>
                <div className={`form__field ${configOverrideView ? 'mb-0-imp' : ''}`}>
                    <label className="form__label">Repository containing Dockerfile</label>

                    <div className="flex left">
                        {currentMaterial?.url && renderOptionIcon(currentMaterial.url)}
                        <span className="fs-14 fw-4 lh-20 cn-9">{currentMaterial?.name || 'Not selected'}</span>
                    </div>

                    {repositoryError && <label className="form__error">{repositoryError}</label>}
                </div>

                <div className={`form__field ${configOverrideView ? 'mb-0-imp' : ''}`}>
                    <label htmlFor="" className="form__label dc__required-field">
                        Dockerfile Path (Relative)
                    </label>

                    <span className="fs-14 fw-4 lh-20 cn-9">{readonlyDockerfileRelativePath}</span>
                </div>
            </div>
        )
    }

    return (
        <div className={`${configOverrideView ? 'mb-12' : ''}  form-row__docker`}>
            <div className={`form__field ${configOverrideView ? 'mb-0-imp' : ''}`}>
                <label className="form__label">Select repository containing Dockerfile</label>

                <ReactSelect
                    className="m-0"
                    classNamePrefix="build-config__select-repository-containing-dockerfile"
                    tabIndex={3}
                    isMulti={false}
                    isClearable={false}
                    options={sourceConfig.material}
                    getOptionLabel={(option) => `${option.name}`}
                    getOptionValue={(option) => `${option.checkoutPath}`}
                    value={selectedMaterial}
                    styles={{
                        ..._multiSelectStyles,
                        menu: (base) => ({
                            ...base,
                            marginTop: '0',
                            paddingBottom: '4px',
                        }),
                    }}
                    components={{
                        IndicatorSeparator: null,
                        Option: repositoryOption,
                        Control: repositoryControls,
                    }}
                    onChange={handleFileLocationChange}
                />

                {repositoryError && <label className="form__error">{repositoryError}</label>}
            </div>

            <div className={`form__field ${configOverrideView ? 'mb-0-imp' : ''}`}>
                <label htmlFor="" className="form__label dc__required-field">
                    Dockerfile Path (Relative)
                </label>

                <div className="docker-file-container">
                    <Tippy
                        className="default-tt"
                        arrow={false}
                        placement="top"
                        content={selectedMaterial?.checkoutPath}
                    >
                        <span className="h-38 checkout-path-container bcn-1 en-2 bw-1 dc__no-right-border dc__ellipsis-right">
                            {selectedMaterial?.checkoutPath}
                        </span>
                    </Tippy>

                    <CustomInput
                        tabIndex={4}
                        rootClassName="file-name"
                        data-testid="dockerfile-path-text-box"
                        placeholder="Dockerfile"
                        name="dockerfile"
                        value={dockerFileValue}
                        onChange={handleOnChangeConfig}
                        autoComplete="off"
                        autoFocus={!configOverrideView}
                        error={dockerfileError}
                    />
                </div>
            </div>
        </div>
    )
}
