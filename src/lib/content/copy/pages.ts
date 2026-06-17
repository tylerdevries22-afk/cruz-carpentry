/**
 * Copy for the non-service content pages. Each export is one page's editable
 * strings (plain strings; multi-line uses "\n", *asterisks* mark an italic
 * emphasis span — both preserved by `renderCopy`). Populated to match the
 * current rendered copy so switching to the content store changes nothing until
 * edited.
 */

export const ABOUT = {
  seo: {
    title: "About",
    description:
      "Cruz Carpentry is a custom carpentry and fine-millwork shop serving the Colorado Front Range — built by hand, in solid wood, to last. Featured on HGTV in 2022 for a dream home in Morrison, Colorado.",
  },
  header: {
    eyebrow: "About Cruz Carpentry",
    title: "Built by hand, on the *Front Range*",
    sub: "Custom carpentry and fine millwork for Colorado homes — the cabinetry, staircases, built-ins, and one-off pieces that make a house unmistakably yours.",
  },
  story: {
    eyebrow: "Our Story",
    heading: "Carpentry the way it's *meant to be done*",
    paragraphs: [
      "Cruz Carpentry is a custom carpentry and millwork shop serving homes across the Colorado Front Range. We build the things that make a house feel like it was made for the people in it — kitchens and cabinetry, staircases and railings, built-ins, beams, closets, and the one-off pieces no catalog has a page for.",
      "Every project starts the same way: on-site, listening to how you live in the space, then drawing and building it by hand in solid wood. No shortcuts hidden behind the finish — just honest joinery, a careful fit, and work that's built to last.",
      "From a single fireplace mantel to a whole home of millwork, the goal never changes: craftsmanship you'll still be glad you chose decades from now.",
    ],
  },
  hgtv: {
    eyebrow: "As Featured On",
    brand: "HGTV",
    heading: "A dream home in *Morrison, Colorado*",
    body: "In 2022, we were featured on HGTV for a dream home in Morrison, Colorado. The project covered interior trim, custom doors, and three wooden arch beams — wrapped in about two weeks, and the finished home was absolutely gorgeous.",
  },
  values: {
    eyebrow: "What Sets Us Apart",
    heading: "The details you *feel*",
    items: [
      {
        title: "Built by hand",
        body: "Every piece is drawn for your space and built by hand in solid wood — real joinery, not flat-pack parts. It's the difference you feel every time you open a drawer.",
      },
      {
        title: "Fit to the millimeter",
        body: "Walls are never truly square. We scribe, level, and shim so the finished line reads perfectly straight and the build looks like it was framed in with the house.",
      },
      {
        title: "Built to last",
        body: "We build the way good carpentry is supposed to age — tighter and more solid with use, not loose and creaky. The kind of work that outlasts the trends around it.",
      },
    ],
  },
};

export const CONTACT = {
  seo: {
    title: "Contact",
    description:
      "Get in touch with Cruz Carpentry for a free, no-obligation estimate on custom carpentry across the Colorado Front Range. Call (720) 280-0812 or request a quote online.",
  },
  header: {
    eyebrow: "Contact",
    title: "Let's talk about *your project*",
    sub: "Free, no-obligation estimates across the Colorado Front Range. Call us, or send a few details and we'll reach out to schedule.",
  },
  info: {
    call: {
      label: "Call",
      note: "Talk to us directly about your project.",
    },
    estimates: {
      label: "Estimates",
      value: "By appointment",
      note: "Free, no-obligation estimates. We'll come to you, measure, and talk through what you have in mind.",
    },
    serviceArea: {
      label: "Service Area",
      value: "Colorado Front Range",
      noteSuffix: ", and surrounding communities.",
    },
  },
};

