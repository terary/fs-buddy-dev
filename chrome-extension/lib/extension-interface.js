// "use strict";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//     return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.treeUtilities = void 0;
// const form5353031_json_1 = __importDefault(require("./fs-form/form5353031.json"));
// const FsFormAsDirectedGraph_1 = require("./FsFormAsDirectedGraph");
// const formTree = FsFormAsDirectedGraph_1.FsFormAsDirectedGraph.fromFormJson(form5353031_json_1.default);
// // type TFieldDependcyStatus =
// //   | "interdependant"
// //   | "mutually-exclusive"
// //   | "dependant";
// // type TFieldDependcyStatusList = {
// //   [K in TFieldDependcyStatus]?: string[];
// // };
// // type TFieldDepnencyList = { [fieldId: string]: TFieldDependcyStatusList[] };
// // type TFieldList = {
// //   [fieldId: string]: {
// //     [status: string]: TFieldDependcyStatusList[];
// //   };
// // };
// const subFieldTrees = formTree.getChildFields();
// Object.values(subFieldTrees).forEach((subjectField) => {
//     Object.values(subFieldTrees).forEach((targetField) => {
//         if (subjectField.rootFieldId === targetField.rootFieldId) {
//             return; // of course two fields will have identical dependancies
//         }
//         if (subjectField.isDependancyOf(targetField) &&
//             targetField.isDependancyOf(subjectField)) {
//             console.log(`fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are interdependant`);
//         }
//         else if (subjectField.isDependancyOf(targetField)) {
//             console.log(`fieldId: ${subjectField.rootFieldId} is a dependancy of ${targetField.rootFieldId}`);
//         }
//         else if (targetField.isDependancyOf(subjectField)) {
//             console.log(`fieldId: ${targetField.rootFieldId} is a dependancy of ${subjectField.rootFieldId}`);
//         }
//         else {
//             console.log(`fieldId: ${subjectField.rootFieldId} and fieldId: ${targetField.rootFieldId} are mutually exclusive`);
//         }
//     });
// });
// // type TFieldDependcyStatus =
// //   | "interdependant"
// //   | "mutually-exclusive"
// //   | "dependant";
// // type TFieldDependcyStatusList = {
// //   [K in TFieldDependcyStatus]?: string[];
// // };
// const getDependacyStatuses = (tree) => {
//     const dependancyStatusList = {};
//     Object.values(tree.getChildFields()).forEach((subjectField) => {
//         dependancyStatusList[subjectField.rootFieldId] = {
//             interdependant: [],
//             parents: [],
//             children: [],
//             mutuallyExclusive: [],
//         };
//         Object.values(tree.getChildFields()).forEach((targetField) => {
//             if (subjectField.rootFieldId === targetField.rootFieldId) {
//                 return;
//             }
//             if (subjectField.isDependancyOf(targetField) &&
//                 targetField.isDependancyOf(subjectField)) {
//                 dependancyStatusList[subjectField.rootFieldId].interdependant.push(targetField.rootFieldId);
//             }
//             if (subjectField.isDependancyOf(targetField)) {
//                 dependancyStatusList[subjectField.rootFieldId].parents.push(targetField.rootFieldId);
//             }
//             if (targetField.isDependancyOf(subjectField)) {
//                 dependancyStatusList[subjectField.rootFieldId].children.push(targetField.rootFieldId);
//             }
//             if (!subjectField.isDependancyOf(targetField) &&
//                 !targetField.isDependancyOf(subjectField)) {
//                 dependancyStatusList[subjectField.rootFieldId].mutuallyExclusive.push(targetField.rootFieldId);
//             }
//         });
//     });
//     return dependancyStatusList;
// };
// const getDependacyList = (tree) => {
//     const theList = {};
//     console.log(theList);
//     Object.values(tree.getChildFields()).forEach((field) => {
//         theList[field.rootFieldId] = field.getDependancyFieldIds();
//     });
//     return theList;
// };
// const treeUtilities = (treeJson) => {
//     const formTree = FsFormAsDirectedGraph_1.FsFormAsDirectedGraph.fromFormJson(treeJson);
//     return {
//         getDependacyList: getDependacyList(formTree),
//         // fieldHasDependancy: formTree.getFieldLogicDependancyList("147462595"),
//     };
// };
// exports = {};
// exports.treeUtilities = treeUtilities;
// //# sourceMappingURL=extension-interface.js.map
const treeExtensionInterface = {
    sayHello: ()=>console.log('hello'),
    treeFromJson: (json)=>{
        console.log('tree from json')
    }


}