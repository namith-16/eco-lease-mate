# EcoScoot Leasing Platform

A production-ready, accessible leasing platform for EcoScoot electric scooters. Built with React, TypeScript, SCSS modules, and PDF generation capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd ecoscoot-leasing

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ecoscoot-leasing/
├── public/
│   ├── content.csv              # Copy blocks for all sections
│   └── copy_en_and_ml.txt       # English + Malayalam translations
├── src/
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── LeaseCard.tsx        # Compact pricing card component
│   │   ├── LeaseCard.module.scss
│   │   ├── LeaseCalculator.tsx  # Interactive calculator with PDF export
│   │   └── LeaseCalculator.module.scss
│   ├── hooks/
│   │   └── useLeaseCalculator.ts # Calculator logic hook
│   ├── pages/
│   │   ├── Index.tsx            # Main entry (redirects to LeasePage)
│   │   ├── LeasePage.tsx        # Full lease page component
│   │   └── LeasePage.module.scss
│   ├── styles/
│   │   ├── _variables.scss      # Design system variables
│   │   └── _mixins.scss         # Reusable SCSS mixins
│   ├── utils/
│   │   └── pdfGenerator.ts      # PDF quote generation
│   ├── index.css                # Global styles + design tokens
│   └── main.tsx                 # Application entry point
├── tailwind.config.ts           # Tailwind configuration
├── vite.config.ts               # Vite configuration
├── package.json
└── README.md
```

## 🎨 Design System

The design system is built with HSL colors and semantic tokens defined in `src/index.css`:

### Brand Colors
- **Primary Green**: `hsl(158 64% 52%)` - EcoScoot brand color
- **Charcoal**: `hsl(220 13% 13%)` - Text and UI elements
- **Green Light**: `hsl(158 64% 96%)` - Backgrounds and highlights

### Typography
- **Font Family**: System font stack (Apple, Segoe UI, Roboto)
- **Scale**: 0.75rem to 3rem with semantic naming

### Spacing
- **Scale**: 0.25rem to 4rem (xs to 3xl)

### SCSS Variables
All design tokens are available as CSS custom properties and can be accessed in SCSS:

```scss
@import '../styles/variables';
@import '../styles/mixins';

.myComponent {
  color: hsl(var(--primary));
  padding: var(--spacing-lg);
  
  @include mobile {
    padding: var(--spacing-md);
  }
}
```

## 🧩 Component Usage

### LeaseCard (Compact Card)

```tsx
import LeaseCard from '@/components/LeaseCard';

<LeaseCard
  name="Monthly"
  malayalamName="മാസം"
  price={7599}
  period="month"
  deposit={5000}
  features={[
    "Best value for money",
    "All maintenance included"
  ]}
  highlighted={true}
  onSelect={() => console.log('Plan selected')}
/>
```

**Props API:**
- `name` (string, required): Plan name
- `malayalamName` (string, optional): Malayalam translation
- `price` (number, required): Price amount
- `period` (string, required): Billing period (hour/day/month)
- `deposit` (number, optional): Security deposit amount
- `features` (string[], required): List of features (max 2 recommended)
- `highlighted` (boolean, optional): Show as most popular
- `onSelect` (function, optional): Callback when selected

### LeasePage (Full Page)

```tsx
import LeasePage from '@/pages/LeasePage';

// Use as main page component
<LeasePage />
```

The full page includes:
- Hero section with CTAs
- Pricing cards (Hourly, Daily, Monthly)
- What's Included features
- How It Works steps
- FAQ accordion
- Lead capture form
- Embedded calculator modal

### LeaseCalculator (Calculator Hook)

```tsx
import { useLeaseCalculator } from '@/hooks/useLeaseCalculator';

