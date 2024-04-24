import {
    ACTION_STATE,
    CDModalTabType,
    DeploymentNodeType,
    FilterConditionsListType,
    KeyValueListType,
    ResponseType,
    ServerErrors,
    UserApprovalConfigType,
    WorkflowNodeType,
    WorkflowType,
} from '@devtron-labs/devtron-fe-common-lib'
import { MultiValue } from 'react-select'
import { WebhookPayloads } from '../app/details/triggerView/types'
import { EditDescRequest, OptionType } from '../app/types'
import { AppFilterTabs, BulkResponseStatus } from './Constants'
import { GVKType } from '../ResourceBrowser/Types'

interface BulkTriggerAppDetailType {
    workFlowId: string
    appId: number
    name: string
    material?: any[]
    warningMessage?: string
}

export interface BulkCIDetailType extends BulkTriggerAppDetailType {
    ciPipelineName: string
    ciPipelineId: string
    isFirstTrigger: boolean
    isCacheAvailable: boolean
    isLinkedCI: boolean
    isLinkedCD: boolean
    title: string
    isJobCI: boolean
    isWebhookCI: boolean
    parentAppId: number
    parentCIPipelineId: number
    errorMessage: string
    hideSearchHeader: boolean
    filteredCIPipelines: any
}

export interface BulkCDDetailTypeResponse {
    bulkCDDetailType: BulkCDDetailType[]
    uniqueReleaseTags: string[]
}

export interface BulkCDDetailType extends BulkTriggerAppDetailType {
    cdPipelineName?: string
    cdPipelineId?: string
    stageType?: DeploymentNodeType
    triggerType?: string
    envName: string
    envId: number
    parentPipelineId?: string
    parentPipelineType?: WorkflowNodeType
    parentEnvironmentName?: string
    approvalUsers?: string[]
    userApprovalConfig?: UserApprovalConfigType
    requestedUserId?: number
    appReleaseTags?: string[]
    tagsEditable?: boolean
    ciPipelineId?: number
    hideImageTaggingHardDelete?: boolean
    resourceFilters?: FilterConditionsListType[]
}

export interface ResponseRowType {
    appId: number
    appName: string
    status: BulkResponseStatus
    statusText: string
    message: string
    isVirtual?: boolean
    envId?: number
}

export interface BulkCITriggerType {
    appList: BulkCIDetailType[]
    closePopup: (e) => void
    updateBulkInputMaterial: (materialList: Record<string, any[]>) => void
    onClickTriggerBulkCI: (appIgnoreCache: Record<number, boolean>, appsToRetry?: Record<string, boolean>) => void
    showWebhookModal: boolean
    toggleWebhookModal: (id, webhookTimeStampOrder) => void
    webhookPayloads: WebhookPayloads
    isWebhookPayloadLoading: boolean
    hideWebhookModal: (e?) => void
    isShowRegexModal: (_appId: number, ciNodeId: number, inputMaterialList: any[]) => boolean
    responseList: ResponseRowType[]
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    runtimeParams: Record<string, KeyValueListType[]>
    setRuntimeParams: React.Dispatch<React.SetStateAction<Record<string, KeyValueListType[]>>>
    setPageViewType: React.Dispatch<React.SetStateAction<string>>
    httpProtocol: string
}

export interface BulkCDTriggerType {
    stage: DeploymentNodeType
    appList: BulkCDDetailType[]
    closePopup: (e) => void
    updateBulkInputMaterial: (materialList: Record<string, any>) => void
    onClickTriggerBulkCD: (appsToRetry?: Record<string, boolean>) => void
    changeTab?: (
        materrialId: string | number,
        artifactId: number,
        tab: CDModalTabType,
        selectedCDDetail?: { id: number; type: DeploymentNodeType },
    ) => void
    toggleSourceInfo?: (materialIndex: number, selectedCDDetail?: { id: number; type: DeploymentNodeType }) => void
    selectImage?: (
        index: number,
        materialType: string,
        selectedCDDetail?: { id: number; type: DeploymentNodeType },
    ) => void
    responseList: ResponseRowType[]
    isLoading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    isVirtualEnv?: boolean
    uniqueReleaseTags: string[]
    httpProtocol: string
}

export interface ProcessWorkFlowStatusType {
    cicdInProgress: boolean
    workflows: WorkflowType[]
}

export interface CIWorkflowStatusType {
    ciPipelineId: number
    ciPipelineName: string
    ciStatus: string
    storageConfigured: boolean
}

export interface CDWorkflowStatusType {
    ci_pipeline_id: number
    pipeline_id: number
    deploy_status: string
    pre_status: string
    post_status: string
}

export interface WorkflowsResponseType {
    workflows: WorkflowType[]
    filteredCIPipelines: Map<string, any>
}

