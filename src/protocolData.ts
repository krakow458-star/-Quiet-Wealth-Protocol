export interface ProtocolDay {
  day: number;
  title: string;
  mission: string;
  theory: string;
  tip: string;
  command: string;
  assistantHint: string;
  steps: { 
    name: string; 
    desc: string;
    studyContent?: string;
    task?: string;
  }[];
  timeline: { time: string; action: string }[];
  rewards: { 
    capital: number; 
    focus: number; 
    vitality: number; 
    sovereignty: number;
  };
  verificationGate?: {
    required: boolean;
    type: 'registration' | 'bonus' | 'exam';
    title: string;
    desc: string;
    checks: string[];
    cta?: { text: string; link?: string };
    confirmText: string;
    bonusReward?: Partial<ProtocolDay['rewards']>;
  };
}

export const AFFILIATE_LINKS = {
  vpn: "https://nordvpn.sjv.io/9VezoE",
  ledger: "https://shop.ledger.com",
  dataRemoval: "https://goto.mydataremoval.com/n4R3jA",
  nexo: "https://nexo.sjv.io/YV1PNP"
};

export const LOCALE_CONFIG: Record<string, { currency: string, label: string }> = {
  US: { currency: '$', label: 'USA' },
  CA: { currency: 'C$', label: 'CANADA' },
  GB: { currency: '£', label: 'UK' },
  EU: { currency: '€', label: 'EU' }
};

