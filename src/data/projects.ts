import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'career-growth-tribe',
    name: 'Career Growth Tribe',
    year: '2025',
    client: 'Career Growth Tribe Ltd.',
    category: 'Web apps',
    tagline: 'Modern digital ecosystem & automated member acquisition engine',
    description: 'An all-in-one learning and talent community platform built with custom membership logic, cohort management, automated onboarding workflows, and frictionless payment handling.',
    deliverables: ['Custom Web App', 'Cohort Engine', 'WhatsApp Automation', 'Stripe & Razorpay Integration'],
    metrics: [
      { label: 'Conversion Lift', value: '+42%' },
      { label: 'Active Learners', value: '18,000+' },
      { label: 'Page Load Speed', value: '0.4s' }
    ],
    accentColor: '#FF5A00',
    liveUrl: 'https://careergrowthtribe.com',
    tags: ['Next.js', 'Tailwind CSS', 'Automation', 'Supabase'],
    challenge: 'The client was manually juggling Discord onboarding, course unlock links, and payment proofs across WhatsApp DMs, causing high drop-off rates and delayed activations.',
    solution: 'Cretify architected a bespoke web platform uniting automated tier verification, instant course onboarding, interactive progress tracking, and dynamic community leaderboards.',
    result: 'Reduced manual administrative overhead by 88% while doubling cohort checkout completion speed.',
    gradient: 'from-[#FF5A00]/20 via-[#FF5DA2]/15 to-[#6B4DFF]/20',
    mockupType: 'dashboard'
  },
  {
    id: 'nexus-capital',
    name: 'Nexus Capital Systems',
    year: '2025',
    client: 'Nexus Capital Partners',
    category: 'Web apps',
    tagline: 'Institutional wealth management portal with real-time portfolio tracking',
    description: 'High-precision fintech web application providing institutional investors with real-time asset valuation, multi-currency reporting, and interactive data visualizations.',
    deliverables: ['Fintech Web App', 'Interactive Charts', 'Client Portal', 'Real-Time Sync'],
    metrics: [
      { label: 'Assets Monitored', value: '$84M+' },
      { label: 'Latency', value: '<60ms' },
      { label: 'Lighthouse Score', value: '99/100' }
    ],
    accentColor: '#6B4DFF',
    liveUrl: 'https://nexuscapital.example.com',
    tags: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS', 'D3.js'],
    challenge: 'Legacy PDF reports and slow Excel sheets left high-net-worth clients waiting days for quarterly reconciliations and visual portfolio updates.',
    solution: 'Engineered a modern web portal featuring sub-second data streaming, bank-grade encryption, and custom financial charting modules.',
    result: 'Client retention reached 99.4% and advisors reported saving 12 hours weekly per fund manager.',
    gradient: 'from-[#6B4DFF]/25 via-[#38B6FF]/20 to-[#27E3A4]/15',
    mockupType: 'dashboard'
  },
  {
    id: 'lumina-coffee',
    name: 'Lumina Coffee Roasters',
    year: '2024',
    client: 'Lumina Craft Beans Co.',
    category: 'E-commerce',
    tagline: 'High-conversion e-commerce storefront for an artisanal roaster',
    description: 'Playful yet luxurious online coffee boutique featuring custom roast subscription builders, bean taste profiles, and lightning-fast mobile checkouts.',
    deliverables: ['Shopify Custom Headless Store', 'Subscription Engine', 'Taste Quiz', 'Mobile-First UI'],
    metrics: [
      { label: 'Checkout Conversion', value: '4.8%' },
      { label: 'Subscription Retention', value: '76%' },
      { label: 'AOV Growth', value: '+34%' }
    ],
    accentColor: '#FF5A00',
    liveUrl: 'https://luminacoffee.example.com',
    tags: ['Shopify Plus', 'Tailwind CSS', 'Framer Motion', 'Stripe'],
    challenge: 'Artisanal roasters often suffer from template-looking online shops that fail to evoke the aroma, craft, and premium feel of specialty beans.',
    solution: 'Designed an interactive flavor wheel and custom bean quiz that guides newcomers straight to their ideal roast, bundled with recurring monthly subscriptions.',
    result: 'Drove a 140% increase in repeat subscription orders within 90 days of the new storefront launch.',
    gradient: 'from-[#FFC72C]/25 via-[#FF5A00]/20 to-[#FF5DA2]/15',
    mockupType: 'browser'
  },
  {
    id: 'aether-spatial',
    name: 'Aether Spatial Design',
    year: '2024',
    client: 'Aether Architecture Studio',
    category: 'Branding',
    tagline: 'Architectural brand identity and immersive spatial design portfolio',
    description: 'An editorial, typography-forward digital gallery capturing physical architecture, museum installations, and ambient lighting concepts with cinematic scroll reveals.',
    deliverables: ['Brand Identity', 'Custom Typography', 'Editorial Portfolio', 'Interactive Blueprint View'],
    metrics: [
      { label: 'Award Recognitions', value: '2 Wins' },
      { label: 'Avg Session Duration', value: '3m 48s' },
      { label: 'Inbound Inquiries', value: '3.2x' }
    ],
    accentColor: '#14110F',
    liveUrl: 'https://aetherspatial.example.com',
    tags: ['Branding', 'Design System', 'Three.js', 'React'],
    challenge: 'Aether needed their digital presence to match the exact tactile nuance, restraint, and architectural gravitas of their physical spaces.',
    solution: 'Crafted a bespoke visual identity and dual-mode blueprint viewer with smooth page transitions, high-contrast typography, and smooth kinetic micro-interactions.',
    result: 'Secured three landmark commercial renovation bids directly attributed to the new portfolio.',
    gradient: 'from-[#14110F]/30 via-[#6B4DFF]/20 to-[#38B6FF]/15',
    mockupType: 'editorial'
  },
  {
    id: 'pulse-healthcare',
    name: 'Pulse Healthcare Suite',
    year: '2025',
    client: 'Pulse MedTech Group',
    category: 'Web apps',
    tagline: 'Patient health monitoring & diagnostic telehealth interface',
    description: 'Clean, approachable healthcare management system connecting remote specialists with chronic care patients through intuitive vital tracking and video check-ins.',
    deliverables: ['Telehealth UI/UX', 'HIPAA-Compliant Patient Portal', 'Vital Signs Hub', 'Doctor Dashboard'],
    metrics: [
      { label: 'Active Doctors', value: '450+' },
      { label: 'Consultation Rating', value: '4.9/5' },
      { label: 'Accessibility', value: 'WCAG AAA' }
    ],
    accentColor: '#27E3A4',
    liveUrl: 'https://pulsemed.example.com',
    tags: ['React', 'TypeScript', 'WebRTC', 'Tailwind CSS'],
    challenge: 'Medical interfaces are notoriously cluttered, intimidating elderly patients and slowing doctors down with convoluted menus.',
    solution: 'Designed high-contrast, zero-cognitive-overload screens with large tap targets, audio-guided check-ins, and one-tap video consultations.',
    result: 'Reduced patient onboarding drop-offs from 35% down to under 4%, winning staff praise for clarity.',
    gradient: 'from-[#27E3A4]/25 via-[#38B6FF]/20 to-[#6B4DFF]/15',
    mockupType: 'dashboard'
  },
  {
    id: 'hyperion-logistics',
    name: 'Hyperion Logistics Engine',
    year: '2025',
    client: 'Hyperion Global Freight',
    category: 'AI Automation',
    tagline: 'AI automation, supply chain orchestration & dispatch intelligence',
    description: 'Automated fleet dispatch, live route optimization, and proactive customs document parser delivering real-time shipment transparency across cross-border freight.',
    deliverables: ['Dispatch Automation', 'Customs Document OCR', 'Route Tracker', 'Customer SMS Updates'],
    metrics: [
      { label: 'Dispatch Time Cut', value: '70%' },
      { label: 'Daily Shipments', value: '14,000+' },
      { label: 'Fuel Saved', value: '18%' }
    ],
    accentColor: '#38B6FF',
    liveUrl: 'https://hyperion.example.com',
    tags: ['AI Pipelines', 'Python Backend', 'React Dashboard', 'Tailwind CSS'],
    challenge: 'Cross-border logistics teams spent hundreds of man-hours each week retyping bill-of-lading documents and recalculating optimal truck routes.',
    solution: 'Built automated OCR pipelines with instant OCR validation, live GPS tracking hooks, and customer notification webhooks.',
    result: 'Cut average dispatch lag from 4 hours down to under 12 minutes with automated exception handling.',
    gradient: 'from-[#38B6FF]/25 via-[#27E3A4]/20 to-[#FFC72C]/15',
    mockupType: 'dashboard'
  }
];