export const FAQ_PAGE = {
  seo: {
    title: "FAQ",
    description:
      "Answers to common questions about working with Cruz Carpentry — estimates, timelines, materials, service area, and how a custom carpentry project comes together.",
  },
  header: {
    eyebrow: "Questions & Answers",
    title: "Good to *know*",
    sub: "The questions we hear most often, before you ever pick up the phone.",
  },
  faqs: [
    {
      q: "Do you offer free estimates?",
      a: "Yes — every estimate is free and no-obligation. We come to you, take a look at the space, and talk through what you have in mind before anyone commits to anything.",
    },
    {
      q: "What areas do you serve?",
      a: "The Colorado Front Range — Denver, Boulder, Fort Collins, Loveland, Longmont, Greeley, Castle Rock, and the surrounding communities. If you're nearby, just ask.",
    },
    {
      q: "How does a project work, start to finish?",
      a: "Four steps: we consult on-site, design and select materials together so you approve every detail, build it by hand, then fit and finish it on-site so it looks like it was always part of the home.",
    },
    {
      q: "How long does a custom project take?",
      a: "It depends on the scope — a single mantel is quick, a whole kitchen or a home of millwork takes longer. We give you a realistic timeline once the design is set, and we keep you posted as we build.",
    },
    {
      q: "Painted or stained — which should I choose?",
      a: "Both hold up beautifully when they're done right. Painted finishes give you any color and a furniture-smooth surface; stained and oiled wood shows the grain and ages with character. We'll walk you through the trade-offs for your project.",
    },
    {
      q: "Do you handle countertops, plumbing, and electrical?",
      a: "We build and install the woodwork, and we coordinate closely with your countertop fabricator and licensed plumbers and electricians so everything lands flush, safe, and on schedule.",
    },
    {
      q: "Are you licensed and insured?",
      a: "Yes — Cruz Carpentry is licensed and insured, and all work is built to local building code and inspected where required.",
    },
    {
      q: "Do you offer payment plans or financing?",
      a: "Ask us about payment options when we put your estimate together — we'll let you know what's available for your project.",
    },
    {
      q: "Can you match my existing cabinetry or trim?",
      a: "Yes. We match species, profile, and finish so a new island, built-in, or run of trim blends seamlessly with what's already there.",
    },
    {
      q: "How do I get started?",
      a: "Call us at (720) 280-0812 or request a free estimate online with a few details about your project, and we'll reach out to schedule a visit.",
    },
  ],
};

export const SERVICE_AREAS = {
  seo: {
    title: "Service Areas",
    description:
      "Cruz Carpentry builds custom carpentry across the Colorado Front Range — Denver, Boulder, Fort Collins, Loveland, Longmont, Castle Rock, and surrounding communities.",
  },
  header: {
    eyebrow: "Service Areas",
    title: "Across the *Front Range*",
    sub: "Cruz Carpentry builds for homes throughout the Colorado Front Range. If you're in one of these communities — or close by — we'd love to help.",
  },
  body: {
    intro:
      "From Denver and the southern suburbs up through Boulder County and the northern Front Range, we bring the same hand-built craftsmanship to every project — wherever the job is.",
    footnotePrefix: "Don't see your town? ",
    footnoteLinkLabel: "Get in touch",
    footnoteSuffix: " — we serve many surrounding communities too.",
  },
};

export const SERVICES_HUB = {
  seo: {
    title: "What We Build",
    description:
      "Custom carpentry services across the Colorado Front Range — cabinetry, staircases, built-ins, trim, closets, mudrooms, beams, mantels, doors, wine cellars, home bars, and more.",
  },
  header: {
    eyebrow: "What We Build",
    heading: "Custom carpentry, *end to end*",
    // The "{count} things" sentence is split around the dynamic services count.
    bodyPrefix: "From a single fireplace mantel to a whole home of millwork — explore the ",
    bodySuffix: " things we shape in wood for homes across the Colorado Front Range.",
  },
};

export const ESTIMATE = {
  seo: {
    title: "Request a Custom Carpentry Estimate",
    description:
      "Request a custom carpentry estimate from Cruz Carpentry. Answer a few questions about your project and get a preliminary price range in minutes, priced with live material costs.",
  },
  header: {
    eyebrow: "Request a Custom Carpentry Estimate",
    heading: "Let's price *your project*",
    body: "A few quick questions get you a preliminary range — priced with live material costs. No obligation; final pricing follows a free on-site review.",
  },
};
