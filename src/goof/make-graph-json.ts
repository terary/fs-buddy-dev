import fs from "fs";
import { TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsFormModel } from "../formstack";
import { AbstractLogicNode } from "../formstack/classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/AbstractLogicNode";
import { transformers } from "../formstack/transformers";

import formJson5375703 from "../../src/test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../src/test-dev-resources/form-json/5469299.json";

import { TApiFormJson } from "../formstack/type.form";
type TGraphNode = {
  nodeId: string;
  parentId: string;
  nodeContent: {
    fieldId: string;
    nodeId: string;
    label: string;
    nodeType: keyof AbstractLogicNode;
  };
};

const main = () => {
  const tree5469299 = FsFormModel.fromApiFormJson(
    transformers.formJson(formJson5469299 as unknown as TApiFormJson)
  );

  const tree5375703 = FsFormModel.fromApiFormJson(
    transformers.formJson(formJson5375703 as unknown as TApiFormJson)
  );
  const agTree148509465 = tree5375703.aggregateLogicTree("148509465");
  const p = agTree148509465.toPojoAt(undefined, false);
  const d3Map148509465 = transformers.pojoToD3TableData(
    agTree148509465.toPojoAt(undefined, false),
    tree5375703
  );

  const fields = {};
  // @ts-ignore
  const fieldMapping = d3Map148509465.map((d3MapGraphNode) => {
    const parentNode = agTree148509465.getChildContentAt(
      d3MapGraphNode.parentId
    );

    const parentId = !parentNode
      ? ""
      : // @ts-ignore
        parentNode.fieldId || parentNode.ownerFieldId;

    return {
      nodeId: d3MapGraphNode.nodeContent.fieldId,
      parentId,
      nodeContent: d3MapGraphNode,
    };
  });

  const agTree154328261 = tree5375703.aggregateLogicTree("154328261"); // B.0 (no internal logic)

  const agTree148604161 = tree5375703.aggregateLogicTree("148604161"); // (A) Big Dipper A->B->C->D->(B ^ E)
  const d3Map148604161 = transformers.pojoToD3TableData(
    agTree148604161.toPojoAt(undefined, false),
    tree5375703
  );

  const agTree154328256 = tree5375703.aggregateLogicTree("154328256"); // section Inter-dependent (not so much circular) no internal logic
  const d3Map154328256 = transformers.pojoToD3TableData(
    agTree148604161.toPojoAt(undefined, false),
    tree5375703
  );
  const logicTreeGraphJson = {};

  [
    "148604161", // (A) Big Dipper A->B->C->D->(B ^ E)
    "148509475", // B.0 (inter-dependent)
    "154328261", // B.0 (no internal logic)
    "148509465", // (panel) Inter-dependent (not so much circular)
    "148604236", // (B) Big Dipper A->B->C->D->(B ^ E)
    "148509470", // A Inter-dependent (not so much circular)
    "154328256", // Inter-dependent (not so much circular) no internal logic
    "148456742", // (B) A->B->C-D->E->A (logic)
  ].forEach((fieldId) => {
    const agTree = tree5375703.aggregateLogicTree(fieldId); // (B) Big Dipper A->B->C->D->(B ^ E)

    // // @ts-ignore
    // logicTreeGraphJson[fieldId] = transformers.pojoToD3TableData(
    //   agTree.toPojoAt(undefined, false),
    //   tree5375703
    // );

    // // const agTree = tree5469299.aggregateLogicTree(fieldId); // (B) Big Dipper A->B->C->D->(B ^ E)

    // @ts-ignore
    logicTreeGraphJson[fieldId] = {
      label: tree5375703.getFieldModel(fieldId)?.label,
      graphMapping: transformers.pojoToD3TableData(
        agTree.toPojoAt(undefined, false),
        tree5375703
      ),
    };
  });

  [
    "152290553", //  "A" - Inter-dependent (fixed with 'any')
    "153413615", // Short Answer (non-conflict with 'any')
    "152293116", // Mutually Exclusive
    "152297010", // Mutually Inclusive
    "152290548", // (D) A->B->C-D->E->A (logic)
    "152586428", // Non conflict - short answer
    "152290549", // (E) A->B->C-D->E->A (logic)
    "152290546", // (B) A->B->C-D->E->A (logic)
    // "148509470", // A Inter-dependent (not so much circular)
    // "148456742", // (B) A->B->C-D->E->A (logic)
  ].forEach((fieldId) => {
    const agTree = tree5469299.aggregateLogicTree(fieldId); // (B) Big Dipper A->B->C->D->(B ^ E)

    // @ts-ignore
    logicTreeGraphJson[fieldId] = {
      label: tree5469299.getFieldModel(fieldId)?.label,
      graphMapping: transformers.pojoToD3TableData(
        agTree.toPojoAt(undefined, false),
        tree5469299
      ),
    };
  });

  const graphJson = {
    version: new Date().toISOString(),
    logicTrees: logicTreeGraphJson,
  };
  console.log(graphJson);
  //   const filename = "../../plot-network-graph/graph.json";
  const filename = "./plot-network-graph/graph.json";
  fs.appendFileSync(filename, JSON.stringify(graphJson), { flag: "w" });
  console.log(`${filename} written.`);
};

main();
