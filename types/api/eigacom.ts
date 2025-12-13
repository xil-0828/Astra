// src/types/api/eigacom.ts
export type EigaComItem = {
  title: string;
  service: string;
  releaseStr: string;
  url: string;
};

export type EigaComResponse = {
  totalAllResults: number;
  fetchedPages: number;
  countAfterFilter: number;
  items: EigaComItem[];
};
