import { ResponseType, VulnerabilityType } from '@devtron-labs/devtron-fe-common-lib';
import { DeploymentAppType } from '../components/v2/appDetails/appDetails.type';
import { DeploymentAppTypes } from '../config';

export interface RootObject {
    code: number;
    status?: string;
    result: any;
}

export interface CDPipelines {
    pipelines: CDPipeline[];
}

type DeploymentStrategyType = 'CANARY' | 'ROLLING' | 'RECREATE' | 'BLUE_GREEN'

export interface DeploymentStrategy {
    deploymentTemplate: DeploymentStrategyType;
    config: any;
    default: boolean;
}

export interface PrePostStage {
    triggerType: 'AUTOMATIC' | 'MANUAL';
    name: string;
    config: string;
}

export interface CDPipeline {
    id: number;
    environmentId: number;
    environmentName: string;
    description: string;
    ciPipelineId: number;
    triggerType: string;
    name: string;
    strategies: DeploymentStrategy[];
    deploymentTemplate: string;
    preStage: PrePostStage;
    postStage: PrePostStage;
    preStageConfigMapSecretNames: { configMaps: string[], secrets: string[] };
    postStageConfigMapSecretNames: { configMaps: string[], secrets: string[] };
    runPreStageInEnv: boolean;
    runPostStageInEnv: boolean;
    isClusterCdActive: boolean;
    deploymentAppType?: DeploymentAppType
}

export interface AppListMin extends ResponseType {
    result?: { id: number, name: string }[];
}

export interface ProjectFilteredApps extends ResponseType {
    result?: {
        projectId: number;
        projectName: string;
        appList: {
            id: number;
            name: string;
        }[]
    }[]
}

export interface AppEnvironment {
    environmentId: number;
    environmentName: string;
    appMetrics: boolean;
    infraMetrics: boolean;
    prod: boolean;
    chartRefId?: number
    lastDeployed?: string
    appStatus?: string
    deploymentAppDeleteRequest?: boolean
    isVirtualEnvironment?: boolean
}

export interface AppOtherEnvironment extends ResponseType {
    result?: AppEnvironment[]
}

export interface LastExecutionResponseType {
    code: number;
    status: string;
    result: {
        scanExecutionId: number;
        lastExecution: string;
        appId?: number;
        appName?: string;
        envId?: number;
        envName?: string;
        pod?: string;
        replicaSet?: string;
        image?: string;
        objectType: 'app' | 'chart';
        scanned: boolean;
        scanEnabled: boolean;
        severityCount: {
            critical: number;
            moderate: number;
            low: number;
        },
        vulnerabilities: VulnerabilityType[];
        scanToolId ?:number
    }
}

export interface LastExecutionMinResponseType {
    code: number;
    status: string;
    result: {
        lastExecution: string;
        imageScanDeployInfoId: number;
        severityCount: {
            critical: number;
            moderate: number;
            low: number;
        },
    }
}

export interface HostURLConfig {
    id: number,
    key: string;
    value: string,
    active: boolean,
}

export interface HostURLConfigResponse extends ResponseType {
    result?: HostURLConfig;
}

export interface ClusterEnvironmentDetailList extends ResponseType {
    result?: ClusterEnvironmentDetail[]
}

export interface ClusterEnvironmentDetail {
    id: number, //envId
    environment_name : string,
    active: boolean,
    cluster_id : number
    cluster_name : string,
    namespace : string
}

export interface EnvironmentListHelmResponse extends ResponseType{
    result?: EnvironmentListHelmResult[]
}

export interface EnvironmentListHelmResult {
    clusterId : number,
    clusterName : string,
    environments : EnvironmentHelmResult[]
}

export interface EnvironmentHelmResult {
    environmentId : number,
    environmentName: string,
    namespace: string,
    environmentIdentifier: string
    isVirtualEnvironment?: boolean // Need to confirm for not full mode
    allowedDeploymentTypes?: DeploymentAppTypes[]
}

export interface ClusterListResponse extends ResponseType {
    result?: Cluster[]
}

export interface Cluster {
    id: number
    cluster_name: string
    active: boolean
    errorInConnecting?: string
    isVirtualCluster?: boolean
}
export interface LoginCountType extends ResponseType {
  result?: LoginCount
}

export interface LoginCount {
    emailId: string
    key: string
    value: string
}

export interface AppRouterType {
  isSuperAdmin?: boolean
  appListCount: number
  loginCount: number
}

export interface ConfigOverrideWorkflowDetails {
    cdPipelines: string[]
    ciPipelineId: number
    ciPipelineName: string
    id: number
    name: string
}


export interface ConfigOverrideWorkflowDetailsResponse extends ResponseType {
    result?: {
        workflows: ConfigOverrideWorkflowDetails[]
    }
}