export const PROTOCOL_DAYS: ProtocolDay[] = [
  // PHASE I: THE LEAK HUNT
  {
    day: 1,
    title: "THE SILENT AUDIT",
    mission: "Find exactly where your money is bleeding. Awareness is the first step of Sovereignty.",
    theory: "90% of people are financial noise. You must identify the leak to build the fortress.",
    tip: "Every {currency}1 unrecorded is 1 minute of life stolen by the system.",
    command: "AUDIT",
    assistantHint: "Check your digital banking export for 'recurring' flags.",
    steps: [
      { 
        name: "DATA EXTRACTION", 
        desc: "Download last 3 months of bank statements.",
        studyContent: "The Architect's first rule: You cannot optimize what you do not measure. \n\nMost modern spending is designed to be invisible. From Uber charges that 'just happen' to coffee runs that feel like small change, your capital is leaking through thousands of tiny holes. \n\nYour task is to gather raw data. Numbers don't lie. Emotions do.",
        task: "Use a desktop computer to download PDF or CSV statements from every account you own. No exceptions."
      },
      { 
        name: "STATIC IDENTIFICATION", 
        desc: "Highlight every non-essential expense.",
        studyContent: "Static is any expenditure that does not buy you time, health, or sovereign capital. \n\n1. Survival: Housing, basic fuel, utilities.\n2. Growth: Books, high-quality tools, critical skills.\n3. Noise: UberEats, impulse clothes, streaming services you don't watch.\n\nYou are hunting for NOISE.",
        task: "Use the Auditor Tool below to log at least 15 items from your last month. Identify the noise percentage."
      }
    ],
    timeline: [{ time: "08:00", action: "Seeding: Audit Mode" }, { time: "20:00", action: "Sunset: Leak Map Ready" }],
    rewards: { capital: 5, focus: 10, vitality: 0, sovereignty: 5 }
  },
  {
    day: 2,
    title: "THE $50 RULE",
    mission: "Install the first barrier against impulse. Delay the dopamine loop.",
    theory: "Impulse is the enemy of strategy. If it's over {currency}50, it waits 24 hours.",
    tip: "The system wants you to react. Silence teaches you to respond.",
    command: "BARRIER",
    assistantHint: "Write down any item you wanted today but didn't buy.",
    steps: [
      { 
        name: "REACTION KILLER", 
        desc: "Cancel one 'want' purchase today.",
        studyContent: "The dopamine loop is your greatest architect. Every 'Quick Buy' button is a trap designed by engineers more talented than you. \n\nTo break the cycle, you must introduce friction. Friction is the friend of Sovereignty.",
        task: "Identify a specific item you were going to buy. Open the tab, look at it, and close it. Feel the resistance."
      },
      { 
        name: "WAITLIST PROTOCOL", 
        desc: "Start a list for items > {currency}50.",
        studyContent: "The 24-hour rule is simple: If it costs more than {currency}50, it must stay in a 'Holding Cell' for 24 hours. \n\n70% of impulse desires vanish after a single sleep cycle. This is how you reclaim {currency}10,000+ a year.",
        task: "Create a note on your phone titled 'HOLDING CELL'. Log your first entry today."
      }
    ],
    timeline: [{ time: "12:00", action: "Impulse Filter Active" }],
    rewards: { capital: 10, focus: 5, vitality: 0, sovereignty: 5 }
  },
  {
    day: 3,
    title: "SUBSCRIPTION EXECUTION",
    mission: "Kill the parasites stealing your freedom. Cut the ghost lines.",
    theory: "A subscription is a lease on your future capital. Own your tools, don't rent them.",
    tip: "If you haven't used it for 30 days, it's a parasite.",
    command: "EXECUTION",
    assistantHint: "Check your Apple/Google Store active subscriptions.",
    steps: [
      { 
        name: "PARASITE SCAN", 
        desc: "List every monthly digital recurring bill.",
        studyContent: "Modern slavery is digital. A {currency}15/month subscription is a $180/year tax. Multiply that by 10 apps, and you are working 3 days a month just to pay for things you don't even own.",
        task: "Go to your Settings -> Apple ID/Google Play -> Subscriptions. Take a screenshot."
      },
      { 
        name: "TERMINATION", 
        desc: "Kill at least two services immediately.",
        studyContent: "The system relies on 'the friction of cancellation'. Be ruthless. You can always resubscribe later, but you rarely will.",
        task: "Select two services. Cancel them now. No exceptions. Reclaim your capital."
      }
    ],
    timeline: [{ time: "10:00", action: "Blade Protocol: Active" }],
    rewards: { capital: 20, focus: 10, vitality: 0, sovereignty: 10 }
  },
  {
    day: 4,
    title: "LIFESTYLE FREEZE",
    mission: "Lock your base. Build the moat. Stop the expansion.",
    theory: "As income grows, noise grows. Freeze your lifestyle to widen the gap.",
    tip: "You can't build a tower on a shifting foundation.",
    command: "FREEZE",
    assistantHint: "Commit to current spending levels for next 6 months.",
    steps: [
      { name: "BASE DEFINITION", desc: "Calculate your absolute 'Survival Minimum'." },
      { name: "MOAT WIDENING", desc: "Define your 'Surplus' as 'Fortress Capital'." }
    ],
    timeline: [{ time: "18:00", action: "Foundation Lockdown" }],
    rewards: { capital: 5, focus: 5, vitality: 10, sovereignty: 15 }
  },
  {
    day: 5,
    title: "SIGNAL VISIBILITY",
    mission: "Determine if the world can see your digital shadow. Face the leakage.",
    theory: "Your IP is your digital home address. Without encryption, you are walking naked in the grid.",
    tip: "A visible IP is a target list for the system's tracking nodes.",
    command: "SCAN",
    assistantHint: "Run the exposure scan to see your current coordination data.",
    steps: [
      { 
        name: "PERIMETER SCAN", 
        desc: "Execute the IP visibility check.",
        studyContent: "Websites use your IP to adjust prices, track your location, and profile your habits. This data is sold to the highest bidder in the data-broker wars. \n\nBefore you can build a fortress, you must see where the walls are missing.",
        task: "Use the IP Leak Test tool below. Verify your current visible coordination."
      },
      { 
        name: "CLOAKING PROTOCOL", 
        desc: "Identify masking solutions.",
        studyContent: "Masking your signal is non-negotiable. Encryption is the only way to move through the network without being indexed.",
        task: "Verify that you understand how to hide your IP. Prepare for total invisibility."
      }
    ],
    timeline: [{ time: "15:00", action: "Perimeter Scan Active" }],
    rewards: { capital: 0, focus: 20, vitality: 0, sovereignty: 10 },
    verificationGate: {
      required: true,
      type: 'registration',
      title: "PROTOCOL REGISTRATION",
      desc: "To access Stage 02 (Days 6-30), you must register your sovereign unit and confirm your perimeter scan results.",
      checks: ["IP Scan Data Verified", "Sovereign Unit Identity Confirmed"],
      cta: { text: "EXECUTE VPN REGISTRATION TOOL", link: AFFILIATE_LINKS.vpn },
      confirmText: "Registration Complete"
    }
  },
  {
    day: 11,
    title: "PRIVACY LAYER",
    mission: "Make your financial intentions invisible. Cloak your assets.",
    theory: "Wealth is targeted by noise. Privacy is the ultimate armor.",
    tip: "Silent wealth is safe wealth.",
    command: "CLOAK",
    assistantHint: "Look into anonymous spending or separate accounts.",
    steps: [
      { name: "VPN ACTIVATION", desc: "Route financial traffic through encrypted nodes." },
      { name: "DIGITAL SHADOW", desc: "Audit social media for financial markers." }
    ],
    timeline: [{ time: "11:00", action: "Privacy Shield Pulse" }],
    rewards: { capital: -5, focus: 15, vitality: 0, sovereignty: 25 },
    verificationGate: {
      required: true,
      type: 'bonus',
      title: "PRIVACY DRILL",
      desc: "Confirm your IP is masked and trackers are blocked.",
      checks: ["IP anonymized", "Browser fingerprint unique"],
      cta: { text: "RUN PERIMETER SECRECY TOOL", link: AFFILIATE_LINKS.vpn },
      confirmText: "Shadow Mode Active",
      bonusReward: { sovereignty: 15 }
    }
  },
  {
    day: 10,
    title: "PHASE I: TOTAL ASSET MAPPING",
    mission: "Visualize the empire. An unmapped asset is a lost asset.",
    theory: "Wealth is not made, it is engineered. You must know your exact coordinates to plot an escape velocity.",
    tip: "You cannot control what you do not measure.",
    command: "CALCULATE",
    assistantHint: "Every cent counts. Even the loose change. Count your liabilities too.",
    steps: [
      { name: "THE GREAT INVENTORY", desc: "List every account, crypto wallet, and hard asset.", studyContent: "Most people are terrified to look at their bank accounts. \n\nThe Sovereign looks the monster in the eye and commands it.", task: "Open a spreadsheet. List everything." },
      { name: "DEBT ANNIHILATION PLAN", desc: "Assess liabilities and mark the highest interest debt for execution.", studyContent: "Debt is a tax on your future energy. It is a leash.", task: "Calculate exactly how much of your life force (hours worked) goes to paying interest." }
    ],
    timeline: [
      { time: "05:00", action: "Financial Recon" },
      { time: "18:00", action: "Balance Sheet Compiled" }
    ],
    rewards: { capital: 0, focus: 30, vitality: 0, sovereignty: 50 },
    verificationGate: {
      required: true,
      type: 'registration',
      title: "MILESTONE I: THE ARCHITECT",
      desc: "You have survived 10 days of the silent code. You are no longer a consumer. Confirm your financial mapping is complete to access Stage II.",
      checks: ["All Assets Mapped", "All Liabilities Sighted", "Consumer Mindset Eradicated"],
      cta: { text: "INITIALIZE WEALTH DASHBOARD", link: AFFILIATE_LINKS.vpn },
      confirmText: "Phase I Complete -> Enter Stage II"
    }
  },
  {
    day: 20,
    title: "PHASE II: THE FORTRESS",
    mission: "Convert noise into hard, untouchable signal.",
    theory: "Fiat currency is a melting ice cube. The system depends on your wealth dissolving. You must build a freezer.",
    tip: "Interest is the inverse of effort. Make it work for you.",
    command: "VAULT",
    assistantHint: "Look into high-yield, decentralized, or offshore secure vaults.",
    steps: [
      { name: "YIELD INFILTRATION", desc: "Calculate lost yield on stagnant capital.", studyContent: "Traditional banks offer 0.01%. They lend your money at 7%. They are stealing your energy.\n\nSovereign yields start at 5% and scale.", task: "Identify one pile of stagnant capital and plan its relocation." },
      { name: "THE OFFSHORE MINDSET", desc: "Realize that borders are illusions for capital.", studyContent: "The ultra-wealthy do not keep their assets in the same jurisdiction they live in.", task: "Research one decentralized finance or offshore savings vehicle." }
    ],
    timeline: [
      { time: "12:00", action: "Vault Structure Initiated" },
      { time: "22:00", action: "Capital Relocated" }
    ],
    rewards: { capital: 50, focus: 20, vitality: 10, sovereignty: 75 },
    verificationGate: {
      required: true,
      type: 'bonus',
      title: "MILESTONE II: THE FORTRESS",
      desc: "Your capital must be protected. Prepare the Sovereign Vault.",
      checks: ["Capital is mobile", "Yield is optimized", "Vault architecture is secure"],
      cta: { text: "ACCESS HIGH-YIELD VAULT", link: AFFILIATE_LINKS.nexo },
      confirmText: "Vault Locked -> Enter Final Phase",
      bonusReward: { sovereignty: 50, capital: 20 }
    }
  },
  {
    day: 30,
    title: "PHASE III: SOVEREIGN ACTIVATION",
    mission: "Finalize Sovereignty. You no longer chase money. You attract it.",
    theory: "The protocol is now your Operating System. The consumer noise is gone. Silence is your weapon.",
    tip: "The Architect is now YOU.",
    command: "TRANSCEND",
    assistantHint: "Witness the metrics. You are free.",
    steps: [
      { name: "THE FINAL HARVEST", desc: "Review 30 days of reclamation and calculated growth.", studyContent: "You started as a node in someone else's network. You are now the master of your own server. \n\nNo longer a battery. Now, a generator.", task: "Calculate total saved, totally earned, and total peace of mind gained." },
      { name: "THE SOVEREIGN OATH", desc: "Commit to the Silent Code permanently.", studyContent: "Quiet wealth. Unseen power. Absolute freedom. \n\nThe protocol does not end here. It begins here.", task: "Read the oath. Execute." }
    ],
    timeline: [
      { time: "00:00", action: "SYSTEM EVOLUTION: COMPLETE" },
      { time: "00:01", action: "Sovereign Mode Engaged" }
    ],
    rewards: { capital: 999, focus: 999, vitality: 999, sovereignty: 999 },
    verificationGate: {
      required: true,
      type: 'exam',
      title: "TOTAL DECOUPLING",
      desc: "Initialize the final sequence. Cut the final chord to the Matrix.",
      checks: ["Identity Masked", "Capital Secured", "Mindset Calibrated"],
      cta: { text: "ACTIVATE SOVEREIGNTY SECURE CONNECTION", link: AFFILIATE_LINKS.vpn },
      confirmText: "I AM SOVEREIGN"
    }
  }
];

