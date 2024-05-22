import { get, post, put, trash, ResponseType } from '@devtron-labs/devtron-fe-common-lib'
import { Routes } from '../../config'

export function getClusterList(): Promise<any> {
    const URL = `${Routes.CLUSTER}`
    return get(URL)
}

export function getCluster(id: number) {
    const URL = `${Routes.CLUSTER}?id=${id}`
    return get(URL)
}

// export function saveClusters(payload) {
//     const URL = `${Routes.SAVECLUSTER}`
//     return post(URL, payload)
// }

// export function validateCluster(payload) {
//     const URL = `${Routes.VALIDATE}`
//     return post(URL, payload)
// }

// export function saveCluster(request) {
//     const URL = `${Routes.CLUSTER}`
//     return post(URL, request)
// }

// export function updateCluster(request) {
//     const URL = `${Routes.CLUSTER}`
//     return put(URL, request)
// }

// export function deleteCluster(request): Promise<any> {
//     return trash(Routes.CLUSTER, request)
// }

export function retryClusterInstall(id: number, payload): Promise<ResponseType> {
    const URL = `${Routes.CHART_AVAILABLE}/cluster-component/install/${id}`
    return post(URL, payload)
}

export const getEnvironment = (id: number): Promise<any> => {
    const URL = `${Routes.ENVIRONMENT}?id=${id}`
    return get(URL)
}

export const getEnvironmentList = (): Promise<any> => {
    const URL = `${Routes.ENVIRONMENT}`
    return get(URL).then((response) => response)
}
