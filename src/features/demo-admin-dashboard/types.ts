export type AdminDashboardBreakpoint = "tablet" | "laptop" | "desktop";

export type AdminDashboardPanel = {
  id: string;
  title: string;
  description: string;
  status: "ready" | "needs-review" | "draft";
  demoRecords: number;
};

export type AdminDashboardWidthNote = {
  breakpoint: AdminDashboardBreakpoint;
  minWidth: number;
  maxWidth?: number;
  columns: number;
  sidebarMode: "stacked" | "rail" | "expanded";
  note: string;
};

export type AdminDashboardLayoutCheck = {
  id: string;
  label: string;
  breakpoint: AdminDashboardBreakpoint;
  expected: string;
};
