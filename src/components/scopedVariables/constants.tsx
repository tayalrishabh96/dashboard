export const DEFAULT_TITLE = 'Scoped variables'
export const DEFAULT_DESCRIPTION =
    'Scoped variable is a key-value pair. Value can be scoped and can be used dynamically across devtron.'
export const UPLOAD_DESCRIPTION_L1 = 'Upload file to add'
export const UPLOAD_DESCRIPTION_L2 = '.JSON or .YAML'
export const DOWNLOAD_TEMPLATE = 'Download template'
export const DOWNLOAD_FILE_NAME = 'variables.yaml'
export const DOWNLOAD_TEMPLATE_NAME = 'variables-template.yaml'
export const DOWNLOAD_FILES_AS = 'application/x-yaml'
export const DROPDOWN_ITEMS = ['Download saved file', 'Download template']
export const TABLE_LIST_HEADINGS = ['VARIABLE NAMES', 'DESCRIPTION']

// File Reader error messages
export const FILE_READING_FAILED_STATUS = {
    message: {
        data: null,
        description: 'File reading failed',
    },
    status: false,
}
export const NO_FILE_SELECTED_STATUS = {
    message: {
        data: null,
        description: 'No file selected',
    },
    status: false,
}
export const PARSE_ERROR_STATUS = {
    message: {
        data: null,
        description: 'Parsed Data not valid',
    },
    status: false,
}
export const JSON_PARSE_ERROR_STATUS = {
    message: {
        data: null,
        description: 'Issue while parsing JSON',
    },
    status: false,
}
export const YAML_PARSE_ERROR_STATUS = {
    message: {
        data: null,
        description: 'Issue while parsing YAML',
    },
    status: false,
}
export const FILE_NOT_SUPPORTED_STATUS = {
    message: {
        data: null,
        description: 'File type is not supported',
    },
    status: false,
}
export const EMPTY_FILE_STATUS = {
    message: {
        data: null,
        description: 'File is empty',
    },
    status: false,
}

export const SCOPED_VARIABLES_TEMPLATE_DATA = `apiVersion: devtron.ai/v1beta1
kind: Variable
spec:
  - description: Sample Variable 1
    name: variableNew1
    values:
      - category: ApplicationEnv
        value: test-app-env
        selectors:
          attributeSelectors:
            ApplicationName: dev-test
            EnvName: dev
      - category: Env
        value: 'null'
        selectors:
          attributeSelectors:
            EnvName: dev
      - category: Env
        value: 'null'
        selectors:
          attributeSelectors:
            EnvName: virtual-env-1
      - category: Cluster
        value: test-cluster
        selectors:
          attributeSelectors:
            ClusterName: default_cluster
      - category: Global
        value: test-global
        selectors: null
  - description: 'Sample Variable 2'
    name: variableNew2
    values:
      - category: ApplicationEnv
        value: test-app-env
        selectors:
          attributeSelectors:
            ApplicationName: dev-test
            EnvName: dev
      - category: ApplicationEnv
        value: test-app-env
        selectors:
          attributeSelectors:
            ApplicationName: dev-test
            EnvName: virtual-env-1
      - category: Application
        value: test-app
        selectors:
          attributeSelectors:
            ApplicationName: dev-test
      - category: Env
        value: test-env
        selectors:
          attributeSelectors:
            EnvName: dev
      - category: Cluster
        value: test-cluster
        selectors:
          attributeSelectors:
            ClusterName: default_cluster
      - category: Global
        value: test-global
        selectors: null
`

export const ROUTES = {
    GET_SCOPED_VARIABLES_JSON: 'global/variables/detail',
    SCOPED_VARIABLES: 'global/variables',
}

// TOAST Messages while saving file
export const SAVE_SUCCESS_TOAST_MESSAGE = 'File saved successfully'
export const SAVE_ERROR_TOAST_MESSAGE = 'Error while saving scoped variables'
export const PARSE_ERROR_TOAST_MESSAGE = 'Error while parsing file'
export const GET_SCOPED_VARIABLES_ERROR = 'Error while fetching scoped variables'