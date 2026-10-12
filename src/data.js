/* =========================================================================
   CENTRAL CONTENT FILE
   -------------------------------------------------------------------------
   Everything on the site is driven from this file. Edit text, links and
   images here — no need to touch any component.

   `null` is treated as "not configured" and is hidden rather than shown
   as a broken link or a fake action.
   ========================================================================= */

export const profile = {
  name: 'Shrujan Mitbavkar',
  firstName: 'Shrujan',

  roleLine: 'Information Technology Engineering Student',
  roleSub: 'Aspiring Creative Developer & Product Designer',

  // Display line used by the hero heading area.
  tagline:
    'Design-minded engineer. Curious builder. Creating digital experiences that connect design and technology.',

  location: 'Ponda, Goa, India',
  email: 'shrujanmitbavkar@gmail.com',

  github: 'https://github.com/shrujan1021',
  linkedin: 'https://linkedin.com/in/shrujan-mitbavkar-a762ba400',

  // The PDF must exist at public/resume.pdf. Buttons render only when it does.
  resumeUrl: '/resume.pdf',

  intro:
    "I'm an Information Technology engineering student exploring product design, frontend development, and practical software projects.",

  socials: [
    { label: 'GitHub', href: 'https://github.com/shrujan1021', handle: 'shrujan1021' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/shrujan-mitbavkar-a762ba400',
      handle: 'shrujan-mitbavkar',
    },
  ],
}

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

/* ============================== HERO ==================================== */

export const hero = {
  // Student-status label shown above the name.
  badge: 'Pursuing B.E. Information Technology · 2023 — Present',

  // Three functional actions.
  ctaPrimary: { label: 'Explore My Work', target: 'work' },
  ctaSecondary: { label: 'About Me', target: 'about' },
  ctaResume: { label: 'Download Resume' },

  // Short caption sitting under the 3D artwork.
  visualCaption: 'Interactive study — every moon is one of my languages',

  // Factual meta strip below the hero. No invented numbers.
  facts: [
    { label: 'Based in', value: 'Ponda, Goa, India' },
    { label: 'Studying', value: 'B.E. Information Technology' },
    { label: 'Focus', value: 'Product design · Frontend · Testing' },
    { label: 'Open to', value: 'Internships & campus placements' },
  ],
}

/* ============================== ABOUT =================================== */

export const about = {
  heading: 'A student of engineering with a designer’s eye.',
  lede: 'Most of what I know came from building things — and from paying attention to why some interfaces feel obvious while others do not.',
  paragraphs: [
    'I am an Information Technology engineering student based in Goa, working towards a Bachelor of Engineering degree. My coursework has given me a grounding in programming, databases and how software is actually built.',
    'Alongside that I have been developing an interest in product design and UI/UX — specifically in understanding how people interact with digital products, and why some interfaces feel obvious while others do not.',
    'Most of what I know has come from building things: a bug tracking system, a reservation system, an embedded medication reminder, and the SupportSense AI internship project. Each one pushed me to think about interface design, frontend implementation, testing, and how the three fit together.',
    'I am not an experienced professional designer, and I would not claim to be. I am a student who is building practical skills through projects, and who is keen to keep learning alongside people who do this well.',
  ],
  points: [
    'Information Technology engineering, with a practical project background',
    'Interested in product design, UI/UX and interface decisions',
    'Comfortable building web applications with HTML, CSS and JavaScript',
    'Exposed to software testing and bug identification',
    'Collaborative — used to working as part of a project team',
    'Eager to learn and take on feedback',
  ],
}

/* ============================ SELECTED WORK ============================= */
/* Four real projects. `thumbnail` points at either a genuine screenshot or,
   where no screenshot exists, an original diagram of that project's real
   architecture — `diagram: true` renders it unframed so it can never be
   mistaken for a live capture. `thumbnail: null` falls back to a typographic
   cover. Nothing here is a fabricated screenshot.                          */

