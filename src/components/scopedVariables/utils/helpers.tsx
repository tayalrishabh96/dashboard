import yaml from 'js-yaml'
import { ValidatorT } from '../types'
import {
    EMPTY_FILE_STATUS,
    FILE_NOT_SUPPORTED_STATUS,
    JSON_PARSE_ERROR_STATUS,
    PARSE_ERROR_STATUS,
    YAML_PARSE_ERROR_STATUS,
} from '../constants'

export const validator: ValidatorT = ({ data, type }) => {
    if (!data) {
        return EMPTY_FILE_STATUS
    }
    switch (type) {
        case 'application/json':
            try {
                const parsedData = JSON.parse(data)
                if (parsedData && typeof parsedData === 'object') {
                    return {
                        status: true,
                        message: {
                            data: yaml.safeDump(parsedData),
                            description: 'File uploaded successfully',
                        },
                    }
                }
                return PARSE_ERROR_STATUS
            } catch (e) {
                return JSON_PARSE_ERROR_STATUS
            }
        case 'application/x-yaml':
        case 'application/yaml':
        case 'text/yaml':
        case 'text/x-yaml':
            try {
                const parsedData = yaml.safeLoad(data)
                if (parsedData && typeof parsedData === 'object') {
                    return {
                        status: true,
                        message: {
                            data: yaml.safeDump(parsedData),
                            description: 'File uploaded successfully',
                        },
                    }
                }
                return PARSE_ERROR_STATUS
            } catch (e) {
                return YAML_PARSE_ERROR_STATUS
            }
        default:
            return FILE_NOT_SUPPORTED_STATUS
    }
}

export const downloadData = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
}