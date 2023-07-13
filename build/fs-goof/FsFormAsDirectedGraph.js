"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsFormAsDirectedGraph = void 0;
const src_1 = require("predicate-tree-advanced-poc/dist/src");
class FsFormAsDirectedGraph extends src_1.AbstractDirectedGraph {
    constructor() {
        super(...arguments);
        this._dependancyFieldIds = [];
        this._childFields = {};
    }
    getParentNodeId(nodeId) {
        return super.getParentNodeId(nodeId);
    }
    getChildFields() {
        return this._childFields;
    }
    getDependencyStatuses() {
        const dependancyStatusList = {};
        Object.values(this.getChildFields()).forEach((subjectField) => {
            dependancyStatusList[subjectField.rootFieldId] = {
                interdependant: [],
                parents: [],
                children: [],
                mutuallyExclusive: [],
            };
            Object.values(this.getChildFields()).forEach((targetField) => {
                if (subjectField.rootFieldId === targetField.rootFieldId) {
                    return;
                }
                if (subjectField.isDependancyOf(targetField) &&
                    targetField.isDependancyOf(subjectField)) {
                    dependancyStatusList[subjectField.rootFieldId].interdependant.push(targetField.rootFieldId);
                }
                if (subjectField.isDependancyOf(targetField)) {
                    dependancyStatusList[subjectField.rootFieldId].parents.push(targetField.rootFieldId);
                }
                if (targetField.isDependancyOf(subjectField)) {
                    dependancyStatusList[subjectField.rootFieldId].children.push(targetField.rootFieldId);
                }
                if (!subjectField.isDependancyOf(targetField) &&
                    !targetField.isDependancyOf(subjectField)) {
                    dependancyStatusList[subjectField.rootFieldId].mutuallyExclusive.push(targetField.rootFieldId);
                }
            });
        });
        return dependancyStatusList;
    }
    getFieldLogicDependancyList(fieldId) {
        const rootFieldTree = this._childFields[fieldId];
        const dependancies = [];
        // Object.values(subFieldTrees).forEach((subjectField) => {
        Object.values(this._childFields).forEach((depencyField) => {
            if (rootFieldTree.rootFieldId === depencyField.rootFieldId) {
                return; // of course two fields will have identical dependancies
            }
            if (depencyField.isDependancyOf(rootFieldTree)) {
                const nodeContent = depencyField.getChildContentAt(depencyField.rootNodeId);
                const { label } = nodeContent;
                dependancies.push({ id: depencyField.rootFieldId, label: label || "" });
            }
        });
        return dependancies;
    }
    replaceNodeContent(nodeId, nodeContent) {
        if (nodeId === this.rootNodeId) {
            this._rootFieldId = nodeContent.fieldId;
        }
        else {
            this._dependancyFieldIds.push(nodeContent.fieldId);
        }
        super.replaceNodeContent(nodeId, nodeContent);
    }
    getDependancyFieldIds() {
        return this._dependancyFieldIds.slice();
    }
    getDeepDependancyFieldIds() {
        const allDependancyIds = this._dependancyFieldIds;
        const subtreeIds = this.getSubtreeIdsAt();
        subtreeIds.forEach((subtreeId) => {
            const subtree = this.getChildContentAt(subtreeId);
            allDependancyIds.push(...subtree.getDependancyFieldIds());
        });
        return allDependancyIds;
    }
    get rootFieldId() {
        return this._rootFieldId;
    }
    appendChildNodeWithContent(parentNodeId, nodeContent) {
        this._dependancyFieldIds.push(nodeContent.fieldId);
        return super.appendChildNodeWithContent(parentNodeId, nodeContent);
    }
    isDependancyOf(otherField) {
        const o = otherField.rootFieldId;
        return this._dependancyFieldIds.includes(otherField.rootFieldId);
    }
    static fromFormJson(formJson) {
        const formTree = new FsFormAsDirectedGraph();
        formJson.fields.forEach((field) => {
            formTree._childFields[field.id] =
                formTree.createSubtreeAt(formTree.rootNodeId);
            formTree._childFields[field.id].replaceNodeContent(formTree._childFields[field.id].rootNodeId, convertFieldRootNode(field));
            field.logic.checks.forEach((logicTerm) => {
                formTree._childFields[field.id].appendChildNodeWithContent(formTree._childFields[field.id].rootNodeId, convertFieldLogicCheck(logicTerm));
            });
        });
        return formTree;
    }
}
exports.FsFormAsDirectedGraph = FsFormAsDirectedGraph;
const convertFieldRootNode = (field) => {
    const fieldId = field.id;
    const logic = field.logic;
    const { action, conditional } = logic;
    return {
        isRoot: true,
        subjectId: fieldId,
        fieldId,
        action,
        conditional,
        rootFieldId: fieldId,
        label: field.label,
    };
};
const convertFieldLogicCheck = (check) => {
    const { field, condition, option } = check;
    return {
        isRoot: false,
        fieldId: field,
        condition,
        option,
    };
};
//# sourceMappingURL=FsFormAsDirectedGraph.js.map