export const projects = [
  {
    id: 'supportsense',
    index: '01',
    name: 'SupportSense AI',
    category: 'AI-assisted support platform · Internship project',
    description:
      'An AI-assisted customer support ticket management system, intended to help teams organise support tickets and assist with classification, priority prediction, conversation summaries and suggested replies.',
    contribution:
      'My contribution covered interface research, screen planning, and the visual conventions used in the product — starting from written UI decisions for the dashboard, ticket queue and ticket detail views.',
    stack: ['React', 'JavaScript', 'REST API', 'Render'],
    thumbnail: '/images/live-dashboard.png',
    alt: 'SupportSense AI dashboard with summary counters and a filterable ticket list.',
    liveUrl: 'https://supportsense-frontend.onrender.com',
    repoUrl: null,
    featured: true,
    hasCaseStudy: true,
  },
  {
    id: 'bug-tracking',
    index: '02',
    name: 'Bug Tracking System',
    category: 'Web application',
    description:
      'A web application for managing bug reports: creating, reading, updating and deleting entries, tracking whether a bug is Open or Closed, and reviewing them on a dashboard that adapts to smaller screens.',
    contribution:
      'Built the CRUD operations, the Open/Closed status tracking, and the responsive dashboard layout.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Firebase Firestore'],
    thumbnail: '/images/bug-tracking-dashboard.png',
    alt: 'Bug Tracking System dashboard listing bug reports with Open and Closed status badges, plus delete and close actions.',
    liveUrl: null,
    repoUrl: null,
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: 'restaurant-reservation',
    index: '03',
    name: 'Restaurant Reservation System',
    category: 'Web application',
    description:
      'A reservation management application covering the basics of storing, updating and removing reservations through a straightforward interface backed by a relational database.',
    contribution:
      'Worked on the reservation management flows and the underlying CRUD operations against MySQL.',
    stack: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    thumbnail: '/images/reservation-flow.png',
    alt: 'Diagram of the Restaurant Reservation System: a reservation table interface flowing into a MySQL relational store through create, read, update and delete operations.',
    diagram: true,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    hasCaseStudy: false,
  },
  {
    id: 'medication-reminder',
    index: '04',
    name: 'Medication Reminder System',
    category: 'Embedded systems · Team project',
    description:
      'A collaborative hardware project built around an Arduino Uno with a buzzer, LED and OLED display, designed to raise time-based medication reminders on the device itself.',
    contribution:
      'Contributed to the time-based alert logic, interaction detection, component integration and testing. This was a team project — I did not build it alone.',
    stack: ['Arduino Uno', 'Buzzer', 'LED', 'OLED display'],
    thumbnail: '/images/medication-reminder.png',
    alt: 'Diagram of the Medication Reminder System: an Arduino Uno wired to an OLED display, an LED and a buzzer, with a scheduled time trigger.',
    diagram: true,
    liveUrl: null,
    repoUrl: null,
    featured: false,
    hasCaseStudy: false,
  },
]

/* ================================ SKILLS ================================ */
/* Exactly the skills listed on the resume. No percentages, no years. */

