import {
  TFsFieldLogicJunction,
  TFsJunctionOperators,
} from "../classes/subtrees/types";
import { TFsFieldAnyJson } from "../classes/types";
import { TFsFieldAny } from "../type.field";
import { TFsFieldLogicJunctionFromJson } from "./TFsFieldLogicJunctionFromJson";

const TFsFieldAnyFromJson = (fieldJson: TFsFieldAnyJson): TFsFieldAny => {
  const logic =
    fieldJson.logic === null
      ? null
      : TFsFieldLogicJunctionFromJson(
          // @ts-ignore - this is part of a larger issue (any/all, $or/$and)
          fieldJson.logic as TFsFieldLogicJunction<TFsJunctionOperators>,
          fieldJson.id || "_MISSING_ID_" // or throw?
        );

  // @ts-ignore - this is part of a larger issue (any/all, $or/$and)
  return { ...{ logic }, ...(fieldJson as TFsFieldAny) };
};

export { TFsFieldAnyFromJson };

// type TFsBaseFieldType = {
//     id: string;
//     label: string;
//     hide_label: boolean;
//     description: string;
//     name: string;
//     type: TFsFieldType;
//     options?:
//       | null
//       | string
//       | {
//           label: string;
//           value: string;
//         }[];
//     required: boolean;
//     uniq: boolean;
//     hidden: boolean;
//     readonly: boolean;
//     colspan: number;
//     sort: number; //  something like field-on-form order
//     logic: TFsFieldLogicJunction; // ?
//     calculation: null | string; // ?  probably never an object
//     // calculation: null | object; // ?  not sure of the shape
//     workflow_access: "write"; //  what other possibilities
//     default: string | object; // matrix use options array
//   };
