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

import { useEffect, useState } from 'react'
import { generatePath, useLocation, useRouteMatch } from 'react-router-dom'

import { GenericEmptyState, Progressing, noop, useAsync } from '@devtron-labs/devtron-fe-common-lib'

import { importComponentFromFELibrary } from '@Components/common'
import { getEnvConfig } from '@Pages/Applications/DevtronApps/service'
import EnvironmentOverride from '@Pages/Shared/EnvironmentOverride/EnvironmentOverride'
import { ENV_CONFIG_PATH_REG } from '@Pages/Applications/DevtronApps/Details/AppConfigurations/AppConfig.constants'

import { getConfigAppList } from '../../AppGroup.service'
import { AppGroupDetailDefaultType, ConfigAppList } from '../../AppGroup.types'
import ApplicationRoute from './ApplicationRoutes'

const getEnvConfigProtections = importComponentFromFELibrary('getEnvConfigProtections', null, 'function')

const EnvConfig = ({ filteredAppIds, envName }: AppGroupDetailDefaultType) => {
    // HOOKS
    const {
        path,
        params: { appId, envId },
    } = useRouteMatch<{ envId: string; appId: string }>()
    const { pathname } = useLocation()

    // STATES
    const [envAppList, setEnvAppList] = useState<ConfigAppList[]>([])

    // ASYNC CALLS
    const [loading, initDataResults] = useAsync(
        () =>
            Promise.allSettled([
                getConfigAppList(+envId, filteredAppIds),
                typeof getEnvConfigProtections === 'function'
                    ? getEnvConfigProtections(Number(envId))
                    : { result: null },
            ]),
        [filteredAppIds],
    )
    const [envConfigLoading, envConfigRes, , refetch] = useAsync(
        () => (appId ? getEnvConfig(+appId, +envId) : null),
        [],
    )

    const envConfig = {
        config: envConfigRes,
        isLoading: envConfigLoading,
    }

    useEffect(() => {
        if (
            initDataResults?.[0].status === 'fulfilled' &&
            initDataResults?.[1].status === 'fulfilled' &&
            initDataResults[0].value?.result?.length
        ) {
            const configProtectionMap = initDataResults[1].value?.result ?? {}
            const _appList = initDataResults[0].value.result.map((appData) => ({
                ...appData,
                isProtected: configProtectionMap[appData.id] ?? false,
            }))

            _appList.sort((a, b) => a.name.localeCompare(b.name))
            setEnvAppList(_appList)
        }
    }, [initDataResults])

    if (loading || !envAppList.length) {
        return (
            <div className="loading-state">
                <Progressing pageLoader />
            </div>
        )
    }

    return (
        <div className="env-compose">
            <div className={`env-compose__nav ${pathname.match(ENV_CONFIG_PATH_REG) ? 'env-configurations' : ''}`}>
                <ApplicationRoute key={appId} envAppList={envAppList} envConfig={envConfig} fetchEnvConfig={refetch} />
            </div>
            {appId ? (
                <div className="env-compose__main">
                    <EnvironmentOverride
                        appList={envAppList}
                        environments={[]}
                        reloadEnvironments={noop}
                        envName={envName}
                        envConfig={envConfig}
                        fetchEnvConfig={refetch}
                        onErrorRedirectURL={generatePath(path, { envId })}
                    />
                </div>
            ) : (
                <GenericEmptyState
                    title="Select an application to view & edit its configurations"
                    subTitle="You can view and edit configurations for all applications deployed on this environment"
                />
            )}
        </div>
    )
}

export default EnvConfig
