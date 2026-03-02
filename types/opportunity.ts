export type Opportunity = {
    id: string;
    labId: string;
    createdBy: string;
    title: string;
    description: string;
    benefits: string;
    requirements: string;
    location: string;
    type: OpportunityType;
    startDate: Date;
    endDate: Date;
    status: OpportunityStatus;
    createdDate: Date;
    updatedDate: Date;
    projectTitle?: string;
    requiredSkills?: string[];
    duration?: string;
    deadline?: Date;
    openPositions?: number;
}

export type OpportunityType = 'INTERNSHIP' |
    'THESIS' |
    'RESEARCH_ASSISTANT' |
    'SCHOLARSHIP' |
    'EVENT';

export type OpportunityStatus = 'DRAFT' | 'OPEN' | 'CLOSED';