// src/types/ui/eigacom.ts
export type EigaComItemUI = {
  service: string;
  releaseStr?: string;
};

export type EigaComResponseUI = {
  items: EigaComItemUI[];
};
