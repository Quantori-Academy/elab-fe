export interface MenuLink {
  icon?: string;
  label: string;
  route: string;
  adminOnly?: boolean;
  procurementOnly?: boolean;
  researcherOnly?: boolean;
}
