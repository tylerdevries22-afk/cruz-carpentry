/** Shape inserted into `public.leads` when a visitor requests an estimate. */
export interface LeadInsert {
  name: string;
  email: string | null;
  phone: string;
  project_type: string | null;
  message: string | null;
  source: string;
}
