import { ITree, TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsCircularDependencyNode } from "./LogicNodes/FsCircularDependencyNode";
import { FsTreeField } from "../FsTreeField";
import { TFsFieldAny } from "../../../../type.field";
import { AbstractLogicNode } from "./LogicNodes/AbstractLogicNode";
import { FsTreeLogicDeepInternal } from "./FsTreeLogicDeepInternal";
import { TStatusRecord } from "../../../Evaluator/type";

class FsTreeLogicDeep {
  private _fsDeepLogicTree!: FsTreeLogicDeepInternal;

  constructor(rootNodeId?: string, nodeContent?: AbstractLogicNode) {
    this._fsDeepLogicTree = new FsTreeLogicDeepInternal(
      rootNodeId,
      nodeContent
    );
  }

  public appendChildNodeWithContent(
    parentNodeId: string,
    nodeContent: AbstractLogicNode
  ): string {
    return this._fsDeepLogicTree.appendChildNodeWithContent(
      parentNodeId,
      nodeContent
    );
  }

  countTotalNodes() {
    return this._fsDeepLogicTree.countTotalNodes();
  }

  getChildContentAt(
    nodeId: string
  ): AbstractLogicNode | ITree<AbstractLogicNode> | null {
    return this._fsDeepLogicTree.getChildContentAt(nodeId);
  }

  getChildContentByFieldId<T = AbstractLogicNode>(fieldId: string) {
    return this._fsDeepLogicTree.getChildContentByFieldId(fieldId);
  }

  getCircularLogicNodes(): FsCircularDependencyNode[] {
    return this._fsDeepLogicTree.getCircularLogicNodes();
  }

  getDependentFieldIds(): string[] {
    return this._fsDeepLogicTree.getDependantFieldIds();
  }

  isExistInDependencyChain(field: FsTreeField) {
    return this._fsDeepLogicTree.isExistInDependencyChain(field);
  }

  get ownerFieldId() {
    return this._fsDeepLogicTree.ownerFieldId;
  }

  set ownerFieldId(ownerFieldId: string) {
    this._fsDeepLogicTree.ownerFieldId = ownerFieldId;
  }

  get rootNodeId() {
    return this._fsDeepLogicTree.rootNodeId;
  }

  getStatusMessage(dependentChainFieldIds?: string[]): TStatusRecord[] {
    const statusMessages: TStatusRecord[] = [];
    this._fsDeepLogicTree.getTreeContentAt().forEach((logicNode) => {
      if (logicNode instanceof AbstractLogicNode) {
        statusMessages.push(
          ...logicNode.getStatusMessage(
            this.ownerFieldId,
            this.getDependentFieldIds()
          )
        );
      }
    });
    return statusMessages;
  }

  toPojoAt(): TTreePojo<AbstractLogicNode> {
    return this._fsDeepLogicTree.toPojoAt(this._fsDeepLogicTree.rootNodeId);
  }

  static fromFieldJson(fieldJson: TFsFieldAny): FsTreeLogicDeep {
    const internalTree = FsTreeLogicDeepInternal.fromFieldJson(fieldJson);
    const tree = new FsTreeLogicDeep();
    tree._fsDeepLogicTree = internalTree;

    return tree;
  }
}
export { FsTreeLogicDeep };
