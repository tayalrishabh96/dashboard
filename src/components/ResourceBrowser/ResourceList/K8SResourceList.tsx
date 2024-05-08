import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useParams, useRouteMatch, useLocation } from 'react-router-dom'
import DOMPurify from 'dompurify'
import Tippy from '@tippyjs/react'
import {
    ConditionalWrap,
    Progressing,
    useAsync,
    abortPreviousRequests,
    highlightSearchText,
    Pagination,
    useSearchString,
    Nodes,
} from '@devtron-labs/devtron-fe-common-lib'
import WebWorker from '../../app/WebWorker'
import searchWorker from '../../../config/searchWorker'
import { importComponentFromFELibrary } from '../../common/helpers/Helpers'
import ResourceBrowserActionMenu from './ResourceBrowserActionMenu'
import {
    ALL_NAMESPACE_OPTION,
    K8S_EMPTY_GROUP,
    RESOURCE_EMPTY_PAGE_STATE,
    RESOURCE_LIST_EMPTY_STATE,
    RESOURCE_PAGE_SIZE_OPTIONS,
    SIDEBAR_KEYS,
    EVENT_LIST,
    SEARCH_QUERY_PARAM_KEY,
} from '../Constants'
import { getResourceList, getResourceListPayload } from '../ResourceBrowser.service'
import { K8SResourceListType, ResourceDetailType, URLParams } from '../Types'
import ResourceListEmptyState from './ResourceListEmptyState'
import { EventList } from './EventList'
import ResourceFilterOptions from './ResourceFilterOptions'
import {
    getScrollableResourceClass,
    sortEventListData,
    removeDefaultForStorageClass,
    updateQueryString,
} from '../Utils'
import { URLS } from '../../../config'

const PodRestartIcon = importComponentFromFELibrary('PodRestartIcon')
const PodRestart = importComponentFromFELibrary('PodRestart')

