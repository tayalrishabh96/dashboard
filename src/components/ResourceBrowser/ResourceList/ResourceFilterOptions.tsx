/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import ReactSelect from 'react-select'
import { withShortcut, IWithShortcut } from 'react-keybind'
import { ConditionalWrap, useAsync, useRegisterShortcut, OptionType } from '@devtron-labs/devtron-fe-common-lib'
import { Option } from '../../v2/common/ReactSelect.utils'
import { ResourceFilterOptionsProps, URLParams } from '../Types'
import { ReactComponent as Search } from '../../../assets/icons/ic-search.svg'
import { ReactComponent as Clear } from '../../../assets/icons/ic-error.svg'
import { ResourceValueContainerWithIcon, tippyWrapper } from './ResourceList.component'
import { ALL_NAMESPACE_OPTION, FILTER_SELECT_COMMON_STYLES, NAMESPACE_NOT_APPLICABLE_OPTION } from '../Constants'
import { ShortcutKeyBadge } from '../../common/formFields/Widgets/Widgets'
import { convertToOptionsList, importComponentFromFELibrary } from '../../common'
import { namespaceListByClusterId } from '../ResourceBrowser.service'
import { URLS } from '../../../config'

const FilterButton = importComponentFromFELibrary('FilterButton', null, 'function')

const ResourceFilterOptions = ({
    selectedResource,
    selectedNamespace,
    selectedCluster,
    setSelectedNamespace,
    searchText,
    isOpen,
    setSearchText,
    isSearchInputDisabled,
    runSearch,
    shortcut,
    renderRefreshBar,
    updateK8sResourceTab,
}: ResourceFilterOptionsProps & IWithShortcut) => {
    const { registerShortcut } = useRegisterShortcut()
    const location = useLocation()
    const { replace } = useHistory()
    const { clusterId, group } = useParams<URLParams>()
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [isInputFocused, setIsInputFocused] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const showShortcutKey = !isInputFocused && !searchText

    const [, namespaceByClusterIdList] = useAsync(() => namespaceListByClusterId(clusterId), [clusterId])

    const namespaceOptions = useMemo(
        () => [ALL_NAMESPACE_OPTION, ...convertToOptionsList(namespaceByClusterIdList?.result?.sort() || [])],
        [namespaceByClusterIdList],
    )

    const handleInputShortcut = () => {
        searchInputRef.current?.focus()
    }

    const handleShowFilterModal = () => {
        setShowFilterModal(true)
    }

    useEffect(() => {
        if (registerShortcut && isOpen) {
            shortcut.registerShortcut(handleInputShortcut, ['r'], 'ResourceSearchFocus', 'Focus resource search')
            shortcut.registerShortcut(
                handleShowFilterModal,
                ['f'],
                'ResourceFilterDrawer',
                'Open resource filter drawer',
            )
        }
        return (): void => {
            shortcut.unregisterShortcut(['f'])
            shortcut.unregisterShortcut(['r'])
        }
    }, [registerShortcut, isOpen])

    const handleFilterKeyUp = (e: React.KeyboardEvent): void => {
        switch (e.key) {
            case 'Escape':
            case 'Esc':
                searchInputRef.current?.blur()
                break
            case 'Enter':
                runSearch(searchText)
                break
            case 'Backspace':
                if (!searchText) {
                    runSearch('')
                }
                break
            default:
        }
    }

    const handleOnChangeSearchText: React.FormEventHandler<HTMLInputElement> = (event): void => {
        setSearchText(event.currentTarget.value)
    }

    const handleNamespaceChange = (selected: OptionType): void => {
        if (selected.value === selectedNamespace?.value) {
            return
        }
        const url = `${URLS.RESOURCE_BROWSER}/${clusterId}/${selected.value}/${selectedResource.gvk.Kind.toLowerCase()}/${group}?${location.search}`
        updateK8sResourceTab(url)
        replace(url)
        setSelectedNamespace(selected)
    }

    const handleInputBlur = () => setIsInputFocused(false)

    const handleInputFocus = () => setIsInputFocused(true)

    const clearSearchInput = () => {
        setSearchText('')
        runSearch('')
        searchInputRef.current?.focus()
    }

    return (
        <>
            {typeof renderRefreshBar === 'function' && renderRefreshBar()}
            <div className="resource-filter-options-container flexbox dc__content-space pt-16 pr-20 pb-12 pl-20 w-100">
                <div className="search dc__position-rel margin-right-0 en-2 bw-1 br-4 h-32 cursor-text">
                    <Search className="search__icon icon-dim-16" onClick={handleInputShortcut} />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={`Search ${selectedResource?.gvk?.Kind || ''}`}
                        value={searchText}
                        className={`search__input ${isSearchInputDisabled ? 'cursor-not-allowed' : ''}`}
                        onChange={handleOnChangeSearchText}
                        onKeyUp={handleFilterKeyUp}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        disabled={isSearchInputDisabled}
                        data-testid="search-input-for-resource"
                    />
                    {!!searchText && (
                        <button
                            className="search__clear-button"
                            type="button"
                            onClick={clearSearchInput}
                            aria-label="Search resources"
                        >
                            <Clear className="icon-dim-18 icon-n4 dc__vertical-align-middle" />
                        </button>
                    )}
                    {showShortcutKey && (
                        <ShortcutKeyBadge
                            shortcutKey="r"
                            rootClassName="resource-search-shortcut-key"
                            onClick={handleInputShortcut}
                        />
                    )}
                </div>
                <div className="flex-grow-1" />
                {FilterButton && (
                    <FilterButton
                        clusterName={selectedCluster?.label || ''}
                        updateTabUrl={updateK8sResourceTab}
                        showModal={showFilterModal}
                        setShowModal={setShowFilterModal}
                    />
                )}
                <div className="resource-filter-options-wrapper flex">
                    <ConditionalWrap condition={selectedResource && !selectedResource.namespaced} wrap={tippyWrapper}>
                        <ReactSelect
                            placeholder="Select Namespace"
                            className="w-220 ml-8"
                            classNamePrefix="resource-filter-select"
                            options={namespaceOptions}
                            value={selectedResource?.namespaced ? selectedNamespace : NAMESPACE_NOT_APPLICABLE_OPTION}
                            onChange={handleNamespaceChange}
                            blurInputOnSelect
                            isDisabled={!selectedResource?.namespaced}
                            styles={FILTER_SELECT_COMMON_STYLES}
                            components={{
                                IndicatorSeparator: null,
                                Option,
                                ValueContainer: ResourceValueContainerWithIcon,
                            }}
                        />
                    </ConditionalWrap>
                </div>
            </div>
        </>
    )
}

export default withShortcut(ResourceFilterOptions)