export interface TriggerResponseModalType {
    closePopup: (e) => void
    responseList: ResponseRowType[]
    isLoading: boolean
    onClickRetryBuild: (appsToRetry: Record<string, boolean>) => void
    isVirtualEnv?: boolean
    envName?: string
    setDownloadPopupOpen?: (e) => void
}

export interface TriggerModalRowType {
    rowData: ResponseRowType
    index: number
    isVirtualEnv?: boolean
    envName?: string
    setDownloadPopupOpen?: (e) => void
}

export interface WorkflowNodeSelectionType {
    id: number
    name: string
    type: WorkflowNodeType
}
export interface WorkflowAppSelectionType {
    id: number
    name: string
    preNodeAvailable: boolean
    postNodeAvailable: boolean
}

export interface ConfigAppList {
    id: number
    name: string
    isProtected?: boolean
}

export interface EnvApp {
    envCount: number
    envList: EnvAppList[]
}

export interface EnvDeploymentStatus {
    appId: number
    pipelineId: number
    deployStatus: string
    wfrId?: number
}
export interface EnvAppList {
    id: number
    environment_name: string
    cluster_name: string
    active: boolean
    default: boolean
    namespace: string
    isClusterCdActive: boolean
    environmentIdentifier: string
    appCount: number
    isVirtualEnvironment?: boolean
}

export interface EmptyEnvState {
    title?: string
    subTitle?: string
    actionHandler?: () => void
}

export interface AppInfoListType {
    application: string
    appStatus: string
    deploymentStatus: string
    lastDeployed: string
    lastDeployedImage?: string
    lastDeployedBy?: string
    appId: number
    envId: number
    pipelineId?: number
    commits?: string[]
    ciArtifactId?: number
}

export interface AppListDataType {
    environment: string
    namespace: string
    cluster: string
    appInfoList: AppInfoListType[]
}

export interface EnvSelectorType {
    onChange: (e) => void
    envId: number
    envName: string
}

export interface ApplicationRouteType {
    envListData: ConfigAppList
}

export interface EnvironmentsListViewType {
    removeAllFilters: () => void
    isSuperAdmin: boolean
}

export interface EnvironmentLinkProps {
    namespace: string
    environmentId: number
    appCount: number
    handleClusterClick: (e) => void
    environmentName: string
}

export interface AppOverridesType {
    appList?: ConfigAppList[]
    environments: any
    setEnvironments: any
}

export interface GroupFilterType {
    appListOptions: OptionType[]
    selectedAppList: MultiValue<OptionType>
    setSelectedAppList: React.Dispatch<React.SetStateAction<MultiValue<OptionType>>>
    selectedFilterTab: AppFilterTabs
    setSelectedFilterTab: React.Dispatch<React.SetStateAction<AppFilterTabs>>
    groupFilterOptions: GroupOptionType[]
    selectedGroupFilter: MultiValue<GroupOptionType>
    setSelectedGroupFilter: React.Dispatch<React.SetStateAction<MultiValue<GroupOptionType>>>
    openCreateGroup: (e, groupId?: string) => void
    openDeleteGroup: (e, groupId: string) => void
    isSuperAdmin: boolean
}

export interface EnvHeaderType extends GroupFilterType {
    envName: string
    setEnvName: (label: string) => void
    setShowEmpty: (empty: boolean) => void
    showEmpty: boolean
}

export interface AppGroupAdminType {
    isSuperAdmin: boolean
}

export interface AppGroupDetailDefaultType {
    filteredAppIds: string
    appGroupListData?: AppGroupListType
    isVirtualEnv?: boolean
    envName?: string
    description?: string
    getAppListData?: () => Promise<void>
    handleSaveDescription?: (description: string) => Promise<void>
}

interface CIPipeline {
    appName: string
    appId: number
    id: number
    parentCiPipeline: number
    parentAppId: number
    pipelineType?: string
}
export interface CIConfigListType {
    pipelineList: CIPipeline[]
    securityModuleInstalled: boolean
    blobStorageConfigured: boolean
}

export interface AppGroupAppFilterContextType {
    appListOptions: OptionType[]
    selectedAppList: MultiValue<OptionType>
    setSelectedAppList: React.Dispatch<React.SetStateAction<MultiValue<OptionType>>>
    isMenuOpen: boolean
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedFilterTab: AppFilterTabs
    setSelectedFilterTab: React.Dispatch<React.SetStateAction<AppFilterTabs>>
    groupFilterOptions: GroupOptionType[]
    selectedGroupFilter: MultiValue<GroupOptionType>
    setSelectedGroupFilter: React.Dispatch<React.SetStateAction<MultiValue<GroupOptionType>>>
    openCreateGroup: (e, groupId?: string, _edit?: boolean) => void
    openDeleteGroup: (e, groupId: string, _delete?: boolean) => void
    isSuperAdmin: boolean
    filterParentType: FilterParentType
}

export interface CreateGroupAppListType {
    id: string
    appName: string
    isSelected: boolean
}

