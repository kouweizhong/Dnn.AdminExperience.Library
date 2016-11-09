import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SocialPanelBody from "dnn-social-panel-body";
import GridCell from "dnn-grid-cell";
import LanguageInfoView from "./languageInfoView";
import { visiblePanel as VisiblePanelActions, languageEditor as LanguageEditorActions } from "actions";
import resx from "resources";
import ResourceList from "./resourceList";
import utilities from "utils";
import "./style.less";

function alreadyAChildTerm(childFolders, compareValue) {
    return childFolders.find((cf) => {
        console.log(cf, compareValue);
        return cf.Value === compareValue;
    });
}

function findParent(parentList, item) {
    if (!parentList || !item) {
        return;
    }
    let compareValue = item.Value.substring(0, item.Value.lastIndexOf("/"));
    parentList.forEach(function (listItem) {
        if (!listItem.ChildFolders) {
            listItem.ChildFolders = [];
        }
        if (listItem.Value === compareValue && !alreadyAChildTerm(listItem.ChildFolders, compareValue)) {
            listItem.ChildFolders.push(item);
        } else {
            findParent(listItem.ChildFolders, item);
        }
    });
}

function generateList(list, isGlobalMode) {
    let _list = [];
    if (!list) {
        return;
    }
    utilities.utilities.getObjectCopy(list).forEach(function (item, index) {
        let splitValue = item.Value.split("/");
        if (splitValue.length === 1 || isGlobalMode) {
            _list.push(item);
        } else {
            findParent(_list, item);
        }
    });
    return _list;
}

class EditLanguagePanel extends Component {
    constructor() {
        super();
        this.state = {
            selectedMode: "Host"
        };
    }
    refreshFileList() {
        this.props.dispatch(LanguageEditorActions.getRootResourcesFolder(this.state.selectedMode));
    }
    componentWillMount() {
        this.refreshFileList();
    }

    backToSiteSettings() {
        this.props.dispatch(VisiblePanelActions.selectPanel(0));
    }
    getChildFolders(folder, callback) {
        this.props.dispatch(LanguageEditorActions.getSubRootResources(folder, () => {
            if (callback) {
                callback();
            }
        }));
    }
    getResxEntries(resxFile, callback) {
        const { props } = this;
        props.dispatch(LanguageEditorActions.getResxEntries({
            resourceFile: resxFile,
            mode: this.state.selectedMode,
            locale: props.languageBeingEdited.Code
        }, callback));
    }
    onSelectMode(value) {
        this.setState({
            selectedMode: value
        }, () => {
            this.refreshFileList();
        });
    }
    onResxChange(){
        
    }
    /* eslint-disable react/no-danger */
    render() {
        const { props } = this;
        const ModeOptions = [
            {
                label: resx.get("Global"),
                value: "Host"
            },
            {
                label: props.portalName,
                value: "Portal"
            }
        ];
        const { languageBeingEdited } = props;
        return (
            <SocialPanelBody
                className="edit-language-panel"
                workSpaceTrayOutside={true}
                workSpaceTray={<div className="siteSettings-back dnn-grid-cell" onClick={this.backToSiteSettings.bind(this)}>{resx.get("BackToSiteSettings")}</div>}
                workSpaceTrayVisible={true}>
                <LanguageInfoView
                    languageBeingEdited={languageBeingEdited}
                    ModeOptions={ModeOptions}
                    languageFolders={generateList(props.languageFolders.concat(props.languageFiles), this.state.selectedMode === "Host")}
                    languageFiles={props.languageFiles}
                    getResxEntries={this.getResxEntries.bind(this)}
                    getChildFolders={this.getChildFolders.bind(this)}
                    resxBeingEdited={props.resxBeingEdited}
                    resxBeingEditedDisplay={props.resxBeingEditedDisplay}
                    selectedMode={this.state.selectedMode}
                    onSelectMode={this.onSelectMode.bind(this)} 
                    onCancel={this.backToSiteSettings.bind(this)}/>
                <ResourceList list={props.translations} />
            </SocialPanelBody>
        );
    }
}

EditLanguagePanel.propTypes = {
    dispatch: PropTypes.func.isRequired,
    languageFolders: PropTypes.array
};

function mapStateToProps(state) {
    return {
        languageBeingEdited: state.languageEditor.languageBeingEdited,
        portalName: state.siteInfo.settings && state.siteInfo.settings.PortalName,
        languageFolders: state.languageEditor.languageFolders,
        languageFiles: state.languageEditor.languageFiles,
        translations: state.languageEditor.translations,
        resxBeingEdited: state.languageEditor.resxBeingEdited,
        resxBeingEditedDisplay: state.languageEditor.resxBeingEditedDisplay
    };
}
export default connect(mapStateToProps)(EditLanguagePanel);
