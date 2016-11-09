import { languageEditor as ActionTypes } from "../constants/actionTypes";
import utilities from "utils";
function insertRecords(folders, newFolders, clearArray) {
    let newFolderList = !clearArray ? utilities.utilities.getObjectCopy(folders) : [];
    newFolders.forEach((folder) => {
        let alreadyThere = folders.find((_folder) => {
            return _folder.Value === folder.Value;
        });
        if (!alreadyThere) {
            newFolderList.push(folder);
        }
    });
    return newFolderList;
}

export default function languageEditor(state = {
    languageBeingEdited: {},
    languageFiles: [],
    languageFolders: [],
    translations: [],
    resxBeingEdited: "",
    resxBeingEditedDisplay: "",
    resxFormIsDirty: false
}, action) {
    switch (action.type) {
        case ActionTypes.SET_LANGUAGE_BEING_EDITED:
            return { ...state,
                languageBeingEdited: action.payload
            };
        case ActionTypes.RETRIEVED_ROOT_RESOURCES_FOLDER:
            return { ...state,
                languageFolders: insertRecords(state.languageFolders, action.payload.Folders, true),
                languageFiles: insertRecords(state.languageFiles, action.payload.Files, true),
                resxBeingEdited: "",
                resxBeingEditedDisplay: "",
                translations: []
            };
        case ActionTypes.RETRIEVED_SUBROOT_RESOURCES_FOLDER:
            return { ...state,
                languageFolders: insertRecords(state.languageFolders, action.payload.Folders),
                languageFiles: insertRecords(state.languageFiles, action.payload.Files)
            };
        case ActionTypes.RETRIEVED_RESX_ENTRIES:
            return { ...state,
                translations: action.payload.Translations,
                resxBeingEdited: action.payload.resourceFile,
                resxBeingEditedDisplay: action.payload.File
            };
        default:
            return { ...state
            };
    }
}
