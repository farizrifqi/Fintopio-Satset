import type { ParsedQueryID } from '../types/Query';
import type { QueryID } from '../types/Auth';
import axios from 'axios';

export const parseQuery = (query: QueryID): ParsedQueryID | null => {
  const params = new URLSearchParams(query);
  const userString = params.get('user');
  if (!userString) return null;
  const user = JSON.parse(decodeURIComponent(userString));
  const parsedObject: ParsedQueryID = {
    user,
    chat_instance: params.get('chat_instance'),
    chat_type: params.get('chat_type'),
    start_param: params.get('start_param'),
    auth_date: params.get('auth_date'),
    hash: params.get('hash')
  };
  return parsedObject;
};

export const parseRefCode = async (referral: string): Promise<string | false> => {
  let ref = referral
  const getShortLink = async (url: string): Promise<string> => {
    let result = url
    if (url.includes("fintop.io")) {
      try {
        const response = await axios.get("https://fintop.io/2uLXdZpbjF")
        result = response.data
        return result
      } catch (err) {
        return result
      }
    }
    return result
  }
  const getFullLink = (url: string): string => {
    const regex = /startapp=(reflink-reflink_[^-]+)/;
    const matchFull = url.match(regex);
    if (matchFull) {
      return matchFull[1];
    }
    return referral
  }
  const getReal = (referral: string) => {
    const match = referral.match(/reflink-reflink_([^-]+)/);
    if (match) {
      return match[1]
    }
    return referral
  }
  ref = await getShortLink(ref)
  ref = getReal(getFullLink(ref))
  return ref === referral ? false : ref
}