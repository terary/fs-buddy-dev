import {
  AbstractExpressionTree,
  IExpressionTree,
} from "predicate-tree-advanced-poc/dist/src";
import { TFsFieldAnyJson } from "../types";
import { FsTreeCalcString } from "./trees/FsTreeCalcString";
import { FsTreeLogic } from "./trees/FsTreeLogic";
import { FsTreeField } from "./trees/FsTreeField";
import { TFsFieldAny } from "../../type.field";
import { FsFieldVisibilityLinkNode } from "./trees/nodes";
import { TFsFieldLogicCheckLeaf, TFsLogicNode } from "./types";
import { FsLogicLeafNode } from "./trees/nodes/FsLogicLeafNode";
import { FsCircularDependencyNode } from "./trees/nodes/FsCircularDependencyNode";
import { FsMaxDepthExceeded } from "./trees/nodes/FsMaxDepthExceeded";
const INCLUDE_SUBTREES = true;
// This tree would actually consist of node types:
//      Junction: '*', '+', '-', ...
//      Leaf: number | [fieldId]
// FsTreeField
// const x:FsTreeField
type TTreeFieldNode = {
  fieldId: string;
  field: FsTreeField;
};
class FieldCollectionGoof extends AbstractExpressionTree<TTreeFieldNode> {
  private _dependantFieldIds: string[] = [];
  private _fieldIdNodeMap: { [fieldId: string]: FsTreeField } = {};
  // types should

  // --
  createSubtreeAt(targetNodeId: string): FieldCollectionGoof {
    const subtree = new FieldCollectionGoof("_subtree_");

    const subtreeParentNodeId = this.appendChildNodeWithContent(
      targetNodeId,
      subtree
    );

    AbstractExpressionTree.reRootTreeAt<TTreeFieldNode>(
      subtree,
      subtree.rootNodeId,
      subtreeParentNodeId
    );
    subtree._rootNodeId = subtreeParentNodeId;
    subtree._incrementor = this._incrementor;

    return subtree;
  }

  getFormFieldsCount() {
    return Object.keys(this._fieldIdNodeMap).length;
  }

  getExtendedTree(exTree: FsTreeLogic, atNodeId: string, field: FsTreeField) {
    // const exTree = new FsTreeLogic("agLogicTree", {
    //   action: "Show",
    //   conditional: "any",
    //   fieldJson: null,
    //   // something: "goes here",
    // });
    // exTree.ownerFieldId = fieldId;

    // this should be called only if it is known fieldId is a branch?
    // should this return leaf or tree?
    // const field = this.getFieldTreeByFieldId(fieldId);
    const logicTree = field?.getLogicTree();
    if (!logicTree) {
      return null;
    }

    const rootNodeContent = logicTree?.getChildContentAt(
      logicTree.rootNodeId
    ) as TFsLogicNode;

    // maybe this should append null?
    const firstChildId = exTree.appendChildNodeWithContent(
      atNodeId,
      rootNodeContent
    );

    logicTree.getChildrenNodeIdsOf(logicTree.rootNodeId).forEach((childId) => {
      const childContent = logicTree.getChildContentAt(
        childId
      ) as TFsFieldLogicCheckLeaf;

      const childFieldId = childContent?.fieldId;

      const childField = this.getFieldTreeByFieldId(
        childFieldId
      ) as FsTreeField;

      if (
        exTree.ownerFieldId === childField.fieldId ||
        exTree._debug_visitedFieldIds.includes(childField.fieldId)
      ) {
        exTree.appendChildNodeWithContent(
          firstChildId,
          new FsCircularDependencyNode(
            exTree.ownerFieldId,
            field.fieldId,
            exTree._debug_visitedFieldIds
          )
        );
      } else if (childField?.isLeaf()) {
        exTree._debug_visitedFieldIds.push(childFieldId);
        const { fieldId, condition, option } = childContent;
        exTree.appendChildNodeWithContent(
          firstChildId,
          new FsLogicLeafNode(fieldId, condition, option)
        );
      } else if (
        exTree.countGreatestDepthOf(exTree.rootNodeId) >
        this.getFormFieldsCount() * 2
      ) {
        exTree._debug_visitedFieldIds.push(childFieldId);
        exTree.appendChildNodeWithContent(
          firstChildId,
          new FsMaxDepthExceeded()
        );
      } else {
        exTree._debug_visitedFieldIds.push(childFieldId);
        this.getExtendedTree(exTree, firstChildId, childField); //(childFieldId)
      }
    });

    return exTree;
  }

