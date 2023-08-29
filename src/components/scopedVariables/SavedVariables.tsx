import React, { useState, useRef, useEffect } from 'react'
import { LoadScopedVariables, ScopedVariablesEditor } from './UploadScopedVariables'
import { TableList, TableItem } from './Table'
import { useFileReader, useClickOutside } from './utils/hooks'
import CodeEditor from '../CodeEditor/CodeEditor'
import Descriptor from './Descriptor'
import { downloadData } from './utils/helpers'
import { FileView, SavedVariablesViewI, VariableListItemI } from './types'
import {
    DOWNLOAD_FILE_NAME,
    DOWNLOAD_TEMPLATE_NAME,
    DROPDOWN_ITEMS,
    VARIABLES_TEMPLATE,
    SAMPLE_DATA,
    TABLE_LIST_HEADINGS,
} from './constants'
import { ReactComponent as ICFileDownload } from '../../assets/icons/ic-file-download.svg'

const SavedVariablesView = ({ scopedVariables, setScopedVariables }: SavedVariablesViewI) => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const [currentView, setCurrentView] = useState<FileView>(FileView.YAML)
    const [variablesList, setVariablesList] = useState<VariableListItemI[]>([])
    const dropdownRef = useRef(null)

    const { status, progress, fileData, abortRead, readFile } = useFileReader()

    useEffect(() => {
        if (status?.status == null) {
            const variables = SAMPLE_DATA?.Variables?.map((varaibleSpec) => {
                return {
                    name: varaibleSpec.definition?.varName,
                    description: varaibleSpec.definition?.description,
                }
            })
            if (variables) setVariablesList([...variables])
        }
    }, [])

    const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setShowDropdown(!showDropdown)
    }

    useClickOutside(dropdownRef, () => {
        setShowDropdown(false)
    })

    const handleDownload = (item: string) => {
        switch (item) {
            case DROPDOWN_ITEMS[0]:
                downloadData(scopedVariables, DOWNLOAD_FILE_NAME, 'application/x-yaml')
                setShowDropdown(false)
                break
            case DROPDOWN_ITEMS[1]:
                downloadData(VARIABLES_TEMPLATE, DOWNLOAD_TEMPLATE_NAME, 'application/x-yaml')
                setShowDropdown(false)
                break
        }
    }

    if (status?.status === true) {
        return (
            <ScopedVariablesEditor
                variablesData={status?.message?.data}
                name={fileData?.name}
                abortRead={abortRead}
                setScopedVariables={setScopedVariables}
            />
        )
    }

    return status?.status == null ? (
        <div
            className="flex column h-100 dc__content-space default-bg-color"
            style={{
                overflowY: 'hidden',
            }}
        >
            <Descriptor showUploadButton readFile={readFile}>
                <div className="scoped-variables-tab-container">
                    <button
                        className={`scoped-variables-tab ${
                            currentView === FileView.YAML ? 'scoped-variables-active-tab' : ''
                        }`}
                        onClick={() => setCurrentView(FileView.YAML)}
                    >
                        <div>YAML</div>
                    </button>
                    <button
                        className={`scoped-variables-tab ${
                            currentView === FileView.SAVED ? 'scoped-variables-active-tab' : ''
                        }`}
                        onClick={() => setCurrentView(FileView.SAVED)}
                    >
                        <div>Variable List</div>
                    </button>
                </div>
            </Descriptor>

            {currentView === FileView.YAML ? (
                <div className="saved-variables-editor-background">
                    <div className="saved-variables-editor-container">
                        <div className="scoped-variables-editor-infobar">
                            <p className="scoped-variables-editor-infobar__typography">Last saved file</p>
                            <button className="scoped-variables-editor-infobar__btn" onClick={handleDropdownClick}>
                                <ICFileDownload width={20} height={20} />
                            </button>
                            {showDropdown && (
                                <div className="scoped-variables-editor-infobar__dropdown" ref={dropdownRef}>
                                    {DROPDOWN_ITEMS.map((item) => (
                                        <div
                                            key={item}
                                            className="scoped-variables-editor-infobar__dropdown-item"
                                            onClick={() => handleDownload(item)}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <CodeEditor value={scopedVariables} mode="yaml" height="100%" readOnly />
                    </div>
                </div>
            ) : (
                <TableList width={['200px', '429px']} headings={TABLE_LIST_HEADINGS}>
                    {variablesList?.map((item) => (
                        <TableItem
                            key={item.name}
                            columnsData={[item.name, item.description]}
                            width={['200px', '429px']}
                        />
                    ))}
                </TableList>
            )}
        </div>
    ) : (
        <div className="flex column h-100 dc__content-space">
            <Descriptor />
            <div className="flex center flex-grow-1">
                <div className="flex column center dc__gap-20 w-320 dc__no-shrink">
                    <div className="upload-scoped-variables-card">
                        <LoadScopedVariables
                            status={status}
                            progress={progress}
                            fileData={fileData}
                            abortRead={abortRead}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SavedVariablesView
