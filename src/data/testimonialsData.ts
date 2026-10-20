export interface PartnerTestimonial {
  id: string
  name: string
  role: string
  firm?: string
  city: string
  category: 'Home Loan' | 'Business Loan' | 'Loan Against Property' | 'Personal Loan'
  image: string
  quote: string
  metricBadge: string
}

export const DEFAULT_TESTIMONIALS: PartnerTestimonial[] = [
  {
    id: "1",
    name: "CA Rajesh Verma",
    role: "Senior Partner",
    firm: "Verma & Associates",
    city: "Delhi NCR",
    category: "Loan Against Property",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote: "My SME and corporate clients frequently require high-ticket mortgage and working capital finance. JustRefer queries 24+ lender cut-offs instantly. Disbursed ₹12 Cr in Q3 with Friday bank credits without fail.",
    metricBadge: "₹12 Cr Disbursed in Q3",
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Principal Broker",
    firm: "Sharma Realty",
    city: "Mumbai",
    category: "Home Loan",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    quote: "Before JustRefer, I spent hours chasing individual branch managers for homebuyer updates. Now I enter lead details in 30 seconds and bank ops handles collection. Clients get 8.40% rates and my payout lands on time.",
    metricBadge: "₹2.8L Monthly Payouts Added",
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Independent Wealth Advisor",
    firm: "Apex Wealth Partners",
    city: "Bengaluru",
    category: "Personal Loan",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote: "Most referral networks make advisors jump through weeks of KYC hurdles before releasing a single rupee. JustRefer has zero onboarding friction, live WhatsApp milestone alerts, and direct bank settlement.",
    metricBadge: "48-Hour Digital Disbursals",
  },
  {
    id: "4",
    name: "Vikram Singhania",
    role: "Debt Syndicator",
    firm: "Eastern Capital",
    city: "Kolkata",
    category: "Business Loan",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    quote: "Securing machinery loans and export working capital was always tedious. JustRefer's multi-bank platform helped our manufacturing clients get sanctions in 10 days with lowest processing fees.",
    metricBadge: "₹25 Cr Line Approved",
  },
  {
    id: "5",
    name: "Ananya Deshmukh",
    role: "Channel Partner Lead",
    firm: "Prime Living",
    city: "Pune",
    category: "Home Loan",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    quote: "Our homebuyer clients love the transparency of the EMI planner and loan comparison. As a channel partner, the dedicated ops team handles everything after referral submission. Truly seamless.",
    metricBadge: "100% Friday Settlement",
  },
  {
    id: "6",
    name: "Karthik Sundaram",
    role: "Tax & Financial Consultant",
    firm: "Sundaram Advisors",
    city: "Chennai",
    category: "Loan Against Property",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    quote: "We helped 18 commercial property owners unlock liquidity through JustRefer's LAP network. Zero hidden charges and the commission slabs are institutional tier.",
    metricBadge: "18+ Sanctions Closed",
  },
  {
    id: "7",
    name: "Rohan Mehta",
    role: "DSA Franchise Director",
    firm: "FinRoute Connect",
    city: "Ahmedabad",
    category: "Business Loan",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    quote: "Cases rejected by single banks because of niche turnover profiles get placed easily through JustRefer. The lender match algorithm is outstanding.",
    metricBadge: "₹8.5 Cr Disbursed in 30 Days",
  },
  {
    id: "8",
    name: "Sneha Kulkarni",
    role: "Investment Planner",
    firm: "Kulkarni Financial",
    city: "Hyderabad",
    category: "Personal Loan",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    quote: "Doctors and IT professionals in my client circle needed instant unsecured lines without branch visits. JustRefer disbursed in under 48 hours.",
    metricBadge: "4.9/5 Client Rating",
  },
  {
    id: "9",
    name: "Harish Rawat",
    role: "Real Estate Consultant",
    firm: "Skyline Properties",
    city: "Gurugram",
    category: "Home Loan",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    quote: "High-net-worth clients purchasing luxury villas get priority banking assistance. Commission payouts are calculated accurately down to the rupee.",
    metricBadge: "₹5.5L Commission Credited",
  },
]

const STORAGE_KEY = 'jr_testimonials_v1'

export function getStoredTestimonials(): PartnerTestimonial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed reading testimonials from localStorage:', err)
  }
  return DEFAULT_TESTIMONIALS
}

export function saveStoredTestimonials(list: PartnerTestimonial[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('justrefer:testimonials-updated', { detail: list }))
  } catch (err) {
    console.error('Failed saving testimonials to localStorage:', err)
  }
}

export function resetToDefaultTestimonials(): PartnerTestimonial[] {
  saveStoredTestimonials(DEFAULT_TESTIMONIALS)
  return DEFAULT_TESTIMONIALS
}
