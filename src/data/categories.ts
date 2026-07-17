/**
 * The category hierarchy: 7 top-level categories, each with a few
 * subcategories. This is the spine the whole navigation hangs off — the star
 * hub shows one level of it at a time, and the galaxy filters to match.
 *
 * Arrays, not maps, because order is meaningful: it fixes where each category
 * sits in the orbiting ring and which galaxy ring its nodes land on, so the
 * layout is stable across reloads.
 *
 * Subcategory ids are globally unique (prefixed) so an experience's
 * `subcategory` is unambiguous on its own.
 */
export type SubCategory = { id: string; label: string }
export type MainCategory = {
  id: CategoryId
  label: string
  subs: SubCategory[]
}

export type CategoryId =
  | 'business'
  | 'technology'
  | 'science'
  | 'leadership'
  | 'creative'
  | 'humanities'
  | 'athletics'

export const CATEGORIES: MainCategory[] = [
  {
    id: 'business',
    label: 'Business',
    subs: [
      { id: 'biz-finance', label: 'Finance & Accounting' },
      { id: 'biz-entrepreneurship', label: 'Entrepreneurship' },
      { id: 'biz-sales', label: 'Sales & Consulting' },
      { id: 'biz-service', label: 'Service & Hospitality' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    subs: [
      { id: 'tech-software', label: 'Software & UX' },
      { id: 'tech-engineering', label: 'Engineering' },
      { id: 'tech-it', label: 'IT & Systems' },
      { id: 'tech-media', label: 'Media Production' },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    subs: [
      { id: 'sci-medicine', label: 'Medicine & Health' },
      { id: 'sci-life', label: 'Life Sciences' },
      { id: 'sci-math', label: 'Math & Quantitative' },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    subs: [
      { id: 'lead-founding', label: 'Founding & Orgs' },
      { id: 'lead-events', label: 'Events & Organizing' },
      { id: 'lead-clubs', label: 'Club Leadership' },
      { id: 'lead-civic', label: 'Civic & Ceremonial' },
    ],
  },
  {
    id: 'creative',
    label: 'Creative',
    subs: [
      { id: 'crea-music', label: 'Music' },
      { id: 'crea-visual', label: 'Visual & Design' },
      { id: 'crea-performance', label: 'Performance' },
    ],
  },
  {
    id: 'humanities',
    label: 'Humanities',
    subs: [
      { id: 'hum-debate', label: 'Debate & Policy' },
      { id: 'hum-education', label: 'Education' },
      { id: 'hum-media', label: 'Media & Communication' },
    ],
  },
  {
    id: 'athletics',
    label: 'Athletics',
    subs: [
      { id: 'ath-badminton', label: 'Badminton' },
      { id: 'ath-operations', label: 'Sports Operations' },
    ],
  },
]

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

const CAT_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]))
const SUB_BY_ID = new Map(
  CATEGORIES.flatMap((c) => c.subs).map((s) => [s.id, s]),
)

export const categoryById = (id: CategoryId) => CAT_BY_ID.get(id)
export const categoryLabel = (id: CategoryId) => CAT_BY_ID.get(id)?.label ?? id
export const subLabel = (id: string) => SUB_BY_ID.get(id)?.label ?? id

/** Ring radius index for a category (its position in CATEGORIES). */
export const categoryOrder = (id: CategoryId) =>
  CATEGORY_IDS.indexOf(id)