// Fill gaps for other days with REAL content to ensure all 30 days work
const dayContent: Record<number, { title: string; mission: string; theory: string; task: string; study: string }> = {
  6: { title: "EQUIPMENT AUDIT", mission: "Own quality, or don't own at all.", theory: "Cheap tools break twice. Expensive tools last forever.", task: "Find one 'cheap' item you replace often. Plan its replacement with a high-end tool.", study: "Sovereignty is about reducing friction. High-quality tools reduce friction and save thousands in 'Replacement Tax' over a decade." },
  7: { title: "INTEREST KILLER", mission: "Destroy debt, the silent thief.", theory: "Interest is the inverse of investment. It's a tax on your past self.", task: "Log your highest interest debt. Pay {currency}50 more than the minimum today as a symbolic execution.", study: "Compound interest works for the system if you are in debt. Every dollar of debt is a soldier fighting against you." },
  8: { title: "SKILL STACKING", mission: "Build your internal value.", theory: "Money follows value. Value follows skills.", task: "Dedicate 30 minutes to a technical skill that doesn't belong to your job. Log it.", study: "Hyper-specialization is for insects. Sovereignty requires a broad skill base. Diversify your ability to generate capital." },
  9: { title: "CALORIC ECONOMY", mission: "Fuel the machine cheaply and purely.", theory: "High-processed food is expensive noise for the body.", task: "Meal prep one day of pure survival fuel. Calculate the savings vs eating out.", study: "Your body is your primary asset. Don't let noise enter the fuel tank. Real food is cheaper and more efficient." },
  10: { title: "ASSET MAPPING", mission: "Visualize the territory.", theory: "An unmapped asset is a lost asset.", task: "List every account and physical asset you own in one document.", study: "Clarity is the father of strategy. You must know your exact net worth down to the cent to plot your exit." },
  12: { title: "SIGNAL NETWORK", mission: "Audit your social circle.", theory: "You are the average of the 5 closest nodes.", task: "Identify one 'Noise' relationship and reduce contact.", study: "Peer pressure is a spending vector. Surround yourself with Architects, not Consumers." },
  13: { title: "AUTOMATED TRANSFERS", mission: "Remove the decision fatigue.", theory: "Willpower is finite. Automation is infinite.", task: "Set up one automatic transfer to a 'Sovereign Vault' (savings).", study: "The system relies on you forgetting to save. Beat the system with code." },
  14: { title: "THE LIFE DEBT SCAN", mission: "Count the cost in hours.", theory: "Price is not currency. Price is time.", task: "Divide your monthly 'Noise' by your hourly wage. Calculate the hours of life lost.", study: "When you buy junk, you aren't spending money. You are spending your finite life force." },
  15: { title: "EMERGENCY LIQUIDITY", mission: "Build the 'F*** You' Fund.", theory: "Safety is the prerequisite for boldness.", task: "Direct {currency}200 to an emergency-only node.", study: "A man with 6 months of runway cannot be easily controlled by an employer." },
  16: { title: "DIGITAL FOOTPRINT SCAN", mission: "Erase the breadcrumbs of your identity.", theory: "Data is the new oil, and you are being harvested. Silence requires invisibility.", task: "Scan for your exposed personal data and initiate removal protocols.", study: "Data brokers sell your home address, phone number, and relatives to anyone with {currency}20. This information is used for social engineering and physical targeting. Invisibility is not a luxury; it is a defensive necessity." },
  17: { title: "COGNITIVE DIET", mission: "Control the input to control the output.", theory: "Your attention is a finite resource harvested by algorithms.", task: "Delete one social media app from your phone for 24 hours.", study: "The modern economy monetizes your attention. Reclaiming your focus is a financial superpower." },
  18: { title: "DOPAMINE FASTING", mission: "Reset the reward circuitry.", theory: "Constant stimulation numbs the mind to long-term goals.", task: "Spend one hour in complete silence, no screens, no input.", study: "Boredom is the birthplace of strategic thought. The system ensures you are never bored because a distracted mind cannot plan." },
  19: { title: "NEGOTIATION LEVERAGE", mission: "Never accept the first offer.", theory: "Prices are suggestions for those without leverage.", task: "Call one service provider (internet, insurance) and negotiate a lower rate.", study: "The passive consumer pays the maximum rate. The Sovereign demands the minimum." },
  21: { title: "TAX AWARENESS", mission: "Understand the largest expense of your life.", theory: "Tax is not a fixed penalty, it is a variable cost.", task: "Identify one legal tax optimization strategy for your income.", study: "The system relies on your ignorance of the tax code. Wealthy entities use the code as an instruction manual." },
  22: { title: "HARD ASSET DRILL", mission: "Convert noise into hard signal.", theory: "Fiat is a melting ice cube. Hard assets are the freezer.", task: "Calculate potential yield on your stagnant capital.", study: "Digital assets allow for global, frictionless yield. 10% APY is common in the sovereign layer, while banks offer 0.01%. Reclaim your interest." },
  23: { title: "ENERGY ARBITRAGE", mission: "Trade capital for time.", theory: "Time is the only non-renewable resource.", task: "Identify one task you hate that costs less than your hourly rate to outsource.", study: "The poor trade time for money. The rich trade money for time." },
  24: { title: "SYSTEM ARCHITECTURE", mission: "Design foolproof systems.", theory: "You do not rise to the level of your goals. You fall to the level of your systems.", task: "Automate one bill payment or investment today.", study: "Relying on memory to manage wealth is amateur. The Architect builds automated engines." },
  25: { title: "LEVERAGE MAXIMIZATION", mission: "Do the work once, harvest forever.", theory: "Linear effort produces linear results. Leverage produces exponential results.", task: "Identify a way to apply leverage (code, capital, media, labor) to your current skills.", study: "A software script works 24/7. A scalable system frees the Architect." },
  26: { title: "GEOGRAPHIC DISCONNECT", mission: "Realize the world is your marketplace.", theory: "Your physical location should not dictate your economic potential.", task: "Research the economic advantages of operating online or offshore.", study: "The internet decoupled geography from income. Understand this to transcend local economies." },
  27: { title: "NETWORK VETTING", mission: "Fortify your alliances.", theory: "Weak links break first under pressure.", task: "Identify one person who pulls you down and limit their access to your energy.", study: "You are building a fortress. Do not invite saboteurs inside the walls." },
  28: { title: "SCENARIO PLANNING", mission: "Prepare for the black swans.", theory: "Hope is not a strategy. preparation is.", task: "Write down a plan for a sudden 50% loss of income.", study: "The Architect survives because they have already lived the disaster in their mind." },
  29: { title: "THE EGO DEATH", mission: "Detach your identity from material possessions.", theory: "If you need things to look rich, you are poor.", task: "Find one status symbol you own and commit to never upgrading it for status again.", study: "The consumer buys things to impress people they don't like. The Sovereign buys assets that buy freedom." }
};

