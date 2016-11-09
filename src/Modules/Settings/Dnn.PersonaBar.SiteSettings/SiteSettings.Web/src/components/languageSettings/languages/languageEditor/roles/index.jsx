import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import "./style.less";
import resx from "../../../../../resources";
import {
    languages as LanguagesActions
} from "actions";
import RoleRow from "./RoleRow";
import GridCell from "dnn-grid-cell";
import DropDown from "dnn-dropdown";
import styles from "./style.less";

const tableFields = [
    { name: "RoleName", width: 60 },
    { name: "Select", width: 40 }
];

class RolesPanel extends Component {
    constructor() {
        super();

        this.state = {
            defaultRoleGroup: resx.get("AllGroups"),
            groupId: -1
        };
    }

    componentWillMount() {
        const {props, state} = this;
        props.dispatch(LanguagesActions.getRoleGroups(props.portalId));
        props.dispatch(LanguagesActions.getRoles(props.portalId, state.groupId));
    }

    onRoleGroupChanged(group) {
        const {props} = this;
        let {groupId} = this.state;
        groupId = group.value;
        this.setState({
            groupId: groupId
        });
        props.dispatch(LanguagesActions.getRoles(props.portalId, groupId));
    }

    renderHeader() {
        let tableHeaders = tableFields.map((field) => {
            return <GridCell columnSize={field.width} style={{ fontWeight: "bolder" }}>
                {
                    field.name !== "" ?
                        <span>{resx.get(field.name + ".Header")}</span>
                        : <span>&nbsp; </span>
                }
            </GridCell>;
        });
        return <div id="header-row" className="header-row">{tableHeaders}</div>;
    }

    renderedRolesList() {
        const {props} = this;
        let i = 0;
        if (props.rolesList) {
            return props.rolesList.map((role, index) => {
                let id = "row-" + i++;
                return (
                    <RoleRow
                        roleName={role.RoleName}
                        roleId={role.RoleID}
                        index={index}
                        key={"role-" + index}
                        id={id}>
                    </RoleRow>
                );
            });
        }
    }

    getRoleGroupOptions() {
        const {props, state} = this;
        let options = [];
        if (props.roleGroups !== undefined) {
            options = props.roleGroups.map((item) => {
                return {
                    label: item.RoleGroupName, value: item.RoleGroupID
                };
            });
            options.unshift({ label: "<" + resx.get("GlobalRoles") + ">", value: -1 });
            options.unshift({ label: "<" + resx.get("AllRoles") + ">", value: -2 });
        }
        return options;
    }

    render() {
        const {props, state} = this;
        return (
            <div className="language-roles-list-container">
                <div className="translator-sectionTitle">{resx.get("Translators")}</div>
                {this.props.roleGroups &&
                    <div className="group-filter">
                        <DropDown
                            value={this.state.groupId}
                            fixedHeight={200}
                            style={{ width: "auto" }}
                            options={this.getRoleGroupOptions()}
                            withBorder={false}
                            onSelect={this.onRoleGroupChanged.bind(this)}
                            />
                    </div>
                }
                <div className="container">
                    {this.renderHeader()}
                    {this.renderedRolesList()}
                </div>
            </div>
        );
    }
}

RolesPanel.propTypes = {
    dispatch: PropTypes.func.isRequired,
    rolesList: PropTypes.array,
    roleGroups: PropTypes.array
};

function mapStateToProps(state) {
    return {
        roleGroups: state.languages.roleGroups,
        rolesList: state.languages.rolesList
    };
}

export default connect(mapStateToProps)(RolesPanel);