import React, { Component } from 'react'
import Tippy from '@tippyjs/react'
import branch from '../../../../../../assets/icons/misc/branch.svg'
import { CiPipelineSourceConfig } from '../../../../../ciPipeline/CiPipelineSourceConfig'
import { GIT_BRANCH_NOT_CONFIGURED } from '../../../../../../config'

export interface StaticNodeProps {
    x: number
    y: number
    branch: string
    icon: string
    id: string
    url: string
    title: string
    height: number
    width: number
    type: string
    downstreams: string[]
    sourceType: string
    regex?: string
    isRegex?: boolean
    primaryBranchAfterRegex?: string
    handleGoToWorkFlowEditor?: (e?: any) => void
}

export class StaticNode extends Component<StaticNodeProps> {
    renderCardContent() {
        return (
            <div
                className={`workflow-node workflow-node--static ${
                    this.props.branch === GIT_BRANCH_NOT_CONFIGURED ? 'cursor dashed' : ''
                }`}
                onClick={this.props.handleGoToWorkFlowEditor}
            >
                <div className="workflow-node__git-icon mw-16" />
                <div className="workflow-node__title workflow-node__title--static">
                    <span>/{this.props.title}</span>
                    <CiPipelineSourceConfig
                        sourceType={this.props.sourceType}
                        sourceValue={this.props.branch}
                        showTooltip
                        showIcons={this.props.branch !== GIT_BRANCH_NOT_CONFIGURED}
                        regex={this.props.regex}
                        isRegex={this.props.isRegex}
                        primaryBranchAfterRegex={this.props.primaryBranchAfterRegex}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <foreignObject
                className="data-hj-whitelist"
                key={`static-${this.props.id}`}
                x={this.props.x}
                y={this.props.y}
                width={this.props.width}
                height={this.props.height}
                style={{ overflow: 'visible' }}
            >
                {this.renderCardContent()}
            </foreignObject>
        )
    }
}
