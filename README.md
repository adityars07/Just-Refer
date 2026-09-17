# JustRefer — India's 1st Loan Referral Platform 🚀

A modern, high-performance financial referral platform built with **React 19**, **TypeScript**, and **Vite**. JustRefer connects individuals with top loan deals across India while rewarding referrers with attractive commission payouts and tiered bonuses.

---

## ✨ Key Features

- 💼 **Comprehensive Loan Products**: Dedicated sections with interest rates, eligibility criteria, required documents, and commission rates for:
  - **Home Loans** (Up to ₹100 Cr, starting 8.35% p.a.)
  - **Loan Against Property** (Up to ₹50 Cr, starting 9.25% p.a.)
  - **Personal Loans** (Instant approval up to ₹40 L, starting 10.49% p.a.)
  - **Business Loans** (Collateral-free up to ₹75 L, starting 11.99% p.a.)
- 💰 **Earning Calculator & Breakdown**: Clear transparency on referrer earnings (e.g. ₹30,000 to ₹50,000 per ₹1 Crore disbursed).
- 🏆 **Bonus Program**: Tiered incentives (Silver, Gold, Platinum) with extra bonus multipliers.
- 🧮 **Interactive EMI Calculator**: Real-time canvas donut chart breaking down monthly EMI, principal, and total interest.
- 📱 **100% Mobile Responsive**: Dedicated mobile navigation drawer, one-tap phone contact, and touch-optimized components.
- ⚡ **Lightning Fast**: Built on Vite with pure CSS styling (no heavy UI frameworks) and sub-second builds.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, smooth gradients, and glassmorphism
- **Fonts**: Inter & Outfit (Google Fonts)
- **Charts**: Custom HTML5 Canvas Donut Visualizer

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Sticky header, top bar & mobile menu drawer
│   ├── Hero.tsx             # Animated stats & floating badge cards
│   ├── EarningPotential.tsx # Commission breakdown per loan type
│   ├── BonusProgram.tsx     # Tiered rewards program
│   ├── HowItWorks.tsx       # 3-step referral process
│   ├── LoanProducts.tsx     # Full details for all 4 loan categories
│   ├── WhyChooseUs.tsx      # Core platform advantages
│   ├── About.tsx            # Mission, vision, and milestones
│   ├── Testimonials.tsx     # Referrer success stories
│   ├── EMICalculator.tsx    # Interactive loan EMI calculator
│   ├── Contact.tsx          # Direct inquiry form & branch details
│   ├── FAQ.tsx              # Accordion FAQ
│   ├── Footer.tsx           # Footer with site links & disclaimers
│   └── BackToTop.tsx        # Floating back-to-top button
├── App.tsx                  # Main layout composition
├── App.css                  # Section & component styles
├── index.css                # Global tokens, resets & typography
└── main.tsx                 # React entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/adityars07/Just-Refer.git

# Navigate into the project
cd Just-Refer

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```

---

## 📄 License
Private client demo project for **FinzoMoney / JustRefer**.
