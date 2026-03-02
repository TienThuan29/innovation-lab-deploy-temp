export type JoinLabApplication = {
    id: string;
    labId: string;
    applicantEmail: string;
    targetRole: TargetRole;
    selfDescription: string;
    motivation: string;
    skills: string;
    cvFile: string;
    portfolioUrl: string;
    status: ApplicationStatus;
    reviewedBy: string;
    decisionNote: string;
    submittedDate: Date;
    reviewedDate: Date;
}

export type TargetRole = 'STUDENT' | 'RESEARCH_ASSISTANT';

export type ApplicationStatus = 'ACCEPTED' | 'REJECTED';