const MyComponent = () => {
  const { inputs, outputs, updateInput, resetCalculator, validPromoCodes } = useLeaseCalculator({
    months: 12,
    monthlyPrice: 7599
  });

  return (
    <div>
      <p>Monthly Due: ₹{outputs.monthlyDue}</p>
      <button onClick={() => updateInput('months', 6)}>
        Switch to 6 months
      </button>
    </div>
  );
};
```

**Input Shape:**
```typescript
{
  months: number;          // Lease duration
  monthlyPrice: number;    // Base monthly price
  promoCode: string;       // Optional promo code
  tradeInCredit: number;   // Trade-in value
  deposit: number;         // Security deposit
  maintenanceAddOn: boolean; // Extended maintenance
  taxRate: number;         // Tax rate (0.18 = 18%)
}
```

**Output Shape:**
```typescript
{
  total: number;           // Base total before tax
  netTotal: number;        // Final amount after all adjustments
  upfrontDue: number;      // Amount due upfront
  monthlyDue: number;      // Monthly payment amount
  monthlyTax: number;      // Tax per month
  totalTax: number;        // Total tax amount
  promoDiscount: number;   // Discount from promo code
}
```

## 📄 PDF Generation

PDF quotes are generated client-side using jsPDF and html2canvas.

```typescript
import { generatePDF } from '@/utils/pdfGenerator';
import { useLeaseCalculator } from '@/hooks/useLeaseCalculator';

const { inputs, outputs } = useLeaseCalculator();

