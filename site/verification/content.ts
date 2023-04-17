import { getHeadingsFromHTMLContent, stripContentFromHeading } from "../lib/toc";
import { getHTMLFromMarkdown } from "../lib/jips";
import { warning } from "./util";

const OBLIGATORY_HEADINGS = [
  "Abstract",
  "Problem",
  "Specification",
  "Rationale",
  "Copyright",
  "Citation",
  "Changelog",
];

let hasError = false;

export const verifyContent = async (content: string) => {
  const html = await getHTMLFromMarkdown(content);
  const headings = (getHeadingsFromHTMLContent(html) ?? []).map((heading) =>
    stripContentFromHeading(heading)
  );

  for (const obligatoryHeading of OBLIGATORY_HEADINGS) {
    if (!headings.includes(obligatoryHeading)) {
      hasError = true;

      console.log(
        warning(
          `This file is missing the following obligatory heading: "${obligatoryHeading}" (and possibly its associated content).`
        )
      );
    }
  }

  if (hasError) {
    throw new Error(
      "There has been a problem while verifying the content of this file. Please fix the problems mentioned above before continuing!"
    );
  }
};
