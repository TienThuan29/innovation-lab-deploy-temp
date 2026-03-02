export type ResearchGuideStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type ResearchGuide = {
    id: string;
    labId: string;
    createdBy: string;
    title: string;
    summary: string;
    content: string;
    status: ResearchGuideStatus;
    createdDate: Date;
    updatedDate: Date;
}

