import fs from "fs";
import path from "path";

export const JIP_FOLDER_IDENTIFIER = "jip-";
export type JipId = `${typeof JIP_FOLDER_IDENTIFIER}${number}`;

export const getJIPDirectory = (jipId: JipId) => path.join(process.cwd(), `../${jipId}/jip.md`);

export const isStringJipId = (string: string) => /jip-[0-9]/g.test(string);

export const getAllJipIDs = () => {
  const rootFolder = path.join(process.cwd(), "..");
  const rootFolderJIPs = fs
    .readdirSync(rootFolder)
    .filter((itemName) => itemName.includes(JIP_FOLDER_IDENTIFIER)) as Array<JipId>;

  return rootFolderJIPs;
};

export const saveJipToIndex = (key: string, data: string) => {
  fs.writeFileSync(path.join(process.cwd(), `index/${key}.json`), data);
};

export const readJipFromIndex = () => {
  const indexPath = path.join(process.cwd(), `index`);
  const files = fs.readdirSync(indexPath, "utf-8").filter((fileName) => fileName.includes(".json"));

  return files.reduce((acc: any, fileName) => {
    const fileContents = fs.readFileSync(indexPath + `/${fileName}`, "utf8");

    return {
      ...acc,
      [fileName.replace(".json", "")]: JSON.parse(fileContents),
    };
  }, {});
};
