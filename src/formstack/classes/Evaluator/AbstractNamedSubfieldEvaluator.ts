import { transformers } from "../../transformers";
import { AbstractComplexSubmissionDatumEvaluator } from "./AbstractComplexSubmissionDatumEvaluator";
import { TUiEvaluationObject } from "./type";

abstract class AbstractNamedSubfieldEvaluator extends AbstractComplexSubmissionDatumEvaluator {
  abstract get supportedSubfieldIds(): string[];

  getUiPopulateObjects<T = string>(submissionDatum?: T): TUiEvaluationObject[] {
    const statusMessages =
      this.createStatusMessageArrayWithStoredValue(submissionDatum);
    if (!submissionDatum) {
      if (this.isRequired) {
        return this.getUiPopulateObjectsEmptyAndRequired(statusMessages);
      }
      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    const parsedValues = this.parseValues<
      string,
      { [subfieldId: string]: string }
    >(submissionDatum as string);

    if (Object.keys(parsedValues).length === 0) {
      statusMessages.push(
        this.wrapAsStatusMessage(
          "error",
          `No subfields with id: '${this.supportedSubfieldIds.join(
            "', '"
          )}' found in submission data: '${transformers.Utility.jsObjectToHtmlFriendlyString(
            submissionDatum
          )}'.`
        )
      );

      return [this.wrapAsUiObject(null, "", statusMessages)];
    }

    Object.entries(parsedValues).forEach(([key, value]) => {
      if (!this.supportedSubfieldIds.includes(key)) {
        statusMessages.push(
          this.wrapAsStatusMessage(
            "warn",
            `Found unexpected subfield: '${key}'. With value: '${value}'.`
          )
        );
      }
    });

    const uiComponents = this.supportedSubfieldIds.map((subfieldId) => {
      return this.wrapAsUiObject(
        `field${this.fieldId}-${subfieldId}`,
        parsedValues[subfieldId]
      );
    });

    // add one more for status message
    uiComponents.push(this.wrapAsUiObject(null, "", statusMessages));
    return uiComponents;
  }
}

export { AbstractNamedSubfieldEvaluator };
