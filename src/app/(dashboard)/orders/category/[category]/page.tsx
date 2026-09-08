'use client';

import { use } from 'react';
import {
  AcidRefluxOrdersContent,
  AcneOrdersContent,
  AsthmaOrdersContent,
  BacterialVaginosisOrdersContent,
  EczemaDermatitisOrdersContent,
  EDOrdersContent,
  HairLossOrdersContent,
  JetLagOrdersContent,
  JointPainOrdersContent,
  MigraineOrdersContent,
  PeriodDelayOrdersContent,
  WeightLossOrdersContent,
  AllOrdersContent,
} from "@/components/orders-table";

interface CategoryOrdersPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryOrdersPage({ params }: CategoryOrdersPageProps) {
  const { category } = use(params);

  switch (category) {
    case 'acid-reflux':
      return <AcidRefluxOrdersContent />;
    case 'acne':
      return <AcneOrdersContent />;
    case 'asthma':
      return <AsthmaOrdersContent />;
    case 'bacterial-vaginosis':
      return <BacterialVaginosisOrdersContent />;
    case 'eczema-dermatitis':
      return <EczemaDermatitisOrdersContent />;
    case 'ed':
      return <EDOrdersContent />;
    case 'hair-loss':
      return <HairLossOrdersContent />;
    case 'jet-lag':
      return <JetLagOrdersContent />;
    case 'joint-pain':
      return <JointPainOrdersContent />;
    case 'migraine':
      return <MigraineOrdersContent />;
    case 'period-delay':
      return <PeriodDelayOrdersContent />;
    case 'weight-loss':
      return <WeightLossOrdersContent />;
    default:
      return <AllOrdersContent />;
  }
}
