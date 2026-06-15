/** A published portfolio item shown in the gallery. */
export interface GalleryProject {
  id: string;
  title: string;
  location: string;
  alt: string;
  /** Absolute URL — either a Supabase Storage public URL or a local /public path. */
  image_url: string;
  sort_order: number;
  published: boolean;
}

/** Shape inserted into `public.leads` when a visitor requests an estimate. */
export interface LeadInsert {
  name: string;
  email: string | null;
  phone: string;
  project_type: string | null;
  message: string | null;
  source: string;
}
