import { ServiceItem } from '../types';

export const SERVICES: ServiceItem[] = [
  {
    id: 'web-development',
    number: '01',
    title: 'Website Development',
    tagline: 'High-speed, conversion-focused websites that captivate and convert.',
    description: 'We build tailored digital homes for forward-thinking brands. Clean typography, blistering 95+ PageSpeed scores, thoughtful interactive storytelling, and flawless responsive layouts across every phone, tablet, and widescreen.',
    accentColor: '#FF5A00',
    accentBg: '#FFF4E6',
    tags: ['Next.js / Vite', 'Interactive Storytelling', '95+ Lighthouse', 'SEO Engineered'],
    deliverables: [
      'Custom bespoke frontend engineering (no bloated themes)',
      'Sub-second page loading and Core Web Vitals optimization',
      'CMS integration (Sanity, Strapi, or headless WordPress)',
      'Interactive micro-animations & scroll interactions'
    ],
    timeframe: '2 – 3 Days',
    iconName: 'Globe'
  },
  {
    id: 'ecommerce-stores',
    number: '02',
    title: 'E-commerce Store Setup',
    tagline: 'Frictionless checkout flows, custom carts, and stores engineered to sell.',
    description: 'Transform passive visitors into loyal repeat customers. We craft high-converting Shopify and custom commerce storefronts with intuitive product filtration, one-click payment gateways, and recurring subscription funnels.',
    accentColor: '#6B4DFF',
    accentBg: '#F3EFFF',
    tags: ['Shopify Plus', 'Custom Carts', 'Payment Gateways', 'Subscription Models'],
    deliverables: [
      'Tailored storefront architecture & custom product pages',
      'Payment gateway setup (Razorpay, Stripe, UPI, PayPal)',
      'Automated abandoned cart & WhatsApp customer recovery',
      'Inventory, shipping, and taxation setup'
    ],
    timeframe: '1 – 2 Weeks',
    iconName: 'ShoppingBag'
  },
  {
    id: 'web-apps',
    number: '03',
    title: 'Web App Development',
    tagline: 'Custom portals, scalable SaaS MVPs, and complex business software.',
    description: 'From interactive client dashboards and booking engines to multi-tenant SaaS MVPs. We engineer performant web applications with rock-solid security, real-time databases, and slick, intuitive user workflows.',
    accentColor: '#38B6FF',
    accentBg: '#EBF7FF',
    tags: ['Full-Stack React/Next', 'Client Portals & CRMs', 'Real-time Systems', 'Role-based Auth'],
    deliverables: [
      'Bespoke dashboard and portal engineering',
      'API integrations, database schemas, and background jobs',
      'Role-based access control (RBAC) and security safeguards',
      'End-to-end automated testing & scalable cloud hosting'
    ],
    timeframe: '2 – 3 Weeks',
    iconName: 'Cpu'
  },
  {
    id: 'maintenance-support',
    number: '04',
    title: 'Maintenance & Support',
    tagline: 'Zero downtime, continuous speed monitoring, and on-demand feature iterations.',
    description: 'Never worry about broken links, outdated plugins, or security vulnerabilities again. We act as your on-call digital engineering team, keeping your stack fresh, lightning-fast, and hardened around the clock.',
    accentColor: '#27E3A4',
    accentBg: '#E7FAF3',
    tags: ['24/7 Monitoring', 'Security Hardening', 'Speed Audits', 'Priority Requests'],
    deliverables: [
      'Weekly automated security patches & dependency upgrades',
      'Continuous uptime monitoring with under 15m alert dispatch',
      'Monthly speed and Core Web Vitals audits',
      'Dedicated engineering hours for new landing pages and features'
    ],
    timeframe: 'Ongoing Retainer',
    iconName: 'Wrench'
  },
  {
    id: 'video-motion',
    number: '05',
    title: 'Video Editing & Motion Graphics',
    tagline: 'Scroll-stopping motion design, cinematic edits, and viral social assets.',
    description: 'High-retention video production for modern brands. We craft punchy product launch teasers, kinetic typography reels, and YouTube explainers engineered to stop thumbs in their tracks.',
    accentColor: '#FF5DA2',
    accentBg: '#FFF0F7',
    tags: ['Kinetic Typography', 'Product Launch 3D', 'Instagram Reels & Shorts', 'Sound Design'],
    deliverables: [
      'Thumb-stopping motion graphics & 2D/3D brand accents',
      'Platform-native vertical reels and YouTube long-form edits',
      'High-impact kinetic typography & audio design',
      'Batch creation workflows for continuous organic growth'
    ],
    timeframe: '1 – 2 Days',
    iconName: 'Play'
  }
];