  aggregateLogicTree(fieldId: string): FsTreeLogic | null {
    const exTree = new FsTreeLogic("agLogicTree", {
      action: "Show",
      conditional: "any",
      fieldJson: null,
      // something: "goes here",
    });
    exTree.ownerFieldId = fieldId;
    const field = this.getFieldTreeByFieldId(fieldId) as FsTreeField;

    return this.getExtendedTree(exTree, exTree.rootNodeId, field);
  }

  getFieldTreeByFieldId(fieldId: string): FsTreeField | undefined {
    // I wounder if a look-up table wouldn't be better
    //  also you're filtering after map, if possible the other order would be preferred
    return this._fieldIdNodeMap[fieldId];
  }

  evaluateWithValues<T>(values: { [fieldId: string]: any }): T {
    return {} as T;
  }

  getDependantFields(): string[] {
    return this._dependantFieldIds.slice();
  }

  getFieldsBySection(section: FsTreeField) {
    const childrenFieldNodes = this.getChildrenContentOf(
      this.rootNodeId
    ) as TTreeFieldNode[];

    const sectionChildren = childrenFieldNodes
      .filter((fieldNode) => {
        const { fieldId, field } = fieldNode;
        if (fieldId === "148509721") {
          console.log("Here we go");
        }

        const x = field.getVisibilityNode();
        // return x?.parentNode?.fieldId === section.fieldId;

        return Object.is(x?.parentNode, section);
      })
      .map((fieldNode) => fieldNode.field);
    return sectionChildren;
  }

  static fromFieldJson(fieldsJson: TFsFieldAnyJson[]): FieldCollectionGoof {
    const tree = new FieldCollectionGoof("_FORM_ID_");

    (fieldsJson || []).forEach((fieldJson) => {
      const field = FsTreeField.fromFieldJson(fieldJson);
      tree.appendChildNodeWithContent(tree.rootNodeId, {
        fieldId: field.fieldId,
        field,
      });
    });

    //
    tree.getChildrenContentOf(tree.rootNodeId).forEach((childContent) => {
      const { fieldId, field } = childContent as TTreeFieldNode;
      tree._fieldIdNodeMap[fieldId] = field;
    });

    const childrenNodeContent = tree.getChildrenContentOf(
      tree.rootNodeId
    ) as TTreeFieldNode[];

    const sortedNodes = childrenNodeContent.sort(sortBySortProperty);

    let currentSection: FsTreeField | null = null;
    for (let childNode of sortedNodes) {
      // order is necessary
      const { fieldId, field } = childNode;
      const { type: fieldType } = field?.fieldJson as TFsFieldAnyJson;

      if (fieldType && fieldType === "section") {
        currentSection = field;
      } else if (currentSection instanceof FsTreeField) {
        const isUltimatelyVisible = (values: {
          [fieldId: string]: any;
        }): boolean => {
          // @ts-ignore - current section may be null
          return currentSection.evaluateWithValues(values) || false;
        };

        field.appendChildNodeWithContent(
          field.rootNodeId,
          new FsFieldVisibilityLinkNode(isUltimatelyVisible, currentSection)
        );
      }
    }

    return tree;
  }
}
export { FieldCollectionGoof };

const sortBySortProperty = (
  fieldNodeA: TTreeFieldNode,
  fieldNodeB: TTreeFieldNode
) => {
  const fieldAJson = fieldNodeA.field.fieldJson as TFsFieldAnyJson;
  const fieldBJson = fieldNodeB.field.fieldJson as TFsFieldAnyJson;

  if (fieldAJson.sort === undefined || fieldBJson.sort === undefined) {
    return 1;
  }
  const sortA = parseInt(fieldAJson.sort + "");
  const sortB = parseInt(fieldBJson.sort + "");

  if (sortA > sortB) {
    return 1;
  }
  if (sortA < sortB) {
    return -1;
  }
  return 0;
};
