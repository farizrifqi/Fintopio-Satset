export interface ParsedQueryID {
  user: {
    id?: number | string | null;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    language_code?: string | null;
    allows_write_to_pm?: boolean | null;
  };
  chat_instance?: string | null;
  chat_type?: string | null;
  start_param?: string | null;
  auth_date?: string | null;
  hash?: string | null;
}
