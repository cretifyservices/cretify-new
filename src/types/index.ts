export interface Project {
  id: string;
  name: string;
  year: string;
  client: string;
  category: 'E-commerce' | 'Web apps' | 'Landing pages' | 'Branding' | 'Video' | 'AI Automation';
  tagline: string;
  description: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  accentColor: string;
  liveUrl?: string;
  tags: string[];
  challenge: string;
  solution: string;
  result: string;
  gradient: string;
  mockupType: 'browser' | 'mobile' | 'dashboard' | 'editorial';
  imageUrl?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  services: string[];
  notes?: string;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  accentBg: string;
  tags: string[];
  deliverables: string[];
  timeframe: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  channel: 'WhatsApp' | 'Instagram' | 'Telegram';
  time: string;
  message: string;
  rating: number;
  avatarColor: string;
}

export interface ConfiguratorState {
  type: 'Business site' | 'Online store' | 'Web app';
  vibe: 'Bold' | 'Minimal' | 'Playful';
  addOns: string[];
}
