import { parsePreamble } from "../lib/preamble";
import { JipId, getAllJipIDs, getJIPDirectory, isStringJipId } from "../lib/files";
import { FileArgument } from "./types";
import { success, warning, info, failure } from "./util";
import fs from "fs";
import { verifyContent } from "./content";

const fileArgument = process.argv[2] as undefined | FileArgument;

const verifyFile = async (jipId: JipId) => {
  try {
    console.log(info(`Validating file with id: ${jipId}`));

    const fileContents = fs.readFileSync(getJIPDirectory(jipId), "utf8");
    const { content } = parsePreamble(fileContents, { delimiters: ["<pre>", "</pre>"] });

    await verifyContent(content);

    console.log(success("File successfuly validated, no problems found!"));
  } catch (e) {
    console.log(failure(`There has been a problem while trying to validate this file.`, e));
    throw e;
  }
};

const verifyFiles = async () => {
  const jipIds = getAllJipIDs();
  for (let jipId of jipIds) {
    await verifyFile(jipId);
  }
};

const main = async () => {
  try {
    if (fileArgument && isStringJipId(fileArgument)) {
      await verifyFile(fileArgument as JipId);
    } else {
      console.log(
        warning(
          `No file argument has been passed, testing all conforming files in the root folder!`
        )
      );
      await verifyFiles();
    }
  } catch (e) {
    // console.log("Error occured, exiting..");

    process.exit(-1);
  }

  return 0;
};

main();
