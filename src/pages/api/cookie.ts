import type { NextApiRequest, NextApiResponse } from "next";

export type ResponseData = {
  message: string;
};

export type RequestBody = {
  name?: string;
  value?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "POST") {
    const { name, value } = JSON.parse(req.body) as RequestBody;

    if (name == undefined) res.status(200).json({ message: "No cookie set." });

    res.setHeader("Set-Cookie", `${name}=${value == undefined ? "" : value}`);
    res.status(200);
    res.json({ message: "Cookie set." });
  }
}
