import { FormAnalytics } from "./FormAnalytics";
import formJson5456371 from "../test-dev-resources/form-json/5456371.json";
import workflowJson5456833 from "../test-dev-resources/form-json/5456833.json";
import { transformers as jsonTransformers } from "../formstack/transformers";
import { TApiForm, TApiFormJson } from "../formstack/type.form";
import { RadioEvaluator } from "../formstack/classes/Evaluator/RadioEvaluator";

describe("FormAnalytics", () => {
  describe(".getLabelsWithAssociatedFieldIds()", () => {
    it("Should return an TSimpleDictionary<string[]> where label is key and an array fieldIds.", () => {
      const formAnalytic = new FormAnalytics(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );

      expect(formAnalytic.getLabelsWithAssociatedFieldIds()).toStrictEqual({
        "Duplicate Label Thrice": ["151757114", "151757116", "151757119"],
        _NO_LABEL_FOUND_text: ["151757196"],
        "One Option": ["151757231"],
        "Empty Option": ["151757248"],
        "No Options": ["151757283"],
      });
    });
  });
  describe(".findKnownSetupIssues()", () => {
    it("Should return messages for all known form issues.", () => {
      const formAnalytic = new FormAnalytics(
        jsonTransformers.formJson(formJson5456371 as unknown as TApiFormJson)
      );
      const x = formAnalytic.findKnownSetupIssues();
      expect(x).toStrictEqual([
        {
          severity: "info",
          fieldId: null,
          message: 'Form/Workflow type: "form".',
          relatedFieldIds: [],
        },
        {
          severity: "info",
          fieldId: null,
          message: "Total Fields: 7.",
          relatedFieldIds: [],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757114","condition":"condition","option":"option"}',
          fieldId: "151757114",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757114",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757116","condition":"condition","option":"option"}',
          fieldId: "151757116",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757116",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757119","condition":"condition","option":"option"}',
          fieldId: "151757119",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757119",
        },
        {
          severity: "info",
          fieldId: "151757196",
          message: "No label for type: 'text', fieldId: '151757196'.",
          relatedFieldIds: [],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757196","condition":"condition","option":"option"}',
          fieldId: "151757196",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757196",
        },
        {
          severity: "warn",
          fieldId: "151757231",
          message: "Select options have 1 options.",
          relatedFieldIds: [],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757231","condition":"condition","option":"option"}',
          fieldId: "151757231",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757231",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757248","condition":"condition","option":"option"}',
          fieldId: "151757248",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757248",
        },
        {
          severity: "warn",
          fieldId: "151757283",
          message: "Select options have 0 options.",
          relatedFieldIds: [],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151757283","condition":"condition","option":"option"}',
          fieldId: "151757283",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151757283",
        },
        {
          severity: "warn",
          fieldId: null,
          message: 'label: "Duplicate Label Thrice" is used 3 times.',
          relatedFieldIds: ["151757114", "151757116", "151757119"],
        },
      ]);
    });
    it("Should return messages for all known form issues.", () => {
      //TApiFormFromJson

      const formAnalytic = new FormAnalytics(
        jsonTransformers.formJson(
          workflowJson5456833 as unknown as TApiFormJson
        )
      );
      const x = formAnalytic.findKnownSetupIssues();
      expect(x).toStrictEqual([
        {
          severity: "info",
          fieldId: null,
          message: 'Form/Workflow type: "workflow".',
          relatedFieldIds: [],
        },
        {
          severity: "info",
          fieldId: null,
          message: "Total Fields: 9.",
          relatedFieldIds: [],
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773730","condition":"condition","option":"option"}',
          fieldId: "151773730",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773730",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773737","condition":"condition","option":"option"}',
          fieldId: "151773737",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773737",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773741","condition":"condition","option":"option"}',
          fieldId: "151773741",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773741",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773733","condition":"condition","option":"option"}',
          fieldId: "151773733",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773733",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773738","condition":"condition","option":"option"}',
          fieldId: "151773738",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773738",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773756","condition":"condition","option":"option"}',
          fieldId: "151773756",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773756",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773732","condition":"condition","option":"option"}',
          fieldId: "151773732",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773732",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773739","condition":"condition","option":"option"}',
          fieldId: "151773739",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773739",
        },
        {
          severity: "debug",
          message:
            '{"nodeType":"FsLogicLeafNode","english":"Logic Term: this field \'condition\' \'option\'","fieldId":"151773757","condition":"condition","option":"option"}',
          fieldId: "151773757",
        },
        {
          severity: "logic",
          message:
            "logic: value of this field: 'condition' is  'option' (parent: fieldId: undefined junction: 'undefined')",
          fieldId: "151773757",
        },
        {
          severity: "warn",
          fieldId: null,
          message: 'label: "The Section Heading" is used 3 times.',
          relatedFieldIds: ["151773730", "151773733", "151773732"],
        },
        {
          severity: "warn",
          fieldId: null,
          message: 'label: "Short Answer" is used 3 times.',
          relatedFieldIds: ["151773737", "151773738", "151773739"],
        },
      ]);
    });
  });
});