// Generate and download PDF
const handleDownload = () => {
  generatePDF(inputs, outputs);
};
```

**PDF Contents:**
- EcoScoot branded header
- Customer information fields (name, phone, email)
- Lease details summary
- Cost breakdown table
- Payment details (upfront + monthly)
- What's included checklist
- Terms & conditions
- Signature line

**Server-Side PDF Generation:**

To swap to server-side generation (e.g., with Puppeteer):

1. Create API endpoint:
```typescript
// api/generate-pdf.ts
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { inputs, outputs } = req.body;
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Render your PDF template
  await page.setContent(generateHTMLTemplate(inputs, outputs));
  
  const pdf = await page.pdf({ format: 'A4' });
  
  await browser.close();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdf);
}
```

2. Update `pdfGenerator.ts`:
```typescript
export const generatePDF = async (inputs, outputs) => {
  const response = await fetch('/api/generate-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs, outputs })
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lease_quote.pdf';
  a.click();
};
```

## 📊 Sample Calculator Data

### Example 1: 6-month lease

**Inputs:**
```javascript
{
  months: 6,
  monthlyPrice: 7599,
  promoCode: 'FIRST10',
  tradeInCredit: 5000,
  deposit: 5000,
  maintenanceAddOn: false,
  taxRate: 0.18
}
```

**Outputs:**
```javascript
{
  total: 45594,
  promoDiscount: 4559.40,
  netTotal: 48420.83,
  upfrontDue: 5000,
  monthlyDue: 8070.14,
  totalTax: 7386.23
}
```

### Example 2: 12-month lease with add-ons

**Inputs:**
```javascript
{
  months: 12,
  monthlyPrice: 7599,
  promoCode: 'ECO15',
  tradeInCredit: 0,
  deposit: 5000,
  maintenanceAddOn: true,
  taxRate: 0.18
}
```

**Outputs:**
```javascript
{
  total: 97176,
  promoDiscount: 14576.40,
  netTotal: 102467.53,
  upfrontDue: 5000,
  monthlyDue: 8538.96,
  totalTax: 14867.93
}
```

## 🎯 Valid Promo Codes

- `FIRST10` - 10% discount (first-time customers)
- `ECO15` - 15% discount (eco promotion)
- `LULU5` - 5% discount (Lulu Mall event attendees)

## 🌐 Localization

Malayalam translations are provided for key headings and CTAs:

- Hero title: "ഒരു സ്കൂട്ടർ വാടകയ്ക്ക് എടുക്കുക"
- Calculator: "കണക്കുകൂട്ടൽ"
- Monthly: "മാസം"
- What's Included: "ഉൾപ്പെട്ടിരിക്കുന്നത്"

Full translations are available in `public/copy_en_and_ml.txt`

## ♿ Accessibility

### Features Implemented
- ✅ WCAG AA contrast ratios
- ✅ Keyboard navigation support
- ✅ ARIA labels on interactive elements
- ✅ Focus indicators on all controls
- ✅ Semantic HTML structure
- ✅ Screen reader friendly forms

### Testing Checklist
- [ ] Tab through all interactive elements
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Verify color contrast (use Chrome DevTools)
- [ ] Test keyboard shortcuts (Enter, Space, Esc)
- [ ] Verify form validation messages are announced
- [ ] Check focus trap in modal dialogs

**Tools:**
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation
- Chrome Lighthouse - Built-in auditing tool

## 🎨 SCSS Compilation

SCSS modules are compiled by Vite automatically during development and build.

**Build Config:**
```bash
# Development (with HMR)
npm run dev

# Production build (optimized)
npm run build

# Preview production build
npm run preview
```

**Recommended SCSS Structure:**
```scss
// Component SCSS
@import '../styles/variables';
@import '../styles/mixins';

.componentRoot {
  // Use design tokens
  color: hsl(var(--foreground));
  padding: var(--spacing-lg);
  
  // Use mixins for responsive design
  @include mobile {
    padding: var(--spacing-md);
  }
  
  // Nested elements
  .childElement {
    @include flex-center;
  }
}
```

## 🔧 Available Mixins

```scss
// Responsive breakpoints
@include mobile { ... }      // max-width: 767px
@include tablet { ... }      // 768px - 1023px
@include desktop { ... }     // min-width: 1024px

// Flexbox utilities
@include flex-center { ... }
@include flex-between { ... }
@include flex-column { ... }

// Typography
@include heading-1 { ... }
@include heading-2 { ... }
@include body-large { ... }

// Utilities
@include card-shadow { ... }
@include gradient-bg(135deg) { ... }
@include focus-ring { ... }
@include container { ... }
```

## 📱 Responsive Breakpoints

- **Mobile**: 0-767px
- **Tablet**: 768px-1023px
- **Desktop**: 1024px-1279px
- **Large Desktop**: 1280px+

## 🚀 Performance Optimization

### Implemented
- Code splitting with React.lazy()
- Tree-shaking for unused code
- SCSS modules (scoped styles)
- Optimized bundle with Vite
- Lazy loading for images (coming soon)

### Recommendations
1. **Images**: Use WebP/AVIF formats
2. **Fonts**: Preload critical fonts
3. **Critical CSS**: Inline above-the-fold styles
4. **CDN**: Serve static assets from CDN
5. **Caching**: Set appropriate cache headers

## 📧 SEO Meta Tags

Add to `index.html`:

```html
<title>EcoScoot Lease Plans | Electric Scooter Leasing from ₹7,599/mo</title>
<meta name="description" content="Lease an electric scooter with zero upfront cost. Flexible monthly plans include maintenance, insurance & 24/7 support. Calculate your lease today.">
<meta name="keywords" content="electric scooter lease, EV lease India, scooter subscription, zero upfront lease">

<!-- Open Graph -->
<meta property="og:title" content="EcoScoot Lease Plans | Zero Up-front Electric Scooter Leasing">
<meta property="og:description" content="Flexible lease plans starting at ₹7,599/month. Maintenance & insurance included.">
<meta property="og:image" content="/images/social_card.png">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="EcoScoot Lease Plans">
<meta name="twitter:description" content="Lease an electric scooter with zero upfront cost from ₹7,599/month.">
<meta name="twitter:image" content="/images/social_card.png">
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues:
- Open an issue on GitHub
- Email: support@ecoscoot.com
- Call: +91 1800 XXX XXXX

## 🎉 Credits

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [html2canvas](https://html2canvas.hertzen.com/)

---

Made with 💚 by EcoScoot Team
