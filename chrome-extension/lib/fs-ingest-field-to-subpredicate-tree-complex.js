"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form5350841_json_1 = __importDefault(require("./fs-form/form5350841.json"));
const form5353031_json_1 = __importDefault(require("./fs-form/form5353031.json"));
const src_1 = require("predicate-tree-advanced-poc/dist/src");
const convertFieldRootNode = (field) => {
    // const fieldPojo: TPojoDocument = {};
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
class TestAbstractDirectedGraph extends src_1.AbstractDirectedGraph {
    constructor() {
        super(...arguments);
        this._dependancyFieldIds = [];
    }
    getParentNodeId(nodeId) {
        return super.getParentNodeId(nodeId);
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
    get dependancyFieldIds() {
        return this._dependancyFieldIds.slice();
    }
    getDeepDependancyFieldIds() {
        const allDependancyIds = this._dependancyFieldIds;
        const subtreeIds = this.getSubtreeIdsAt();
        subtreeIds.forEach((subtreeId) => {
            const subtree = this.getChildContentAt(subtreeId);
            allDependancyIds.push(...subtree.dependancyFieldIds);
        });
        return allDependancyIds;
    }
    get rootFieldId() {
        return this._rootFieldId;
    }
    //appendChildNodeWithContent()
    appendChildNodeWithContent(parentNodeId, nodeContent) {
        this._dependancyFieldIds.push(nodeContent.fieldId);
        return super.appendChildNodeWithContent(parentNodeId, nodeContent);
        // can never append root
    }
    isDependancyOf(otherField) {
        const o = otherField.rootFieldId;
        return this._dependancyFieldIds.includes(otherField.rootFieldId);
    }
}
const logicArray = [];
const formTree = new TestAbstractDirectedGraph();
const f0Tree = formTree.createSubtreeAt(formTree.rootNodeId);
f0Tree.replaceNodeContent(f0Tree.rootNodeId, convertFieldRootNode(form5350841_json_1.default.fields[0]));
form5350841_json_1.default.fields[0].logic.checks.forEach((logicTerm) => {
    f0Tree.appendChildNodeWithContent(f0Tree.rootNodeId, convertFieldLogicCheck(logicTerm));
});
const f1Tree = formTree.createSubtreeAt(formTree.rootNodeId);
f1Tree.replaceNodeContent(f1Tree.rootNodeId, convertFieldRootNode(form5350841_json_1.default.fields[1]));
form5350841_json_1.default.fields[1].logic.checks.forEach((logicTerm) => {
    f1Tree.appendChildNodeWithContent(f1Tree.rootNodeId, convertFieldLogicCheck(logicTerm));
});
const subFieldTrees = {};
form5353031_json_1.default.fields.forEach((field) => {
    subFieldTrees[field.id] = formTree.createSubtreeAt(formTree.rootNodeId);
    subFieldTrees[field.id].replaceNodeContent(subFieldTrees[field.id].rootNodeId, convertFieldRootNode(field));
    field.logic.checks.forEach((logicTerm) => {
        subFieldTrees[field.id].appendChildNodeWithContent(subFieldTrees[field.id].rootNodeId, convertFieldLogicCheck(logicTerm));
    });
});
Object.values(subFieldTrees).forEach((subjectField) => {
    Object.values(subFieldTrees).forEach((targetField) => {
        if (subjectField.rootFieldId === targetField.rootFieldId) {
            return; // of course two fields will have identical dependancies
        }
        if (subjectField.isDependancyOf(targetField) &&
            targetField.isDependancyOf(subjectField)) {
            console.log(`fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are interdependant`);
        }
        else if (subjectField.isDependancyOf(targetField)) {
            console.log(`fieldId: ${subjectField.rootFieldId} is a dependancy of ${targetField.rootFieldId}`);
        }
        else if (targetField.isDependancyOf(subjectField)) {
            console.log(`fieldId: ${targetField.rootFieldId} is a dependancy of ${subjectField.rootFieldId}`);
        }
        else {
            console.log(`fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are mutually exclusive`);
        }
    });
});
console.log("Thats all folks");
//# sourceMappingURL=fs-ingest-field-to-subpredicate-tree-complex.js.map