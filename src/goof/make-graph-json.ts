import fs from "fs";
import { TTreePojo } from "predicate-tree-advanced-poc/dist/src";
import { FsFormModel } from "../formstack";
import { AbstractLogicNode } from "../formstack/classes/subtrees/trees/FsLogicTreeDeep/LogicNodes/AbstractLogicNode";
import { transformers } from "../formstack/transformers";

import formJson5375703 from "../../src/test-dev-resources/form-json/5375703.json";
import formJson5469299 from "../../src/test-dev-resources/form-json/5469299.json";

import {
  FsCircularDependencyNode,
  FsCircularMutualInclusiveNode,
  FsLogicBranchNode,
  FsLogicLeafNode,
} from "../formstack/classes/subtrees/trees/FsLogicTreeDeep";
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
  const agTree148604161 = tree5375703.aggregateLogicTree("148604161"); // (A) Big Dipper A->B->C->D->(B ^ E)

  const d3Map148604161 = transformers.pojoToD3TableData(
    agTree148604161.toPojoAt(undefined, false),
    tree5375703
  );

  `
      newest version of circular reference is missing source/target stuff, I think?
      Doesn't work see error messages

`;

  const graphJson = {};

  [
    "148604236", // (B) Big Dipper A->B->C->D->(B ^ E)
    "148509470", // A Inter-dependent (not so much circular)
    "148456742", // (B) A->B->C-D->E->A (logic)
  ].forEach((fieldId) => {
    const agTree = tree5375703.aggregateLogicTree(fieldId); // (B) Big Dipper A->B->C->D->(B ^ E)

    // @ts-ignore
    graphJson[fieldId] = transformers.pojoToD3TableData(
      agTree.toPojoAt(undefined, false),
      tree5375703
    );
  });

  [
    // "148604236", // (B) Big Dipper A->B->C->D->(B ^ E)
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
    graphJson[fieldId] = transformers.pojoToD3TableData(
      agTree.toPojoAt(undefined, false),
      tree5469299
    );
  });

  console.log(graphJson);
  //   const filename = "../../plot-network-graph/graph.json";
  const filename = "./plot-network-graph/graph.json";
  fs.appendFileSync(filename, JSON.stringify(graphJson), { flag: "w" });
  console.log(`${filename} written.`);
};

main();
