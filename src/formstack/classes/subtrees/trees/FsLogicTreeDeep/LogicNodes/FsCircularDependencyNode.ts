import { TNodePojo } from "predicate-tree-advanced-poc/dist/src";
import { AbstractLogicNode } from "./AbstractLogicNode";
import type { TStatusRecord } from "../../../../Evaluator/type";

class FsCircularDependencyNode extends AbstractLogicNode {
  _sourceFieldId: string;
  _targetFieldId: string;
  private _dependentChainFieldIds: string[];

  constructor(
    sourceFieldId: string,
    targetFieldId: string,
    dependentChainFieldIds: string[]
  ) {
    super();
    this._sourceFieldId = sourceFieldId;
    this._targetFieldId = targetFieldId;
    this._dependentChainFieldIds = dependentChainFieldIds;
  }

  getLastVisitedFieldId() {
    return this.dependentChainFieldIds.length >= 1
      ? this.dependentChainFieldIds[this.dependentChainFieldIds.length - 1]
      : -1; // a bit over kill, *should* always be 0 or more elements
  }

  get dependentChainFieldIds() {
    return this._dependentChainFieldIds;
    // return [
    //   this._sourceFieldId,
    //   ...this._dependentChainFieldIds.slice(),
    //   this._targetFieldId,
    // ];
  }

  get sourceFieldId() {
    return this._sourceFieldId;
  }
  get targetFieldId() {
    return this._targetFieldId;
  }

  toPojo(): object {
    return {
      nodeType: this.nodeType,
      sourceFieldId: this.sourceFieldId,
      targetSourceId: this.targetFieldId,
      dependentChainFieldIds: this.dependentChainFieldIds,
    };
  }

  getStatusMessage(
    rootFieldId: string,
    dependentChainFieldIds?: string[]
  ): TStatusRecord[] {
    const dependentsAsString = "'" + dependentChainFieldIds?.join("', '") + "'";
    const message = `Logic: circular reference. root field: ${rootFieldId}, attempted fieldId: '${this.targetFieldId}', dependency chain: "${dependentsAsString}".`;
    return [
      {
        severity: "logic",
        fieldId: this.targetFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      },
      {
        severity: "error", // duplicate message is intentional
        fieldId: this.targetFieldId,
        message,
        relatedFieldIds: dependentChainFieldIds,
      },
    ];
  }

  static fromPojo(
    nodePojo: TNodePojo<AbstractLogicNode>
  ): FsCircularDependencyNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode;
  static fromPojo(nodePojo: TNodePojo<AbstractLogicNode>): AbstractLogicNode {
    const { nodeContent } = nodePojo;
    const { sourceFieldId, targetFieldId, dependentChainFieldIds } =
      nodeContent as FsCircularDependencyNode; // using type information, this will never be an instance
    return new FsCircularDependencyNode(
      sourceFieldId,
      targetFieldId,
      dependentChainFieldIds
    );
  }
}
export { FsCircularDependencyNode };
