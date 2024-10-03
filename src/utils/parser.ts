import { ParsedQueryID } from "../types/Query";
import { QueryID } from "../types/Auth";

export const parseQuery = (query: QueryID): ParsedQueryID | null => {
  const params = new URLSearchParams(query);
  const userString = params.get("user");
  if (!userString) return null;
  const user = JSON.parse(decodeURIComponent(userString));
  const parsedObject: ParsedQueryID = {
    user,
    chat_instance: params.get("chat_instance"),
    chat_type: params.get("chat_type"),
    start_param: params.get("start_param"),
    auth_date: params.get("auth_date"),
    hash: params.get("hash"),
  };
  return parsedObject;
};
