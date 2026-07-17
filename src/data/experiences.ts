import type { CategoryId } from './categories'

export type Experience = {
  id: string
  title: string
  org: string
  category: CategoryId
  /** Subcategory id from categories.ts (e.g. 'crea-music'). */
  subcategory: string
  /** e.g. "2023" or "2021–2023". Empty string renders as omitted. */
  dates: string
  /** One or two sentences. Empty string renders as omitted. */
  blurb: string
  links?: { label: string; url: string }[]
}

/**
 * ELIZABETH: two things to review here.
 *
 * 1. `dates` and `blurb` are empty — fill them in. The detail panel omits
 *    either field while blank, so the site works throughout.
 *
 * 2. `category` / `subcategory` were assigned as a first pass and several are
 *    judgement calls. Notably: the 7 categories don't have a natural home for
 *    the service/manual roles (barista, gelato, cook, forklift, ushering,
 *    culinary), so those are parked under Business → Service & Hospitality;
 *    floristry and nail art read as craft, so they sit in Creative → Visual;
 *    club-leadership roles (music society, literature club) go to Leadership
 *    rather than their subject. Reassign freely — these two fields are the only
 *    thing driving which category/subcategory a node belongs to.
 */
export const EXPERIENCES: Experience[] = [
  // ── Business ────────────────────────────────────────────────────────
  { id: 'accounting-sinarmas', title: 'Accounting Intern', org: 'Sinarmas', category: 'business', subcategory: 'biz-finance', dates: '', blurb: '' },
  { id: 'investment-analyst-smif', title: 'Investment Analyst', org: 'TWU SMIF', category: 'business', subcategory: 'biz-finance', dates: '', blurb: '' },
  { id: 'econ-research-twu', title: 'Economics Research Assistant', org: 'TWU', category: 'business', subcategory: 'biz-finance', dates: '', blurb: '' },
  { id: 'dessert-business', title: 'Founder', org: 'dessert business', category: 'business', subcategory: 'biz-entrepreneurship', dates: '', blurb: '' },
  { id: 'energy-advisor-ark', title: 'Sales & Energy Advisor', org: 'ARK Renewable', category: 'business', subcategory: 'biz-sales', dates: '', blurb: '' },
  { id: 'admissions-ambassador-twu', title: 'Admissions Ambassador', org: 'TWU', category: 'business', subcategory: 'biz-sales', dates: '', blurb: '' },
  { id: 'grcg-competition', title: '1st Place', org: 'Global Research and Consulting Group Competition', category: 'business', subcategory: 'biz-sales', dates: '', blurb: '' },
  { id: 'culinary-toko-oen', title: 'Culinary Intern', org: 'Toko Oen', category: 'business', subcategory: 'biz-service', dates: '', blurb: '' },
  { id: 'barista-roemah', title: 'Assistant Barista', org: 'Roemah', category: 'business', subcategory: 'biz-service', dates: '', blurb: '' },
  { id: 'food-service-marias', title: 'Food Service Associate', org: "Maria's Gelato", category: 'business', subcategory: 'biz-service', dates: '', blurb: '' },
  { id: 'cook-keats', title: 'Cook', org: "Keat's Camps", category: 'business', subcategory: 'biz-service', dates: '', blurb: '' },
  { id: 'forklift-cirro', title: 'Forklift Driver', org: 'CIRRO', category: 'business', subcategory: 'biz-service', dates: '', blurb: '' },
  { id: 'ushering-ticketing', title: 'Ushering, Ticketing & Customer Service', org: 'various events', category: 'business', subcategory: 'biz-service', dates: '', blurb: '' },

  // ── Technology ──────────────────────────────────────────────────────
  { id: 'uiux-nikola', title: 'UI/UX Intern', org: 'Nikola Academy', category: 'technology', subcategory: 'tech-software', dates: '', blurb: '' },
  { id: 'engineering-research-asa', title: 'Electrical & Mechanical Engineering Research', org: 'Applied Science Academy', category: 'technology', subcategory: 'tech-engineering', dates: '', blurb: '' },
  { id: 'it-club', title: 'IT Club', org: 'club leadership', category: 'technology', subcategory: 'tech-it', dates: '', blurb: '' },
  { id: 'multimedia-manager', title: 'Multimedia Manager', org: '', category: 'technology', subcategory: 'tech-media', dates: '', blurb: '' },
  { id: 'av-technician-grii-sph', title: 'Audio Visual Technician', org: 'GRII & SPH', category: 'technology', subcategory: 'tech-media', dates: '', blurb: '' },
  { id: 'camera-operator', title: 'Camera Operator', org: 'theater, sports, corporate', category: 'technology', subcategory: 'tech-media', dates: '', blurb: '' },
  { id: 'lighting-operator', title: 'Lighting Operator', org: '', category: 'technology', subcategory: 'tech-media', dates: '', blurb: '' },
  { id: 'concert-hall-asj', title: 'Concert Hall Personnel', org: 'Aula Sinfonia Jakarta', category: 'technology', subcategory: 'tech-media', dates: '', blurb: '' },
  { id: 'stage-coordinator-concordia', title: 'Stage Coordinator', org: 'Orkes Komunitas Concordia', category: 'technology', subcategory: 'tech-media', dates: '', blurb: '' },

  // ── Science ─────────────────────────────────────────────────────────
  { id: 'medical-intern-siloam', title: 'Medical Intern', org: 'Siloam Hospitals', category: 'science', subcategory: 'sci-medicine', dates: '', blurb: '' },
  { id: 'lab-assistant-slh', title: 'Laboratory Assistant', org: 'SLH', category: 'science', subcategory: 'sci-medicine', dates: '', blurb: '' },
  { id: 'first-aid', title: 'First Aid Certified', org: '', category: 'science', subcategory: 'sci-medicine', dates: '', blurb: '' },
  { id: 'biochem-emmerich', title: 'Biochemistry Research Intern', org: 'Emmerich Research Center', category: 'science', subcategory: 'sci-life', dates: '', blurb: '' },
  { id: 'horticulture-agritisan', title: 'Horticulture Intern', org: 'Agritisan, Singapore', category: 'science', subcategory: 'sci-life', dates: '', blurb: '' },
  { id: 'mathletes-club', title: 'Mathletes Club', org: '', category: 'science', subcategory: 'sci-math', dates: '', blurb: '' },
  { id: 'proctor-emc2', title: 'Proctor', org: 'E=MC² Mathletes Competition', category: 'science', subcategory: 'sci-math', dates: '', blurb: '' },

  // ── Leadership ──────────────────────────────────────────────────────
  { id: 'cofounder-theextrastep', title: 'Co-Founder', org: 'TheExtraStep', category: 'leadership', subcategory: 'lead-founding', dates: '', blurb: '' },
  { id: 'tedx-organizer', title: 'Organizer', org: 'TEDx', category: 'leadership', subcategory: 'lead-events', dates: '', blurb: '' },
  { id: 'tedx-club', title: 'TEDx Club', org: 'club leadership', category: 'leadership', subcategory: 'lead-events', dates: '', blurb: '' },
  { id: 'badminton-tournament-organizer', title: 'Tournament Organizer', org: 'badminton', category: 'leadership', subcategory: 'lead-events', dates: '', blurb: '' },
  { id: 'music-society', title: 'Music Society', org: 'club leadership', category: 'leadership', subcategory: 'lead-clubs', dates: '', blurb: '' },
  { id: 'literature-club', title: 'Literature Club', org: 'club leadership', category: 'leadership', subcategory: 'lead-clubs', dates: '', blurb: '' },
  { id: 'paskibra', title: 'Paskibra', org: 'all positions', category: 'leadership', subcategory: 'lead-civic', dates: '', blurb: '' },

  // ── Creative ────────────────────────────────────────────────────────
  { id: 'multi-instrumentalist', title: 'Multi-Instrumentalist', org: 'kolintang, piano, synths, guitar, bass, flute, choir, gong', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'pianist-toko-oen', title: 'Restaurant Pianist', org: 'Toko Oen', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'choral-jakarta-oratorio', title: 'National Choral Member', org: 'Jakarta Oratorio Society', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'flute-rep-acsc', title: 'Indonesian Flute Representative', org: 'Asia Christian Schools Conference, Hong Kong', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'band-visense', title: 'Founder', org: 'VISENSE', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'concert-band', title: 'Concert Band', org: '', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'conducting-apprentice', title: 'Conducting Apprentice', org: '', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'dj-apprentice-yacht', title: 'DJ Apprentice', org: 'yacht service', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'radio-performance', title: 'Radio Performance', org: 'various bands', category: 'creative', subcategory: 'crea-music', dates: '', blurb: '' },
  { id: 'gfx-designer', title: 'Commissioned GFX Designer', org: 'freelance', category: 'creative', subcategory: 'crea-visual', dates: '', blurb: '' },
  { id: 'graphic-designer-corporate', title: 'Graphic Designer', org: 'corporate events', category: 'creative', subcategory: 'crea-visual', dates: '', blurb: '' },
  { id: 'photographer-operasi-semut', title: 'Photographer', org: 'Operasi Semut', category: 'creative', subcategory: 'crea-visual', dates: '', blurb: '' },
  { id: 'nail-art-longlashting', title: 'Nail Art Apprentice', org: 'Longlashting Academy', category: 'creative', subcategory: 'crea-visual', dates: '', blurb: '' },
  { id: 'florist-de-fleur', title: 'Florist', org: 'De Fleur', category: 'creative', subcategory: 'crea-visual', dates: '', blurb: '' },
  { id: 'flower-arranger-knits', title: 'Flower Arranger', org: 'Knits at Heart', category: 'creative', subcategory: 'crea-visual', dates: '', blurb: '' },
  { id: 'live-art-model-samc', title: 'Live Art Model', org: 'SAMC, TWU', category: 'creative', subcategory: 'crea-performance', dates: '', blurb: '' },
  { id: 'mc-events', title: 'MC', org: 'multiple events', category: 'creative', subcategory: 'crea-performance', dates: '', blurb: '' },

  // ── Humanities ──────────────────────────────────────────────────────
  { id: 'debate-club', title: 'Debate Club', org: '', category: 'humanities', subcategory: 'hum-debate', dates: '', blurb: '' },
  { id: 'mun-awards', title: 'MUN Awards', org: 'Korea & Singapore', category: 'humanities', subcategory: 'hum-debate', dates: '', blurb: '' },
  { id: 'law-policy-ottawa', title: 'Law & Policy', org: 'LLC Ottawa', category: 'humanities', subcategory: 'hum-debate', dates: '', blurb: '' },
  { id: 'math-teacher-kumon', title: 'Math Teacher', org: 'Kumon', category: 'humanities', subcategory: 'hum-education', dates: '', blurb: '' },
  { id: 'radio-host-coop', title: 'Radio Host', org: 'Vancouver Coop Radio', category: 'humanities', subcategory: 'hum-media', dates: '', blurb: '' },
  { id: 'assistant-librarian', title: 'Assistant Librarian', org: '', category: 'humanities', subcategory: 'hum-media', dates: '', blurb: '' },

  // ── Athletics ───────────────────────────────────────────────────────
  { id: 'varsity-badminton', title: 'Varsity Badminton', org: '', category: 'athletics', subcategory: 'ath-badminton', dates: '', blurb: '' },
  { id: 'badminton-club', title: 'Badminton Club', org: '', category: 'athletics', subcategory: 'ath-badminton', dates: '', blurb: '' },
  { id: 'badminton-referee-pbsi', title: 'Line Judge & Referee', org: 'PBSI Tangerang', category: 'athletics', subcategory: 'ath-badminton', dates: '', blurb: '' },
  { id: 'sports-management-lec', title: 'Sports Management Staff', org: 'Langley Events Centre', category: 'athletics', subcategory: 'ath-operations', dates: '', blurb: '' },
  { id: 'sports-announcer-lpco', title: 'Sports Announcer', org: 'LPCO', category: 'athletics', subcategory: 'ath-operations', dates: '', blurb: '' },
]

export const byId = (id: string) => EXPERIENCES.find((e) => e.id === id)
