import { getAppListMin, getAppOtherEnvironment } from '../../services/service';
import { ArgumentType, SuggestedArgumentType } from './Command';

export const COMMAND = {
    APPLICATIONS: 'app',
    CHART: 'chart',
    DOCUMENTATION: 'docs',
    DEPLOYMENT_GROUP: 'deployment-group',
    SECURITY: 'security',
    GLOBAL_CONFIG: 'global-config'
}

export function getArgumentSuggestions(args): Promise<any> {
    if (args.length === 0) return new Promise((resolve, reject) => {
        resolve([{ value: COMMAND.APPLICATIONS, ref: undefined, data: { isValid: true, isClearable: true, isEOC: false } },
        { value: COMMAND.CHART, ref: undefined, data: { isValid: true, isClearable: true, isEOC: false } },
        { value: COMMAND.DOCUMENTATION, ref: undefined, data: { isValid: true, isClearable: true, isEOC: false } },
        { value: COMMAND.DEPLOYMENT_GROUP, ref: undefined, data: { isValid: true, isClearable: true, isEOC: false } },
        { value: COMMAND.SECURITY, ref: undefined, data: { isValid: true, isClearable: true, isEOC: false } },
        { value: COMMAND.GLOBAL_CONFIG, ref: undefined, data: { isValid: true, isClearable: true, isEOC: false } }])
    });

    let arg = args[0];
    switch (arg.value) {
        case 'app': return getAppArguments(args);
        case 'chart': return getChartArguments(args);

        default: return new Promise((resolve, reject) => {
            resolve([])
        });
    }
}

function getAppArguments(args): Promise<SuggestedArgumentType[]> {
    //["app", "appName", "envName", "pod", "podname"]
    if (args.length === 1) {
        return getAppListMin().then((response) => {
            let list = response.result.map((a) => {
                return {
                    value: a.name,
                    ref: undefined,
                    data: {
                        value: a.id,
                        kind: 'appId',
                        isValid: true,
                        url: `/app/${a.id}/details`,
                        isClearable: true,
                        isEOC: false,
                    }
                }
            })
            return list;
        })
    }
    else if (args[1] && args.length === 2) { // args[1] --> appName
        return getAppOtherEnvironment(args[1].data.value).then((response) => {
            let list;
            list = response?.result?.map((a) => {
                return {
                    value: a.environmentName,
                    ref: undefined,
                    data: {
                        value: a.environmentId,
                        kind: 'envId',
                        isValid: true,
                        url: `/app/${args[1].data.value}/details/${a.environmentId}/Pod`,
                        isClearable: true,
                        isEOC: false,
                    }
                }
            });
            if (!list) list = [];
            list.push({
                value: 'config',
                ref: undefined,
                data: {
                    isValid: true,
                    url: `/app/${args[1].data.value}/edit/workflow`,
                    isClearable: true,
                    isEOC: false
                }
            })
            return list;
        })
    }
    else if (args[2] && args.length === 3) { // args[2] --> envName/config
        if (args[2].value === 'config') return new Promise((resolve, reject) => {
            resolve([
                {
                    value: 'git-material',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/materials`,
                        isValid: true,
                        isClearable: true,
                        isEOC: true
                    },
                },
                {
                    value: 'docker-config',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/docker-build-config`,
                        isClearable: true,
                        isValid: true,
                        isEOC: true
                    }
                },
                {
                    value: 'deployment-template',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/deployment-template`,
                        isClearable: true,
                        isValid: true,
                        isEOC: true
                    }
                },
                {
                    value: 'workflow-editor',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/workflow`,
                        isClearable: true,
                        isValid: true,
                        isEOC: true
                    }
                },
                {
                    value: 'configmap',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/configmap`,
                        isClearable: true,
                        isValid: true,
                        isEOC: true
                    }
                },
                {
                    value: 'secrets',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/secrets`,
                        isClearable: true,
                        isValid: true,
                        isEOC: true
                    }
                },
                {
                    value: 'env-override',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/edit/env-override`,
                        isClearable: true,
                        isValid: true,
                        isEOC: false
                    }
                }
            ])
        })
        else return new Promise((resolve, reject) => {
            resolve([
                //     {
                //     value: 'app-details',
                //      
                //     ref: undefined,
                //     data: {
                //         url: `/app/${args[1].data.value}/details/${args[2].data.value}/Pod`,
                //         isValid: true,
                //         isClearable: true,
                //         isEOC: false
                //     }
                // },
                {
                    value: 'trigger',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/trigger`,
                        isValid: true,
                        isClearable: true,
                        isEOC: true
                    }
                },
                {
                    value: 'build-history',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/ci-details`,
                        isValid: true,
                        isClearable: true,
                        isEOC: false
                    }
                },
                {
                    value: 'deployment-history',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/cd-details`,
                        isValid: true,
                        isClearable: true,
                        isEOC: false
                    }
                },
                {
                    value: 'deployment-metrics',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/deployment-metrics`,
                        isValid: true,
                        isClearable: true,
                        isEOC: false
                    }
                },
                {
                    value: 'test-report',
                    ref: undefined,
                    data: {
                        url: `/app/${args[1].data.value}/test`,
                        isValid: true,
                        isClearable: true,
                        isEOC: false
                    }
                },
            ])
        })
    }
    else if (args[3] && args.length === 4) { // args[3] --> pod
        if (args[3].value === 'pod') return new Promise((resolve, reject) => {
            resolve([{
                value: 'blobs-dev1-fdfc6b54-prglm',
                ref: undefined,
                data: {
                    value: 'blobs-dev1-fdfc6b54-prglm',
                    url: `/app/${args[1].data.value}/details/${args[2].data.value}/Pod/EVENTS?kind=Pod`,
                    isValid: true,
                    isClearable: true,
                    isEOC: true
                }
            },
            {
                value: 'blobs-dev1-fdfc6b54-pvphj',
                ref: undefined,
                data: {
                    value: 'blobs-dev1-fdfc6b54-pvphj',
                    url: `/app/${args[1].data.value}/details/${args[2].data.value}/Pod/EVENTS?kind=Pod`,
                    isValid: true,
                    isClearable: true,
                    isEOC: true,
                }
            },
            ])
        })
    }
    return new Promise((resolve, reject) => {
        resolve([])
    })
}


function getChartArguments(args): Promise<any> {
    args = args.filter(arg => arg.value !== "/");
    if (args.length === 1) {
        return new Promise((resolve, reject) => {
            resolve([
                {
                    value: 'discover',
                    data: {
                        isValid: true,
                        isClearable: true,
                        isEOC: false,
                    }
                },
                {
                    value: 'deployed',
                    data: {
                        isValid: true,
                        isClearable: true,
                        isEOC: false,
                    }
                },
            ])
        });
    }
    return new Promise((resolve, reject) => {
        resolve([])
    });
}