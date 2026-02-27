export interface WorkLocation {
  id: string;
  name: string;
  country: string;
  code: string;
  type: "offshore" | "onshore";
}