export const skillGroups = [
  { title: 'Programming', items: ['C', 'C++', 'Java', 'Python'] },
  { title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript'] },
  { title: 'Databases', items: ['MySQL', 'Firebase Firestore'] },
  { title: 'Tools', items: ['Git', 'GitHub', 'Cursor AI', 'Postman', 'Figma'] },
  { title: 'Testing', items: ['Manual testing basics', 'Bug identification'] },
  { title: 'Design', items: ['Basic UI/UX design principles'] },
]

/* ============================== HERO MOONS =============================== */
/* The hero shows a slowly turning planet with two orbital paths. Every moon
   on those paths is one language from the skills above, and each one is
   labelled in the scene.

   `band` decides the orbit: 0 is the inner path, 1 the outer. Both bands
   hold four moons — if you add more than that the labels start to collide,
   so widen the scene in src/three/HeroScene.jsx first.                */

export const orbitMoons = [
  { label: 'JavaScript', band: 0 },
  { label: 'Python', band: 0 },
  { label: 'Java', band: 0 },
  { label: 'C++', band: 0 },
  { label: 'HTML', band: 1 },
  { label: 'CSS', band: 1 },
  { label: 'C', band: 1 },
  { label: 'MySQL', band: 1 },
]

/* ============================== EXPERIENCE ============================== */
/* Organisation and dates are deliberately omitted rather than invented.
   Set `period` to a string (e.g. 'June 2025 — August 2025') to display it. */

export const experience = [
  {
    period: null,
    title: 'SupportSense AI',
    kind: 'Internship project · Collaborative team project',
    intro:
      'Worked on SupportSense AI, an AI-assisted customer support ticket management system built alongside the rest of the project team. The application is deployed and publicly accessible.',
    bullets: [
      'Researched interface patterns from live products covering authentication, dashboards, ticket lists and ticket detail views.',
      'Wrote down the intended UI decision for each screen before designing it, and kept a shared list of reusable components.',
      'Chose the typography, icon set and colour roles used across the interface.',
      'Focused on interface design, usability heuristics and the frontend implementation of the screens I worked on.',
    ],
    note: 'Set `period` and `org` in src/data.js to add your dates and organisation.',
  },
]

/* =============================== EDUCATION ============================== */

export const education = [
  {
    period: '2023 — Present',
    degree: 'Bachelor of Engineering in Information Technology',
    org: 'Shree Rayeshwar Institute of Engineering & Information Technology, Shiroda',
    focus: 'Information Technology',
    status: 'In progress',
  },
]

/* ========================= CERTIFICATIONS =============================== */

export const certifications = [
  {
    kind: 'Competition',
    title: 'Web Designing Competition',
    org: "Institution's Innovation Council",
    year: '2025',
  },
  {
    kind: 'Workshop',
    title: 'ReactJS for Beginners Workshop',
    org: "Institution's Innovation Council",
    year: '2025',
  },
]

/* ========================== DESIGN APPROACH ============================= */

export const approach = [
  {
    n: '01',
    title: 'Understand the problem',
    body: 'Work out what actually needs solving before deciding what it should look like.',
  },
  {
    n: '02',
    title: 'Identify user needs',
    body: 'Consider who is using the product and what they are trying to finish.',
  },
  {
    n: '03',
    title: 'Structure the experience',
    body: 'Map navigation, page relationships and flows so the product stays predictable.',
  },
  {
    n: '04',
    title: 'Explore interface solutions',
    body: 'Sketch several options, compare them, then refine the one that reads clearest.',
  },
  {
    n: '05',
    title: 'Implement and review',
    body: 'Build it, then look at the result honestly against what was intended.',
  },
  {
    n: '06',
    title: 'Improve iteratively',
    body: 'Use what you learn to make the next round of decisions better informed.',
  },
]

/* ================================ CONTACT =============================== */

export const contact = {
  heading: 'Looking for internships and campus opportunities.',
  body: 'If you are hiring for a product design, UI/UX or frontend internship — or you would just like to talk about a project — the fastest way to reach me is by email.',
  preferred: 'Email',
}

/* ============================== FOOTER ================================== */

export const footer = {
  note: 'Designed and built by Shrujan Mitbavkar with React and Vite.',
}

/* =========================================================================
   FEATURED CASE STUDY — SUPPORTSENSE AI
   -------------------------------------------------------------------------
   Intended functionality is described as intended. Implemented functionality
   is described only where it is visible in the deployed application.
   ========================================================================= */

export const caseStudy = {
  tag: 'Featured project · Internship',
  title: 'SupportSense AI',
  subtitle: 'An AI-assisted customer support ticket management system.',

  meta: [
    { label: 'Project type', value: 'AI-assisted ticket platform' },
    { label: 'Context', value: 'Internship team project' },
    { label: 'Platform', value: 'Web application' },
    { label: 'Status', value: 'Deployed · Live' },
  ],

  liveUrl: 'supportsense-frontend.onrender.com',
  liveHref: 'https://supportsense-frontend.onrender.com',

  blocks: [
    {
      id: 'overview',
      n: '01',
      title: 'Project overview',
      type: 'prose',
      paras: [
        'SupportSense AI is an AI-assisted customer support ticket management system. It was built collaboratively during an internship, and the application is deployed and publicly accessible.',
        'It is intended to help support teams organise incoming requests, and to apply AI assistance to classifying tickets, predicting priority, summarising conversations and drafting suggested replies.',
      ],
      callout: {
        title: 'Intended vs. implemented',
        body: 'The screens shown below are from the deployed application. Where this case study describes something the system is "intended" to do, that is a design intent rather than a claim about a measured outcome.',
      },
    },
    {
      id: 'problem',
      n: '02',
      title: 'Problem being addressed',
      type: 'prose',
      paras: [
        'Support requests arrive continuously. Someone has to read each one, work out what it is about, judge how urgent it is, route it to the right team, and then answer it.',
        'When that sorting is done entirely by hand it takes time, and it is hard to see at a glance which requests matter most. The project set out to explore a ticketing system that carries part of that sorting automatically while leaving the final decision with the support agent.',
      ],
      aside:
        'This is the premise the system was designed around. It is not the outcome of a formal user research study.',
    },
    {
      id: 'users',
      n: '03',
      title: 'Intended users',
      type: 'cards',
      items: [
        {
          title: 'Support agents',
          body: 'Triage incoming tickets, reply to customers and keep track of what is still open.',
        },
        {
          title: 'Support and team leads',
          body: 'See how requests are distributed, route work to the right department and watch priorities.',
        },
        {
          title: 'Customers',
          body: 'Raise a request in everyday language without having to pick a category themselves.',
        },
      ],
      aside: 'These are the users the system is designed for, defined by the project itself.',
    },
    {
      id: 'role',
      n: '04',
      title: 'My role and contribution',
      type: 'role',
      team: {
        title: 'Team context',
        paras: [
          'SupportSense AI was a collaborative internship project rather than individual work. Everything described below is my own contribution; the application as a whole was built by the team.',
        ],
      },
      mine: {
        title: 'What I worked on',
        items: [
          {
            label: 'Interface research',
            body: 'Collected and compared interface patterns from live products, covering authentication, dashboards, ticket lists and ticket detail views.',
          },
          {
            label: 'Screen planning',
            body: 'Wrote down the intended UI decision for each screen before designing it, and kept a shared list of reusable components.',
          },
          {
            label: 'Visual conventions',
            body: 'Selected the typography, icon set and colour roles used across the interface.',
          },
          {
            label: 'Interface and usability work',
            body: 'Focused on layout, hierarchy and usability heuristics for the screens I was responsible for.',
          },
        ],
      },
    },
    {
      id: 'process',
      n: '05',
      title: 'Design process',
      type: 'steps',
      items: [
        {
          n: '01',
          title: 'Reference research',
          body: 'Studied live products to catalogue interface patterns that already solve each screen.',
        },
        {
          n: '02',
          title: 'Pattern synthesis',
          body: 'Turned observation notes into an explicit UI decision for every screen.',
        },
        {
          n: '03',
          title: 'Visual conventions',
          body: 'Set typography, icons and a blue-led palette, reserving green, orange and red for status only.',
        },
        {
          n: '04',
          title: 'Screen planning',
          body: 'Defined the screens to design and the components to reuse between them.',
        },
        {
          n: '05',
          title: 'Build and review',
          body: 'Worked with the team to implement the screens, refining them against the intended decisions.',
        },
      ],
      aside:
        'This describes the workflow I followed for the interface work I contributed. It is not a claim that every stage of a full design process was completed on this project.',
    },
    {
      id: 'ia',
      n: '06',
      title: 'Screens and user flows',
      type: 'ia',
      items: [
        {
          title: 'Application shell',
          body: 'A persistent top bar with search, a view switcher and account access, so navigation stays predictable across pages.',
        },
        {
          title: 'Dashboard',
          body: 'Summary counters for open, in-progress, AI-triaged and resolved tickets, above a filterable ticket list.',
        },
        {
          title: 'Ticket queue',
          body: 'A searchable directory of tickets, with sentiment, priority and status visible on each row.',
        },
        {
          title: 'New ticket',
          body: 'Two routes to raise a request: an AI concierge that turns plain language into a structured ticket, and a classic manual form.',
        },
        {
          title: 'Ticket detail',
          body: 'Conversation, reply box, ticket properties and an AI recommendation in a single view.',
        },
        {
          title: 'Supporting areas',
          body: 'Departments, knowledge base and profile pages.',
        },
      ],
      flow: 'Raise a request → AI-assisted classification and routing → agent review → reply → resolved.',
    },
    {
      id: 'ui',
      n: '07',
      title: 'Interface and usability decisions',
      type: 'decisions',
      intro:
        'Each screen started as a written decision rather than a canvas. These are the calls behind the interface.',
      items: [
        {
          screen: 'Login',
          note: 'Kept to the essentials — email, password, remember me, forgot password and a visibility toggle. Auth screens gain nothing from decoration.',
          image: '/images/login-reference-3.png',
        },
        {
          screen: 'Dashboard',
          note: 'Summary cards answer "what is urgent right now?" and sit above the ticket list, so the first read is about priority rather than volume.',
          image: '/images/dashboard-reference.png',
        },
        {
          screen: 'Create ticket',
          note: 'One clean form with obvious required fields and a single primary action — plus the AI concierge as a lower-effort alternative.',
          image: '/images/create-ticket-reference.png',
        },
        {
          screen: 'Ticket detail',
          note: 'Two areas: the conversation and reply on one side, ticket properties and the AI panel on the other, so agents never lose context.',
          image: '/images/ticket-details-ui.png',
        },
        {
          screen: 'AI output',
          note: 'AI suggestions stay editable rather than send-only. The agent keeps the final decision on category, priority and wording.',
          image: '/images/ai-panel-reference.png',
        },
        {
          screen: 'Visual conventions',
          note: 'Inter for type, Lucide for outline icons, and a blue-led palette where green, orange and red are reserved strictly for status.',
          image: '/images/color-palette.png',
        },
      ],
    },
    {
      id: 'screens',
      n: '08',
      title: 'Important screens',
      type: 'gallery',
      intro: 'Screens captured from the deployed application.',
      shots: [
        {
          title: 'Dashboard',
          note: 'Summary counters and a filtered list give an immediate read on queue status.',
          image: '/images/live-dashboard.png',
          alt: 'SupportSense AI dashboard with summary cards for open inquiries, tickets in progress, AI triage and resolved tickets.',
        },
        {
          title: 'Ticket queue',
          note: 'Sentiment, priority and status stay visible on every row, so triage does not require opening each ticket.',
          image: '/images/live-ticket-queue.png',
          alt: 'SupportSense AI ticket queue listing tickets with sentiment, priority, status and date columns.',
        },
        {
          title: 'Ticket creation',
          note: 'The AI concierge turns an everyday description into a structured ticket, with a manual form kept one tab away.',
          image: '/images/live-new-ticket.png',
          alt: 'SupportSense AI create-ticket page with an AI concierge chat and a classic manual form option.',
        },
        {
          title: 'Ticket detail',
          note: 'Conversation, editable reply, ticket properties and an AI recommendation that the agent approves.',
          image: '/images/live-ticket-detail.png',
          alt: 'SupportSense AI ticket detail page showing an AI timeline summary, conversation thread, reply editor with tone options and an AI recommended department.',
        },
      ],
    },
    {
      id: 'technical',
      n: '09',
      title: 'Technical context',
      type: 'prose',
      paras: [
        'The product runs as a React frontend deployed on Render, communicating with a backend service over REST.',
        'Because several people were building on the same product, the written UI decisions served a practical purpose: they gave the team something concrete to build against and to refer back to when a screen needed changing.',
      ],
    },
    {
      id: 'challenges',
      n: '10',
      title: 'Challenges and lessons learned',
      type: 'notes',
      items: [
        {
          title: 'Designing for a dense screen',
          body: 'The ticket detail view has to hold a conversation, an editable reply, ticket properties and an AI recommendation at the same time. Stopping those four things from competing with each other was the hardest layout problem on the project, and the split-panel arrangement was the answer I kept coming back to.',
        },
        {
          title: 'Keeping AI output under human control',
          body: 'It was tempting to let the AI suggestions be one-click actions. Deciding instead to keep category, priority and wording editable meant designing the panel as a proposal rather than a command — a small change in framing that changes the whole interaction.',
        },
        {
          title: 'Writing decisions down before designing',
          body: 'Starting each screen with a sentence explaining what it needed to achieve made the design work faster and more consistent. It also made disagreements cheaper to resolve, because the argument could happen on paper before any pixels were placed.',
        },
      ],
    },
    {
      id: 'outcome',
      n: '11',
      title: 'Outcome and future improvements',
      type: 'outcome',
      summary: [
        'The application is deployed and publicly accessible, covering a dashboard, a ticket queue, AI-assisted ticket creation and a ticket detail view. It is open to view at the link above.',
        'This was my first experience of interface work on a real, shared product. The most useful lesson was that a design decision is only finished once someone else can build it from your description.',
      ],
      future: [
        'Make the AI suggestions explainable — showing why a category or priority was chosen, rather than only the result.',
        'Improve the empty and error states, which carry a lot of weight in a tool people open dozens of times a day.',
        'Add keyboard shortcuts for the common triage actions, since agents repeat them constantly.',
        'Test the ticket queue with real data volume to check how the table behaves with hundreds of rows.',
      ],
    },
  ],
}