export const K8SResourceList = ({
    selectedResource,
    selectedCluster,
    addTab,
    renderRefreshBar,
    showStaleDataWarning,
    updateK8sResourceTab,
}: K8SResourceListType) => {
    const { searchParams } = useSearchString()
    const { push } = useHistory()
    const { url } = useRouteMatch()
    const location = useLocation()
    const { clusterId, namespace, nodeType } = useParams<URLParams>()
    const [selectedNamespace, setSelectedNamespace] = useState(ALL_NAMESPACE_OPTION)
    const [fixedNodeNameColumn, setFixedNodeNameColumn] = useState(false)
    const [resourceListOffset, setResourceListOffset] = useState(0)
    const [pageSize, setPageSize] = useState(100)
    const [filteredResourceList, setFilteredResourceList] = useState(null)
    const resourceListRef = useRef<HTMLDivElement>(null)
    const searchWorkerRef = useRef(null)
    const abortControllerRef = useRef(new AbortController())

    const searchText = searchParams[SEARCH_QUERY_PARAM_KEY] || ''

    /* TODO: what to do with the error? */
    const [resourceListLoader, _resourceList, /*resourceListDataError*/, reloadResourceListData] = useAsync(() => {
        if (!selectedResource || selectedResource.gvk.Kind === SIDEBAR_KEYS.nodeGVK.Kind) {
            return null
        }
        return abortPreviousRequests(
            () => getResourceList(
                getResourceListPayload(
                    clusterId,
                    selectedNamespace.value.toLowerCase(),
                    selectedResource,
                    location.search,
                ),
                abortControllerRef.current.signal,
            ),
            abortControllerRef,
        )
    }, [selectedResource, clusterId, selectedNamespace])

    const resourceList = _resourceList?.result || null

    const showPaginatedView = resourceList?.data?.length >= 100

    useEffect(() => {
        if (!resourceList) {
            return
        }
        switch (selectedResource?.gvk.Kind) {
            case SIDEBAR_KEYS.nodeGVK.Kind:
                resourceList.data = sortEventListData(resourceList.data)
                break
            case Nodes.StorageClass:
                resourceList.data = removeDefaultForStorageClass(resourceList.data)
                break
            default:
                break
        }
        handleFilterChanges(searchText, resourceList)
    }, [resourceList])

    useEffect(() => {
        if (resourceList?.headers.length) {
            /**
             * 166 is standard with of every column for calculations
             * 295 is width of left nav + sidebar
             * 200 is the diff of name column
             */
            const appliedColumnDerivedWidth = resourceList.headers.length * 166 + 295 + 200
            const windowWidth = window.innerWidth
            const clientWidth = 0
            setFixedNodeNameColumn(windowWidth < clientWidth || windowWidth < appliedColumnDerivedWidth)
        }
    }, [resourceList?.headers])

    useEffect(() => {
        resetPaginator()
    }, [nodeType])

    useEffect(() => {
        return () => {
            if (!searchWorkerRef.current) {
                return
            }
            searchWorkerRef.current.postMessage({ type: 'stop' })
            searchWorkerRef.current = null
        }
    }, [])

    const setSearchText = (text: string) => {
        const searchParamString = updateQueryString(location, [[SEARCH_QUERY_PARAM_KEY, text]])
        updateK8sResourceTab(location.pathname + `?${searchParamString}`)
        handleFilterChanges(searchText, resourceList)
    }

    const resetPaginator = () => {
        setResourceListOffset(0)
        setPageSize(100)
    }

    const handleFilterChanges = (
        _searchText: string,
        _resourceList: ResourceDetailType
    ): void => {
        if (!searchWorkerRef.current) {
            searchWorkerRef.current = new WebWorker(searchWorker)
            searchWorkerRef.current.onmessage = (e) => {
                setFilteredResourceList(e.data)
            }
        }

        if (resourceList) {
            searchWorkerRef.current.postMessage({
                type: 'start',
                payload: {
                    searchText: _searchText,
                    list: _resourceList.data,
                    searchInKeys: [
                        'name',
                        'namespace',
                        'status',
                        'message',
                        EVENT_LIST.dataKeys.involvedObject,
                        'source',
                        'reason',
                        'type',
                        'age',
                        'node',
                        'ip',
                    ],
                    origin: new URL(window.__BASE_URL__, window.location.href).origin,
                },
            })
        }
    }

    const handleResourceClick = (e) => {
        const { name, tab, namespace, origin } = e.currentTarget.dataset
        let resourceParam: string
        let kind: string
        let resourceName: string
        let _group: string
        const _namespace = namespace ?? ALL_NAMESPACE_OPTION.value
        if (origin === 'event') {
            const [_kind, _resourceName] = name.split('/')
            _group = selectedResource?.gvk.Group.toLowerCase() || K8S_EMPTY_GROUP
            resourceParam = `${_kind}/${_group}/${_resourceName}`
            kind = _kind
            resourceName = _resourceName
        } else {
            resourceParam = `${nodeType}/${selectedResource?.gvk?.Group?.toLowerCase() || K8S_EMPTY_GROUP}/${name}`
            kind = nodeType
            resourceName = name
            _group = selectedResource?.gvk?.Group?.toLowerCase() || K8S_EMPTY_GROUP
        }

        const _url = `${URLS.RESOURCE_BROWSER}/${clusterId}/${_namespace}/${resourceParam}${
            tab ? `/${tab.toLowerCase()}` : ''
        }`
        const idPrefix = kind === 'node' ? `${_group}` : `${_group}_${_namespace}`
        const isAdded = addTab(idPrefix, kind, resourceName, _url)

        if (isAdded) {
            push(_url)
        }
    }

    const handleNodeClick = (e) => {
        const { name } = e.currentTarget.dataset
        const _url = `${url.split('/').slice(0, -2).join('/')}/node/${K8S_EMPTY_GROUP}/${name}`
        const isAdded = addTab(K8S_EMPTY_GROUP, 'node', name, _url)
        if (isAdded) {
            push(_url)
        }
    }

    const getStatusClass = (status: string) => {
        let statusPostfix = status?.toLowerCase()

        if (statusPostfix && (statusPostfix.includes(':') || statusPostfix.includes('/'))) {
            statusPostfix = statusPostfix.replace(':', '__').replace('/', '__')
        }

        return `f-${statusPostfix}`
    }

    const renderResourceRow = (resourceData: Record<string, any>, index: number): JSX.Element => {
        return (
            <div
                key={`row--${index}-${resourceData.name}`}
                className="dc_width-max-content dc_min-w-100 fw-4 cn-9 fs-13 dc__border-bottom-n1 pr-20 hover-class h-44 flexbox  dc__visible-hover dc__hover-n50"
            >
                {resourceList?.headers.map((columnName, idx) =>
                    columnName === 'name' ? (
                        <div
                            key={`${resourceData.name}-${idx}`}
                            className={`w-350 dc__inline-flex mr-16 pl-20 pr-8 pt-12 pb-12 ${
                                fixedNodeNameColumn ? 'dc__position-sticky sticky-column dc__border-right' : ''
                            }`}
                        >
                            <div className="w-100 flex left" data-testid="created-resource-name">
                                <div className="w-303 pr-4">
                                    <div className="dc__w-fit-content dc__mxw-304 pr-4">
                                        <Tippy
                                            className="default-tt"
                                            arrow={false}
                                            placement="right"
                                            content={resourceData.name}
                                        >
                                            <a
                                                className="dc__link dc__ellipsis-right dc__block cursor"
                                                data-name={resourceData.name}
                                                data-namespace={resourceData.namespace}
                                                onClick={handleResourceClick}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(
                                                            highlightSearchText({
                                                                searchText,
                                                                text: resourceData.name,
                                                                highlightClasses: 'p-0 fw-6 bcy-2',
                                                            }),
                                                        ),
                                                    }}
                                                />
                                            </a>
                                        </Tippy>
                                    </div>
                                </div>
                                <ResourceBrowserActionMenu
                                    clusterId={clusterId}
                                    resourceData={resourceData}
                                    getResourceListData={reloadResourceListData}
                                    selectedResource={selectedResource}
                                    handleResourceClick={handleResourceClick}
                                />
                            </div>
                        </div>
                    ) : (
                        <div
                            key={`${resourceData.name}-${idx}`}
                            className={`dc__inline-block dc__ellipsis-right mr-16 pt-12 pb-12 w-150 ${
                                columnName === 'status'
                                    ? ` app-summary__status-name ${getStatusClass(resourceData[columnName])}`
                                    : ''
                            }`}
                        >
                            <ConditionalWrap
                                condition={columnName === 'node'}
                                wrap={(children) => (
                                    <a
                                        className="dc__link dc__ellipsis-right dc__block cursor"
                                        data-name={resourceData[columnName]}
                                        onClick={handleNodeClick}
                                    >
                                        {children}
                                    </a>
                                )}
                            >
                                <span
                                    data-testid={`${columnName}-count`}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                            highlightSearchText({
                                                searchText,
                                                text: resourceData[columnName]?.toString(),
                                                highlightClasses: 'p-0 fw-6 bcy-2',
                                            }),
                                        ),
                                    }}
                                />
                                <span>
                                    {columnName === 'restarts' && Number(resourceData.restarts) !== 0 && PodRestartIcon && (
                                        <PodRestartIcon
                                            clusterId={clusterId}
                                            name={resourceData.name}
                                            namespace={resourceData.namespace}
                                        />
                                    )}
                                </span>
                            </ConditionalWrap>
                        </div>
                    ),
                )}
            </div>
        )
    }

    const emptyStateActionHandler = () => {
        setFilteredResourceList(resourceList?.data)
        setSearchText('')
        const pathname = location.pathname.replace(`/${namespace}/`, `/${ALL_NAMESPACE_OPTION.value}/`)
        updateK8sResourceTab(pathname)
        setSelectedNamespace(ALL_NAMESPACE_OPTION)
    }

    const renderEmptyPage = (): JSX.Element => {
        if (!resourceList) {
            return (
                <ResourceListEmptyState
                    title={RESOURCE_EMPTY_PAGE_STATE.title(selectedResource?.gvk?.Kind)}
                    subTitle={RESOURCE_EMPTY_PAGE_STATE.subTitle(
                        selectedResource?.gvk?.Kind,
                        selectedResource?.namespaced,
                    )}
                />
            )
        }
        return (
            <ResourceListEmptyState
                title={RESOURCE_LIST_EMPTY_STATE.title}
                subTitle={RESOURCE_LIST_EMPTY_STATE.subTitle(selectedResource?.gvk?.Kind)}
                actionHandler={emptyStateActionHandler}
            />
        )
    }

    const changePage = (pageNo: number) => {
        setResourceListOffset(pageSize * (pageNo - 1))

        // scroll to top on page change
        if (resourceListRef.current) {
            resourceListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const changePageSize = (size: number) => {
        setPageSize(size)
        setResourceListOffset(0)
    }

    const renderResourceList = (): JSX.Element => {
        return (
            <div
                ref={resourceListRef}
                className={getScrollableResourceClass(
                    'scrollable-resource-list',
                    showPaginatedView,
                    showStaleDataWarning,
                )}
            >
                <div className="h-36 fw-6 cn-7 fs-12 dc__border-bottom pr-20 dc__uppercase list-header bcn-0 dc__position-sticky">
                    {resourceList?.headers.map((columnName) => (
                        <div
                            key={columnName}
                            className={`list-title dc__inline-block mr-16 pt-8 pb-8 dc__ellipsis-right ${
                                columnName === 'name'
                                    ? `${
                                          fixedNodeNameColumn
                                              ? 'bcn-0 dc__position-sticky  sticky-column dc__border-right dc__border-bottom h-35'
                                              : ''
                                      } w-350 pl-20`
                                    : 'w-150'
                            }`}
                        >
                            {columnName}
                        </div>
                    ))}
                </div>
                {filteredResourceList
                    .slice(resourceListOffset, resourceListOffset + pageSize)
                    .map((clusterData, index) => renderResourceRow(clusterData, index))}
            </div>
        )
    }

    const renderList = (): JSX.Element => {
        if (filteredResourceList.length === 0) {
            return renderEmptyPage()
        }
        return (
            <>
                {selectedResource?.gvk.Kind === SIDEBAR_KEYS.eventGVK.Kind ? (
                    <EventList
                        listRef={resourceListRef}
                        filteredData={filteredResourceList.slice(resourceListOffset, resourceListOffset + pageSize)}
                        handleResourceClick={handleResourceClick}
                        paginatedView={showPaginatedView}
                        syncError={showStaleDataWarning}
                        searchText={searchText}
                    />
                ) : (
                    renderResourceList()
                )}
                {showPaginatedView && (
                    <Pagination
                        rootClassName="resource-browser-paginator dc__border-top"
                        size={filteredResourceList.length}
                        pageSize={pageSize}
                        offset={resourceListOffset}
                        changePage={changePage}
                        changePageSize={changePageSize}
                        pageSizeOptions={RESOURCE_PAGE_SIZE_OPTIONS}
                    />
                )}
            </>
        )
    }

    return (
        <div
            className={`resource-list-container dc__border-left dc__position-rel ${
                filteredResourceList?.length === 0 ? 'no-result-container' : ''
            }`}
        >
            <ResourceFilterOptions
                selectedResource={selectedResource}
                selectedNamespace={selectedNamespace}
                setSelectedNamespace={setSelectedNamespace}
                selectedCluster={selectedCluster}
                searchText={searchText}
                resourceList={resourceList}
                setSearchText={setSearchText}
                handleFilterChanges={handleFilterChanges}
                isSearchInputDisabled={resourceListLoader}
                renderRefreshBar={renderRefreshBar}
                updateK8sResourceTab={updateK8sResourceTab}
            />
            {resourceListLoader || !resourceList || !filteredResourceList ? <Progressing size={32} pageLoader /> : renderList()}
            {PodRestart && (
                <PodRestart />
            )}
        </div>
    )
}