for (let i = 1; i <= 30; i++) {
  if (PROTOCOL_DAYS.find(d => d.day === i)) {
    // Inject studyContent/task for existing days if missing
    const existing = PROTOCOL_DAYS.find(d => d.day === i)!;
    if (i === 4) {
      existing.steps[0].studyContent = "Financial freedom is the gap between your income and your expenses. Most people increase expenses to match income. We freeze expenses to let the gift grow.";
      existing.steps[0].task = "Write down the exact amount you need to stay alive and safe for 30 days. This is your BASE.";
    }
    continue;
  }
  
  const content = dayContent[i] || {
    title: `PROTOCOL GRID ${i}`,
    mission: "Maintaining signal stability. Deep work phase.",
    theory: "Consistency creates the gap. Persistence builds the wall.",
    task: "Continue previous protocols without failure. Log your adherence.",
    study: "Discipline is the bridge between goals and accomplishment. In this phase, we harden the habits learned in week 1."
  };

  const newDay: ProtocolDay = {
    day: i,
    title: content.title,
    mission: content.mission,
    theory: content.theory,
    tip: "Stay in the shadows.",
    command: "SOVEREIGN",
    assistantHint: "Deep synchronization in progress.",
    steps: [
      { 
        name: "DAILY SYNC", 
        desc: "Verify previous protocols.", 
        studyContent: content.study,
        task: content.task
      }
    ],
    timeline: [{ time: "09:00", action: "Sovereign Check" }],
    rewards: { capital: 10, focus: 10, vitality: 10, sovereignty: 10 }
  };

  if (i === 16) {
    newDay.verificationGate = {
      required: true,
      type: 'registration',
      title: "DATA REMOVAL OVERRIDE",
      desc: "Data-brokers are selling your location, relatives, and spending habits right now. Let's send a Cease and Desist.",
      checks: ["Scan Complete", "Data Removal Initiated"],
      cta: { text: "INITIALIZE DEPROVISIONING TOOL", link: AFFILIATE_LINKS.dataRemoval },
      confirmText: "Removal Started"
    };
  }

  if (i === 22) {
    newDay.verificationGate = {
      required: true,
      type: 'bonus',
      title: "ASSET HARDENING",
      desc: "Fiat is melting. To become truly Sovereign, you need assets earning yield on their own while you sleep.",
      checks: ["Wallet Connected", "Yield Generating"],
      cta: { text: "LAUNCH SOVEREIGN YIELD TOOL", link: AFFILIATE_LINKS.nexo },
      confirmText: "Vault Created"
    };
  }

  PROTOCOL_DAYS.push(newDay);
}
PROTOCOL_DAYS.sort((a, b) => a.day - b.day);
