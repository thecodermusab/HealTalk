export interface Author {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string;
}

export interface BlogPostContent {
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  value: string | string[];
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string; // Added subtitle
  excerpt: string;
  imageUrl: string; // Used for listing and as default hero photo
  category?: string;
  author: string | Author; // Updated to support detailed author object
  date: string;
  heroType?: 'illustration' | 'photo'; // Added hero type
  heroIllustration?: string;
  content?: BlogPostContent[]; // Added content blocks
  theme?: 'lilac' | 'green' | 'cream';
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Venture Capital in Scandinavia",
    subtitle: "Three shifts are rewriting the Nordic scale-up playbook: agentic AI, lean 10x teams, and resilience tech. Here's what Cecilie Skjong is predicting as we are heading into 2026.",
    excerpt: "Three shifts are rewriting the Nordic scale-up playbook: agentic AI, lean 10x teams, and resilience tech.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    category: "Trends",
    date: "Jan 28, 2026",
    heroType: "illustration",
    theme: "lilac",
    author: {
      name: "Cecilie Skjong",
      role: "Principal",
      bio: "Cecilie is a Principal at Amby, specializing in executive search for high-growth tech companies across the Nordics.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2069&auto=format&fit=crop",
      linkedinUrl: "#"
    },
    content: [
      { type: 'heading', value: "The rise of the 10x team" },
      { type: 'paragraph', value: "The era of hiring headcount for headcount's sake is over. In 2026, we are seeing a definitive shift towards lean, high-performing teams leveraging agentic AI to multiply their output." },
      { type: 'paragraph', value: "Investors are no longer impressed by headcount growth. They want to see revenue per employee, and they want to see it scaling non-linearly." },
      { type: 'quote', value: "Efficiency is the new growth metric. It's not about how many people you have, it's about what your people can do." },
      { type: 'heading', value: "Resilience Tech takes center stage" },
      { type: 'paragraph', value: "With geopolitical instability and supply chain disruptions becoming the new normal, technology that builds resilience—whether in energy, defense, or logistics—is attracting the lion's share of late-stage capital." },
      { type: 'list', value: [
        "Defense technology and dual-use applications",
        "Clean energy infrastructure and grid optimization",
        "Supply chain visibility and predictive logistics",
        "Cybersecurity and sovereign cloud solutions"
      ]}
    ]
  },
  {
    id: "2",
    title: "The Essential HR Guide for Startups (Without Complicating It)",
    subtitle: "How to build 'just enough HR' for startup companies under 50 employees.",
    excerpt: "How to build \"just enough HR\" for startup companies under 50 employees.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
    category: "Startups",
    date: "Jan 10, 2026",
    heroType: "photo",
    author: {
      name: "Lars Jensen",
      role: "Head of People",
      bio: "Lars helps startups build scalable people operations from day one.",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
      linkedinUrl: "#"
    },
    content: [
      { type: 'heading', value: "Start simple, scale later" },
      { type: 'paragraph', value: "Most startups overcomplicate HR. They implement heavy enterprise systems when they really just need a solid employment contract and a clear way to pay people." },
      { type: 'paragraph', value: "The goal of early-stage HR is not compliance for compliance's sake, but to remove friction so your team can focus on building." },
      { type: 'heading', value: "The 3 pillars of startup HR" },
      { type: 'list', value: [
        "Contracts: Make them clear, fair, and legally sound.",
        "Payroll: Automate it. Don't do it manually.",
        "Culture: Define it by actions, not wall posters."
      ]},
      { type: 'paragraph', value: "If you get these three right, you're ahead of 90% of companies their size." }
    ]
  },
  // Default fallback for other posts to prevent crashes
  {
    id: "3",
    title: "Don't Panic: Your AI Hire Playbook",
    excerpt: "This playbook is your guide to navigating AI hires with clarity, realism, and confidence.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2069&auto=format&fit=crop",
    category: "Guides",
    date: "Jan 15, 2026",
    heroType: "photo",
    author: "Amby Team", // Fallback string author will need handling or updating
  },
   {
    id: "4",
    title: "Feriepenger Guide for Employers (2025)",
    excerpt: "Managing feriepenger should be straightforward, but for most employers, it rarely is.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
    category: "Compliance",
    date: "Dec 22, 2025",
    heroType: "photo",
    author: "HR Team",
  },
  {
    id: "5",
    title: "Modern Recruitment Metrics",
    excerpt: "Why traditional KPIs fail and what to measure instead.",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
    category: "Metrics",
    date: "Dec 15, 2025",
    heroType: "photo",
    author: "Sarah O'Connor",
  },
  {
    id: "6",
    title: "How to Build a Hiring Roadmap",
    excerpt: "A strong hiring roadmap brings structure to the chaos.",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    category: "Strategy",
    date: "Dec 01, 2025",
    heroType: "photo",
    author: "Marcus Doe",
  },
  {
    id: "7",
    title: "The Psychology of Remote Leadership",
    excerpt: "Leading from a distance requires a shift in mindset.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
    category: "Leadership",
    date: "Nov 28, 2025",
    heroType: "photo",
    author: "Dr. Emily Chen",
  },
  {
    id: "8",
    title: "Onboarding 2.0: Beyond the Welcome Kit",
    excerpt: "Why the first 90 days determine employee retention for years to come.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop",
    category: "Culture",
    date: "Nov 15, 2025",
    heroType: "photo",
    author: "Amby Team",
  },
  {
    id: "9",
    title: "Diversity is Not a Checkbox",
    excerpt: "Moving beyond quotas to build genuinely inclusive environments.",
    imageUrl: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=2074&auto=format&fit=crop",
    category: "DEI",
    date: "Nov 10, 2025",
    heroType: "photo",
    author: "Jessica Alba",
  }, 
];
