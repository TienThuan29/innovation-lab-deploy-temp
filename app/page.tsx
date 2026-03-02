import Header from "@/components/header";
import CarouselComponent from "@/components/carousel";
import LabsSection from "@/components/labs-section";
import LabsSidebar from "@/components/labs-sidebar";
import {
  PartnersSectionV1,
  PartnersSectionV2,
} from "@/components/partners-section";
import AIWorkflowSection from "@/components/ai-workflow-section";
import { FooterDivider } from "flowbite-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <CarouselComponent />

        {/* AI-First Workflow Showcase */}
        <AIWorkflowSection />

        <div className="container mx-auto max-w-[1650px] px-4">
          <div className="flex gap-8 py-8">
            <LabsSidebar />
            <div className="min-w-0 flex-1">
              <LabsSection />
            </div>
          </div>
        </div>

        <FooterDivider />

        {/* Strategic Partners Introduction big info */}
        {/* <PartnersSection /> */}
        <PartnersSectionV2 />
      </main>
    </>
  );
}
