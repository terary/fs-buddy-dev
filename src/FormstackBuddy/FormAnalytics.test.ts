import { FormAnalytics } from "./FormAnalytics";
import formJson5456371 from "../test-dev-resources/form-json/5456371.json";

import formJsonCaseAssist5483176 from "../test-dev-resources/form-json/caseAssist5483176.json";
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
  describe("Case Assist, troubleshooting.", () => {
    //import formJson5488291 from "../test-dev-resources/form-json/5488291.json";
    it.skip("Should have a status message about duplicate labels", () => {
      const formAnalytic = new FormAnalytics(
        jsonTransformers.formJson(
          formJsonCaseAssist5483176 as unknown as TApiFormJson
        )
      );
      const x = formAnalytic.findKnownSetupIssues();
      expect(x).toStrictEqual(statusMessageCaseAssist5483176);
    });
  });
  describe.skip(".findKnownSetupIssues()", () => {
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
          severity: "info",
          fieldId: "151757196",
          message: "No label for type: 'text', fieldId: '151757196'.",
          relatedFieldIds: [],
        },
        {
          severity: "warn",
          fieldId: "151757231",
          message: "Select options have 1 options.",
          relatedFieldIds: [],
        },
        {
          severity: "warn",
          fieldId: "151757283",
          message: "Select options have 0 options.",
          relatedFieldIds: [],
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

const statusMessageCaseAssist5483176 = [
  {
    severity: "info",
    fieldId: null,
    message: 'Form/Workflow type: "workflow".',
    relatedFieldIds: [],
  },
  {
    severity: "info",
    fieldId: null,
    message: "Total Fields: 39.",
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876345",
    message:
      'fieldId: 152876345, type: datetime, json: {"logic":null,"id":"152876345","label":"Date","hide_label":"0","description":"","name":"date","type":"datetime","options":[{"label":"Rebecca","value":"Rebecca","imageUrl":null},{"label":"Julie","value":"Julie","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"1","calculation":"","workflow_access":"write","default":"NOW","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","date_format":"M d, Y","max_date":"","time_format":"","year_minus":5,"year_plus":5}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876346",
    message:
      'fieldId: 152876346, type: select, json: {"logic":null,"id":"152876346","label":"Your Business Consultant","hide_label":"0","description":"","name":"your_business_consultant","type":"select","options":[{"label":"Rebecca.popp@abbvie.com","value":"Rebecca.popp@abbvie.com","imageUrl":null},{"label":"julie.fitzmorris@abbvie.com","value":"julie.fitzmorris@abbvie.com","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"2","sort":"2","calculation":"","workflow_access":"write","default":"","select_size":1,"option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876347",
    message:
      'fieldId: 152876347, type: text, json: {"logic":null,"id":"152876347","label":"Clinic Name","hide_label":"0","description":"","name":"clinic_name","type":"text","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"3","calculation":"","workflow_access":"write","default":"","text_size":50,"minlength":0,"maxlength":0,"placeholder":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_allow_negatives":0,"hide_input_characters":0,"remove_data_from_emails":0,"require_confirmation":0,"confirmationText":"","restrict_data_access":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876348",
    message:
      'fieldId: 152876348, type: name, json: {"logic":null,"id":"152876348","label":"Main contact","hide_label":"0","description":"","name":"main_contact","type":"name","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"4","calculation":"","workflow_access":"write","default":"","show_prefix":0,"show_middle":0,"show_initial":0,"show_suffix":0,"text_size":20,"middle_initial_optional":0,"middle_name_optional":0,"prefix_optional":0,"suffix_optional":0,"visible_subfields":["first","last"]}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876349",
    message:
      'fieldId: 152876349, type: text, json: {"logic":null,"id":"152876349","label":"Position","hide_label":"0","description":"","name":"position","type":"text","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"5","calculation":"","workflow_access":"write","default":"","text_size":50,"minlength":0,"maxlength":0,"placeholder":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_allow_negatives":0,"hide_input_characters":0,"remove_data_from_emails":0,"require_confirmation":0,"confirmationText":"","restrict_data_access":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876350",
    message:
      'fieldId: 152876350, type: address, json: {"logic":null,"id":"152876350","label":"Clinic Address","hide_label":"0","description":"","name":"clinic_address","type":"address","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"6","calculation":"","workflow_access":"write","default":"","text_size":50,"show_country":0,"format":"CA","hide_address":0,"hide_address2":0,"hide_city":0,"hide_state":0,"hide_zip":0,"visible_subfields":["address","address2","city","state","zip"]}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876351",
    message:
      'fieldId: 152876351, type: email, json: {"logic":null,"id":"152876351","label":"Email","hide_label":"0","description":"","name":"email","type":"email","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"7","calculation":"","workflow_access":"write","default":"","text_size":50,"maxlength":0,"confirm":0,"confirmationText":"","placeholder":""}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876352",
    message:
      'fieldId: 152876352, type: phone, json: {"logic":null,"id":"152876352","label":"Phone number","hide_label":"0","description":"","name":"phone_number","type":"phone","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"8","calculation":"","workflow_access":"write","default":"","text_size":2,"format":"US","phone_format":"national","placeholder":""}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876353",
    message:
      'fieldId: 152876353, type: text, json: {"logic":null,"id":"152876353","label":"Website","hide_label":"0","description":"","name":"website","type":"text","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"9","calculation":"","workflow_access":"write","default":"","text_size":50,"minlength":0,"maxlength":0,"placeholder":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_allow_negatives":0,"hide_input_characters":0,"remove_data_from_emails":0,"require_confirmation":0,"confirmationText":"","restrict_data_access":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876354",
    message:
      'fieldId: 152876354, type: text, json: {"logic":null,"id":"152876354","label":"Social Media handles","hide_label":"0","description":"Instagram + Facebook","name":"social_media_handles","type":"text","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"10","calculation":"","workflow_access":"write","default":"","text_size":50,"minlength":0,"maxlength":0,"placeholder":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_allow_negatives":0,"hide_input_characters":0,"remove_data_from_emails":0,"require_confirmation":0,"confirmationText":"","restrict_data_access":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876355",
    message:
      'fieldId: 152876355, type: text, json: {"logic":null,"id":"152876355","label":"List your top 5 procedures","hide_label":"0","description":"Separate each procedure with a coma","name":"list_your_top_5_procedures","type":"text","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"11","calculation":"","workflow_access":"write","default":"","text_size":50,"minlength":0,"maxlength":0,"placeholder":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_allow_negatives":0,"hide_input_characters":0,"remove_data_from_emails":0,"require_confirmation":0,"confirmationText":"","restrict_data_access":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876356",
    message:
      'fieldId: 152876356, type: number, json: {"logic":null,"id":"152876356","label":"When was your clinic established?","hide_label":"0","description":"year","name":"when_was_your_clinic_established","type":"number","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"12","calculation":"","workflow_access":"write","default":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_category":"","calculation_allow_negatives":0,"text_size":5,"min_value":"","max_value":"","currency":"","decimals":"0","slider":"0","placeholder":""}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876358",
    message:
      'fieldId: 152876358, type: radio, json: {"logic":null,"id":"152876358","label":"Do you regularly email customers?","hide_label":"0","description":"","name":"do_you_regularly_email_customers","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"14","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876359",
    message:
      'fieldId: 152876359, type: radio, json: {"logic":null,"id":"152876359","label":"DO you have a recall system in place?","hide_label":"0","description":"","name":"do_you_have_a_recall_system_in_place","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"15","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876360",
    message:
      'fieldId: 152876360, type: checkbox, json: {"logic":null,"id":"152876360","label":"What do you want to accomplish with your online marketing ?","hide_label":"0","description":"","name":"what_do_you_want_to_accomplish_with_your_online_marketing_","type":"checkbox","options":[{"label":"Attract specific customer demographics","value":"Attract specific customer demographics","imageUrl":""},{"label":"Improve treatment conversion rates","value":"Improve treatment conversion rates","imageUrl":""},{"label":"Expand service offerings","value":"Expand service offerings","imageUrl":""},{"label":"Increase revenue per patient visit (existing patients)","value":"Increase revenue per patient visit (existing patients)","imageUrl":""},{"label":"Improve patient retention","value":"Improve patient retention","imageUrl":""},{"label":"Increase clinic/brand awareness","value":"Increase clinic/brand awareness","imageUrl":""},{"label":"Improve customer experience","value":"Improve customer experience","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"16","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":true,"option_checkall":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom","hide_option_button":true}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876361",
    message:
      'fieldId: 152876361, type: matrix, json: {"logic":null,"id":"152876361","label":"Who is responsible for online marketing efforts?","hide_label":"0","description":"","name":"who_is_responsible_for_online_marketing_efforts","type":"matrix","options":"","required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"17","calculation":"","workflow_access":"write","default":{"Website":[""],"Social Media accounts":[""]},"row_choices":"Website\\nSocial Media accounts","column_choices":"In clinic team member\\nExternal agency\\nNo designated person","one_per_row":"1","one_per_column":"0","randomize_rows":"0"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876362",
    message:
      'fieldId: 152876362, type: radio, json: {"logic":null,"id":"152876362","label":"Do you use a CRM system to capture leads and follow up?","hide_label":"0","description":"","name":"do_you_use_a_crm_system_to_capture_leads_and_follow_up","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"18","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876363",
    message:
      'fieldId: 152876363, type: text, json: {"logic":{"action":"show","conditional":"all","checks":[{"field":152876362,"condition":"equals","option":"Yes"}]},"id":"152876363","label":"Which system do you use?","hide_label":"0","description":"","name":"which_system_do_you_use","type":"text","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"3","sort":"19","calculation":"","workflow_access":"write","default":"","text_size":50,"minlength":0,"maxlength":0,"placeholder":"","field_one_calculation":0,"field_two_calculation":0,"calculation_units":"","calculation_operator":"","calculation_type":"","calculation_allow_negatives":0,"hide_input_characters":0,"remove_data_from_emails":0,"require_confirmation":0,"confirmationText":"","restrict_data_access":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876365",
    message:
      'fieldId: 152876365, type: checkbox, json: {"logic":null,"id":"152876365","label":"Describe your target customers?","hide_label":"0","description":"","name":"describe_your_target_customers","type":"checkbox","options":[{"label":"You have identified your ideal customer","value":"You have identified your ideal customer","imageUrl":""},{"label":"Your customers have been segmented into primary and secondary groups","value":"Your customers have been segmented into primary and secondary groups","imageUrl":""},{"label":"You have a specific communication plan for each segment","value":"You have a specific communication plan for each segment","imageUrl":""},{"label":"You track where your patients live, or where they are coming from","value":"You track where your patients live, or where they are coming from","imageUrl":""},{"label":"Your marketing efforts/campaigns are tailored to target selected geographies","value":"Your marketing efforts/campaigns are tailored to target selected geographies","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"2","sort":"21","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":true,"option_checkall":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom","hide_option_button":true}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876366",
    message:
      'fieldId: 152876366, type: checkbox, json: {"logic":null,"id":"152876366","label":"Does your clinic understand and track the following about your customers?","hide_label":"0","description":"","name":"does_your_clinic_understand_and_track_the_following_about_your_customers","type":"checkbox","options":[{"label":"Geography distribution (where they live)","value":"Geography distribution (where they live)","imageUrl":""},{"label":"Their jobs/interests/hobbies","value":"Their jobs/interests/hobbies","imageUrl":""},{"label":"Active vs inactive","value":"Active vs inactive","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"22","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":false,"option_checkall":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom","hide_option_button":true}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876367",
    message:
      'fieldId: 152876367, type: radio, json: {"logic":null,"id":"152876367","label":"Do you track how your patients are finding your clinic","hide_label":"0","description":"","name":"do_you_track_how_your_patients_are_finding_your_clinic","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"23","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876369",
    message:
      'fieldId: 152876369, type: radio, json: {"logic":null,"id":"152876369","label":"Do you have Google Analytics set up for your website","hide_label":"0","description":"","name":"do_you_have_google_analytics_set_up_for_your_website","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"25","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876370",
    message:
      'fieldId: 152876370, type: radio, json: {"logic":{"action":"show","conditional":"all","checks":[{"field":152876369,"condition":"equals","option":"Yes"}]},"id":"152876370","label":"Do you review these analytics and use them to direct your website efforts?","hide_label":"0","description":"","name":"do_you_review_these_analytics_and_use_them_to_direct_your_website_efforts","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"26","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876371",
    message:
      'fieldId: 152876371, type: radio, json: {"logic":null,"id":"152876371","label":"Do you utilize Google Ads?","hide_label":"0","description":"","name":"do_you_utilize_google_ads","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"27","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876372",
    message:
      'fieldId: 152876372, type: select, json: {"logic":{"action":"show","conditional":"all","checks":[{"field":152876371,"condition":"equals","option":"Yes"}]},"id":"152876372","label":"How much invested?","hide_label":"0","description":"annually","name":"how_much_invested","type":"select","options":[{"label":"one","value":"one","imageUrl":""},{"label":"two","value":"two","imageUrl":""},{"label":"","value":"","imageUrl":""}],"required":"0","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"28","calculation":"","workflow_access":"write","default":"","select_size":1,"option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876373",
    message:
      'fieldId: 152876373, type: radio, json: {"logic":null,"id":"152876373","label":"Do you post ads on social media?","hide_label":"0","description":"","name":"do_you_post_ads_on_social_media","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"29","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876374",
    message:
      'fieldId: 152876374, type: select, json: {"logic":{"action":"show","conditional":"all","checks":[{"field":152876373,"condition":"equals","option":"Yes"}]},"id":"152876374","label":"How much invested? ","hide_label":"0","description":"annually","name":"how_much_invested_","type":"select","options":[{"label":"One","value":"One","imageUrl":""},{"label":"Two","value":"Two","imageUrl":""}],"required":"0","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"30","calculation":"","workflow_access":"write","default":"","select_size":1,"option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0}',
    relatedFieldIds: [],
  },
  {
    severity: "warn",
    fieldId: "152876374",
    message:
      'White spaced detected at start or end. Label: "How much invested? ".',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876375",
    message:
      'fieldId: 152876375, type: radio, json: {"logic":null,"id":"152876375","label":"Do you have a Facebook Business Page?","hide_label":"0","description":"","name":"do_you_have_a_facebook_business_page","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"31","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876376",
    message:
      'fieldId: 152876376, type: radio, json: {"logic":{"action":"show","conditional":"all","checks":[{"field":152876375,"condition":"equals","option":"Yes"}]},"id":"152876376","label":"Do you utilize Business Suite Insights to direct your efforts for Facebook?","hide_label":"0","description":"","name":"do_you_utilize_business_suite_insights_to_direct_your_efforts_for_facebook","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"32","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876377",
    message:
      'fieldId: 152876377, type: radio, json: {"logic":null,"id":"152876377","label":"Do you have an Instagram Business Account?","hide_label":"0","description":"","name":"do_you_have_an_instagram_business_account","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"33","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876378",
    message:
      'fieldId: 152876378, type: radio, json: {"logic":{"action":"show","conditional":"all","checks":[{"field":152876377,"condition":"equals","option":"Yes"}]},"id":"152876378","label":"Do you utilize Business Suite Insights to direct your efforts for Instagram?","hide_label":"0","description":"","name":"do_you_utilize_business_suite_insights_to_direct_your_efforts_for_instagram","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":""},{"label":"No","value":"No","imageUrl":""}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"34","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876379",
    message:
      'fieldId: 152876379, type: radio, json: {"logic":null,"id":"152876379","label":"Do you have results/statistics you can share for either of the above?","hide_label":"0","description":"","name":"do_you_have_resultsstatistics_you_can_share_for_either_of_the_above","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"35","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876381",
    message:
      'fieldId: 152876381, type: radio, json: {"logic":null,"id":"152876381","label":"Do you use Google Places for your business listing?","hide_label":"0","description":"","name":"do_you_use_google_places_for_your_business_listing","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"1","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"36","calculation":"","workflow_access":"write","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "debug",
    fieldId: "152876383",
    message:
      'fieldId: 152876383, type: radio, json: {"logic":null,"id":"152876383","label":"Assessment complete","hide_label":"0","description":"","name":"assessment_complete","type":"radio","options":[{"label":"Yes","value":"Yes","imageUrl":null},{"label":"No","value":"No","imageUrl":null}],"required":"0","uniq":"0","hidden":"0","readonly":"0","colspan":"1","sort":"38","calculation":"","workflow_access":"hidden","default":"","option_layout":"vertical","option_other":0,"randomize_options":0,"option_store":"value","option_show_values":0,"use_images":0,"image_dimensions":"customDimensions","image_height":100,"image_width":100,"lock_image_ratio":true,"lock_image_ratio_option":"fitProportionally","image_label_alignment":"bottom"}',
    relatedFieldIds: [],
  },
  {
    severity: "warn",
    fieldId: null,
    message: 'label: "How much invested?" is used 2 times.',
    relatedFieldIds: ["152876372", "152876374"],
  },
];
