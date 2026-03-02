export type ResearchTier = {
    id: string;
    labId: string;
    name: string; // Intern, Junior, Senior, etc.
    minYear: number;
    maxYear: number;
    description: string;
    conditions: string;
    benefits: string;
    createdBy: string;
    createdDate: Date;
    updatedDate: Date;
}

