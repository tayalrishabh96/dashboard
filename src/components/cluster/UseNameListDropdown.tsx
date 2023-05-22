import React from 'react'
import ReactSelect from 'react-select'
import { DropdownIndicator, Option } from '../v2/common/ReactSelect.utils'

export default function UserNameDropDownList({ clusterDetail, selectedUserNameOptions, onChangeUserName }) {
    const handleUserChange = (selectedOption) => {
        onChangeUserName(selectedOption, clusterDetail)
    }

    if (clusterDetail.userInfos.length === 1) {
        return <span className="dc__ellipsis-right">{clusterDetail.userInfos[0].userName}</span>
    } else {
        const userNameOptions = clusterDetail.userInfos.map((user) => {
            return {
                label: user.userName,
                value: user.userName,
                errorInConnecting: user.errorInConnecting,
                config: user.config,
            }
        })

        return (
            <ReactSelect
                classNamePrefix="user_name_dropdown_list"
                options={userNameOptions}
                value={selectedUserNameOptions[clusterDetail.cluster_name]}
                isSearchable={false}
                onChange={handleUserChange}
                components={{
                    IndicatorSeparator: null,
                    DropdownIndicator,
                    Option,
                }}
                styles={{
                    control: (base) => ({
                        ...base,
                        backgroundColor: 'white',
                        border: 'none',
                        boxShadow: 'none',
                        minHeight: '32px',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }),
                    option: (base, state) => ({
                        ...base,
                        color: 'var(--N900)',
                        backgroundColor: state.isFocused ? 'var(--N100)' : 'white',
                    }),
                    menu: (base) => ({
                        ...base,
                        marginTop: '2px',
                        minWidth: '240px',
                        zIndex: 4,
                    }),
                    menuList: (base) => ({
                        ...base,
                        position: 'relative',
                        paddingBottom: 0,
                        paddingTop: 0,
                        maxHeight: '250px',
                        zIndex: 4,
                    }),
                    noOptionsMessage: (base) => ({
                        ...base,
                        color: 'var(--N600)',
                        zIndex: 4,
                    }),
                    dropdownIndicator: (base, state) => ({
                        ...base,
                        color: 'var(--N400)',
                        padding: '0 8px',
                        transition: 'all .2s ease',
                        transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }),
                    valueContainer: (base, state) => ({
                        ...base,
                        padding: 0,
                    }),
                }}
            />
        )
    }
}