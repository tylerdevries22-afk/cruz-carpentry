/**
 * Careers-page copy. Plain strings, with two lightweight markers preserved by
 * `renderCopy`: "\n" for a line break and *asterisks* for an italic emphasis span.
 * Seed values match the current rendered copy exactly, so switching the page to
 * the content store changes nothing until edited.
 *
 * NOTE: roles, values, benefits, and FAQ copy below are intentionally honest and
 * generic — owner should confirm/edit specifics (pay ranges, exact benefits)
 * before treating them as commitments.
 */
export const CAREERS = {
  seo: {
    title: "Careers — Join the Craft",
    description:
      "Join the craft at Cruz Carpentry. We hire finish carpenters, cabinet makers, installers, and apprentices across the Colorado Front Range. Apply in a few minutes.",
    ogTitle: "Careers · Cruz Carpentry",
  },
  hero: {
    eyebrow: "Careers · Cruz Carpentry",
    heading: "Build things that\n*outlast us.*",
    body: "We're a custom carpentry shop on the Colorado Front Range building heirloom-grade millwork. If you take pride in clean joinery and finished work you'd sign your name to, we'd like to meet you.",
    primaryCta: "Apply now",
    secondaryCta: "See roles we hire for",
  },
  invitation: {
    eyebrow: "The invitation",
    body: "This isn't a production line. It's a small crew of people who care about the cut, the grain, and the joint nobody else will ever see.",
  },
  craft: {
    eyebrow: "Our craft",
    heading: "What we hire for",
  },
  values: [
    { title: "Precision", body: "Reveals you can run a finger along. We sweat the joinery, the scribe, the last 1/32\"." },
    { title: "Ownership", body: "You sign your work. Everyone here is trusted to make the call and stand behind it." },
    { title: "Mentorship", body: "Apprentices learn from leads on real installs — not by watching from the corner." },
    { title: "Built to last", body: "We build pieces meant to outlive us. That standard shapes how we hire, too." },
  ],
  shop: {
    eyebrow: "In the shop",
    heading: "The work you'd be doing",
  },
  photoCaptions: ["Measure twice", "Clean cuts", "Refine the surface", "Build to last"],
  benefitsSection: {
    eyebrow: "Why Cruz",
    heading: "What you get",
  },
  benefits: [
    { title: "Pay for your skill", body: "Compensation that reflects experience — and we talk about it openly." },
    { title: "Paid time off", body: "Time to rest and recharge so the work stays sharp." },
    { title: "Tools & training", body: "Support for the gear and skills that make you better at the craft." },
    { title: "A real growth path", body: "Apprentice → finish carpenter → lead. Progression you can see." },
    { title: "Safety first", body: "A clean, organized shop and a culture that looks out for each other." },
    { title: "Work worth doing", body: "High-end custom millwork for homes across the Front Range." },
  ],
  roles: {
    eyebrow: "Open to",
    heading: "Roles we hire for",
    body: "Pick the closest fit and it'll be pre-selected on your application — or choose “General” if you're not sure. We read every one.",
  },
  apply: {
    eyebrow: "Apply",
    heading: "Introduce yourself",
    body: "Five quick steps — about three minutes. Your progress saves as you go.",
  },
  faqSection: {
    eyebrow: "Good to know",
    heading: "Questions",
  },
  faq: [
    { q: "Do I need formal experience?", a: "Not necessarily. We hire across levels — from apprentices with the right attitude to seasoned finish carpenters. Show us how you think about craft." },
    { q: "What should I upload?", a: "A resume is required; a cover letter is optional. Photos of work you're proud of help a lot — they tell us more than a resume can." },
    { q: "Where are you located?", a: "We serve the Colorado Front Range. Tell us your city and commute so we can plan around it." },
    { q: "Do you take apprentices?", a: "Yes. If you're early in the trade and serious about learning, choose “Apprentice” and tell us why." },
    { q: "What happens after I apply?", a: "A real person reads every application. If your craft looks like a fit, we'll reach out — usually within about a week." },
    { q: "Can I save and come back?", a: "Yes — the form saves your progress on this device, so you can finish later." },
  ],
  closing: "A real person reads every application.",
  closingCta: "Start yours →",
};
