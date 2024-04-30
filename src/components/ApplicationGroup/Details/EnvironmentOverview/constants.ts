export const BIO_MAX_LENGTH = 40
export const BIO_MAX_LENGTH_ERROR = `Max ${BIO_MAX_LENGTH} characters allowed`

export enum APP_DETAILS_TEXT {
    ALL = 'All',
    APP_NAME = 'app-name',
    APP_GROUP_RESTART_WORKLOAD_SUBTITLE = 'It might take some time depending upon the number of applications',
    APP_GROUP_INFO_TEXT = 'Pods for selected workloads will be restarted. Configured deployment strategies will be used to restart workloads.',
    APPLICATIONS = 'APPLICATIONS',
    EXPAND_ALL = 'Expand all',
    KIND_NAME = 'kind-name',
    MESSAGE = 'MESSAGE',
    RESTART_STATUS = 'RESTART STATUS',
    RESTART_WORKLOAD = 'Restart workloads',
    RETRY_FAILED = 'Retry failed',
}

export const DATA_TEST_IDS = {
    WORKLOAD_RESTART_MODAL: 'workload-restart-modal',
    APP_GROUP_WORKLOAD_RESTART: 'app-group-workload-restart',
    APP_GROUP_WORKLOAD_RESTART_SUBTITLE: 'app-group-workload-restart-subtitle',
    APP_GROUP_WORKLOAD_RESTART_APP_NAME_CHECKBOX: 'app-group-workload-restart-app-name-checkbox',
    APP_GROUP_WORKLOAD_RESTART_KIND_NAME_CHECKBOX: 'app-group-workload-restart-kind-name-checkbox',
    APP_GROUP_WORKLOAD_RESTART_COLLAPSED_DROPDOWN: 'app-group-workload-restart-collapsed-dropdown',
    APP_GROUP_WORKLOAD_RESTART_EXPANDED_DROPDOWN: 'app-group-workload-restart-expanded-dropdown',
    APP_GROUP_WORKLOAD_RESTART_EXPAND_ALL_CHECKBOX: 'app-group-workload-restart-expand-all-checkbox',
    APP_GROUP_WORKLOAD_RESTART_RESTART_DROPDOWN: 'app-group-workload-restart-restart-dropdown',
}

export enum RESTART_STATUS_TEXT {
    FAILED = 'failed',
    INITIATED = 'initiated',
}

export const URL_SEARCH_PARAMS = {
    BULK_RESTART_WORKLOAD: 'bulk-restart-workload',
}
