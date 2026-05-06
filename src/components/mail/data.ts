export type Email = {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  starred: boolean;
  folder: "inbox" | "starred" | "drafts" | "sent" | "spam" | "archive" | "trash";
  labels?: string[];
  attachments?: { name: string; size: string; type: string }[];
  avatarColor: string;
};

const colors = ["#5b6470", "#7a8290", "#4d5560", "#9098a4", "#3d434d"];
const c = (i: number) => colors[i % colors.length];

export const emails: Email[] = [
  {
    id: "1",
    from: "Lina Park",
    email: "lina@vantage.studio",
    subject: "Q2 brand system — final direction",
    preview: "Hey — sharing the refined exploration for the new identity. The monochrome system feels strongest...",
    body: "Hey,\n\nSharing the refined exploration for the new identity. The monochrome system feels strongest across product surfaces. I've attached the latest spec sheet and the motion principles deck.\n\nLet me know your thoughts before Friday's review.\n\n— Lina",
    time: "9:42 AM",
    unread: true,
    starred: true,
    folder: "inbox",
    labels: ["Design", "Priority"],
    attachments: [
      { name: "vantage-identity-v3.pdf", size: "4.2 MB", type: "pdf" },
      { name: "motion-principles.key", size: "12.1 MB", type: "key" },
    ],
    avatarColor: c(0),
  },
  {
    id: "2",
    from: "Stripe",
    email: "no-reply@stripe.com",
    subject: "Your monthly invoice is ready",
    preview: "Your invoice for November 2025 has been issued. Total amount: $1,248.00...",
    body: "Your invoice for November 2025 has been issued.\n\nTotal: $1,248.00\nDue: Dec 1, 2025\n\nView your invoice in the dashboard.",
    time: "8:15 AM",
    unread: true,
    starred: false,
    folder: "inbox",
    labels: ["Finance"],
    avatarColor: c(1),
  },
  {
    id: "3",
    from: "Marcus Chen",
    email: "marcus@northwind.io",
    subject: "Re: Architecture review notes",
    preview: "Thanks for the deep dive yesterday. A few follow-ups on the edge runtime concerns we discussed...",
    body: "Thanks for the deep dive yesterday. A few follow-ups on the edge runtime concerns we discussed — I think we can resolve most of them with a thin adapter layer.\n\nHappy to pair on it tomorrow.",
    time: "Yesterday",
    unread: false,
    starred: true,
    folder: "inbox",
    labels: ["Engineering"],
    avatarColor: c(2),
  },
  {
    id: "4",
    from: "Aria Voss",
    email: "aria@studio.aria",
    subject: "Studio visit next Thursday?",
    preview: "Would love to show you the new prints in person. We're in the Mission until end of month...",
    body: "Would love to show you the new prints in person. We're in the Mission until the end of the month. Bring coffee.",
    time: "Yesterday",
    unread: false,
    starred: false,
    folder: "inbox",
    avatarColor: c(3),
  },
  {
    id: "5",
    from: "Linear",
    email: "updates@linear.app",
    subject: "5 issues assigned this week",
    preview: "Here's a summary of what's on your plate. Two are marked urgent...",
    body: "Here's a summary of what's on your plate this week. Two are marked urgent.",
    time: "Mon",
    unread: true,
    starred: false,
    folder: "inbox",
    labels: ["Work"],
    avatarColor: c(4),
  },
  {
    id: "6",
    from: "Notion",
    email: "team@notion.so",
    subject: "Your workspace digest",
    preview: "12 pages updated, 3 new comments mentioning you...",
    body: "12 pages updated, 3 new comments mentioning you. Catch up in your workspace.",
    time: "Mon",
    unread: false,
    starred: false,
    folder: "inbox",
    avatarColor: c(0),
  },
  {
    id: "7",
    from: "Daniela Rocha",
    email: "dani@orbital.cc",
    subject: "Co-marketing proposal",
    preview: "Pitching a small launch collab for early Q1. Numbers attached, super low lift on your side...",
    body: "Pitching a small launch collab for early Q1. Numbers attached — super low lift on your side. Would love your read.",
    time: "Sun",
    unread: false,
    starred: false,
    folder: "inbox",
    labels: ["Partnerships"],
    avatarColor: c(1),
  },
  {
    id: "8",
    from: "GitHub",
    email: "noreply@github.com",
    subject: "[vantage/core] PR #482 ready for review",
    preview: "Marcus Chen requested your review on a pull request...",
    body: "Marcus Chen requested your review on a pull request in vantage/core.",
    time: "Sun",
    unread: false,
    starred: false,
    folder: "inbox",
    avatarColor: c(2),
  },
];
