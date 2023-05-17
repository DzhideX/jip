import { readJipFromIndex } from "@/lib/files";
import index from "@/lib/index";
import { NextApiRequest, NextApiResponse } from "next";

const importIndex = () => {
  const files = readJipFromIndex();

  Object.keys(files).forEach((key) => {
    index.import(key, files[key]);
  });
};

importIndex();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { searchQuery } = req.query;

  const results = index.search(searchQuery as string);

  res.status(200).json({ name: "John Doe", searchQuery, results });
}