export interface CreateTypeOfAppListType {
    id: number
    appName: string
}

export interface CreateGroupType {
    appList: CreateGroupAppListType[]
    selectedAppGroup: GroupOptionType
    unAuthorizedApps?: Map<string, boolean>
    closePopup: (e, groupId?: number) => void
    filterParentType: FilterParentType
}

export interface ApplistEnvType {
    appId: number
    appName: string
    appStatus: string
    lastDeployedTime: string
    lastDeployedBy?: string
    lastDeployedImage?: string
    commits?: string[]
    ciArtifactId?: number
}

export interface AppGroupListType {
    namespace: string
    environmentName: string
    clusterName: string
    environmentId: number
    apps: ApplistEnvType[]
    description?: string
    environmentType?: 'Non-Production' | 'Production'
    createdOn?: string
    createdBy?: string
    clusterId?: number
}
export interface ConfigAppListType extends ResponseType {
    result?: ConfigAppList[]
}
export interface EnvAppType extends ResponseType {
    result?: EnvApp
}

export interface AppGroupList extends ResponseType {
    result?: AppGroupListType
}

export interface EnvDeploymentStatusType extends ResponseType {
    result?: EnvDeploymentStatus[]
}

export interface EnvGroupListType {
    id: number
    name: string
    appIds: number[]
    description: string
}

export interface CheckPermissionType {
    id?: number
    appIds: number[]
    name?: string
    description?: string
    envId?: number
    active?: boolean
}

export interface EnvGroupListResponse extends ResponseType {
    result?: EnvGroupListType[]
}

export interface EnvGroupResponse extends ResponseType {
    result?: EnvGroupListType
}

export interface CheckPermissionResponse extends ResponseType {
    result?: boolean
}

export interface GroupOptionType extends OptionType {
    appIds: number[]
    description: string
}

export interface SearchBarType {
    placeholder: string
    searchText: string
    setSearchText: React.Dispatch<React.SetStateAction<string>>
    searchApplied: boolean
    setSearchApplied: React.Dispatch<React.SetStateAction<boolean>>
}

export interface EditDescRequestResponse extends ResponseType {
    result?: EditDescRequest
}

export enum FilterParentType {
    app = 'env-group',
    env = 'app-group',
}

export interface HibernateStatusRowType {
    rowData: HibernateResponseRowType
    index: number
    isHibernateOperation: boolean
    isVirtualEnv?: boolean
    hibernateInfoMap: Record<number, HibernateInfoMapProps>
}

export interface HibernateResponseRowType {
    id: number
    appName: string
    success: boolean
    authError?: boolean
    error?: string
    skipped?: string
}

export interface BaseModalProps {
    selectedAppIds: number[]
    envName: string
    envId: string
    setAppStatusResponseList: React.Dispatch<React.SetStateAction<any[]>>
    setShowHibernateStatusDrawer: React.Dispatch<React.SetStateAction<StatusDrawer>>
}

export interface HibernateInfoMapProps {
    type: string
    excludedUserEmails: string[]
    userActionState: ACTION_STATE
}
export interface HibernateModalProps extends BaseModalProps {
    setOpenHiberateModal: React.Dispatch<React.SetStateAction<boolean>>
    isDeploymentLoading: boolean
    showDefaultDrawer: boolean
}

export interface UnhibernateModalProps extends BaseModalProps {
    setOpenUnhiberateModal: React.Dispatch<React.SetStateAction<boolean>>
    isDeploymentLoading: boolean
    showDefaultDrawer: boolean
}

export interface StatusDrawer {
    hibernationOperation: boolean
    showStatus: boolean
}

export interface ManageAppsResponse {
    appName: string
    id: number
    success: boolean
    skipped?: string
    error?: string
    authError?: boolean
}

export interface batchConfigType {
    lastIndex: number
    results: any[]
    concurrentCount: number
    completedCalls: number
}

export enum ApiQueuingBatchStatusType {
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected',
}

// TODO: use T for value
export interface ApiQueuingWithBatchResponseItem {
    status: ApiQueuingBatchStatusType
    value?: any
    reason?: ServerErrors
}

export interface RestartWorkloadModalProps {
    closeModal: (e) => void
    selectedAppIds: number[]
    envName: string
    workloadLoader: boolean
    workloadList: WorkloadListResult
}
export interface ResourceIdentifiers {
    name: string
    namespace: string
    groupVersionKind: GVKType
}

export interface ResourceIdentifierMap {
    [appId: string]: { resourceIdentifiers: ResourceIdentifiers[]; appName: string; environmentId: number, isCollapsed?: boolean }
}

export interface WorkloadListResult {
    environmentId: number | number[]
    resourceIdentifiers?: ResourceIdentifiers[]
    userId: number
    resourceIdentifierMap: ResourceIdentifierMap
}
export interface AppGroupRotatePodsDTO extends ResponseType {
    result: WorkloadListResult
}
