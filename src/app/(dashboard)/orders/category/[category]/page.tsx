'use client';

import { use } from 'react';
import AcidRefluxOrdersContent from "@/components/orders-table/views/categories/AcidRefluxOrdersContent";
import AcneOrdersContent from "@/components/orders-table/views/categories/AcneOrdersContent";
import AsthmaOrdersContent from "@/components/orders-table/views/categories/AsthmaOrdersContent";
import BacterialVaginosisOrdersContent from "@/components/orders-table/views/categories/BacterialVaginosisOrdersContent";
import EczemaDermatitisOrdersContent from "@/components/orders-table/views/categories/EczemaDermatitisOrdersContent";
import EDOrdersContent from "@/components/orders-table/views/categories/EDOrdersContent";
import HairLossOrdersContent from "@/components/orders-table/views/categories/HairLossOrdersContent";
import JetLagOrdersContent from "@/components/orders-table/views/categories/JetLagOrdersContent";
import JointPainOrdersContent from "@/components/orders-table/views/categories/JointPainOrdersContent";
import MigraineOrdersContent from "@/components/orders-table/views/categories/MigraineOrdersContent";
import PeriodDelayOrdersContent from "@/components/orders-table/views/categories/PeriodDelayOrdersContent";
import WeightLossOrdersContent from "@/components/orders-table/views/categories/WeightLossOrdersContent";
import { AllOrdersContent } from "@/components/orders-table/views";

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
