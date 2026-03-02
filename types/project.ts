
export type Project = {
    id: string;
    labId: string;
    name: string;
    summary: string;
    description: string;
    status: ProjectStatus;
    startDate: Date;
    endDate: Date;
    fundingSource: string; // who fund the project
    fundingDescription: string; // description of the funding source
    budget: number; // VND
    partnerId?: string; // who is the partner of the project
    createdDate: Date;
    updatedDate: Date;
}

export type ProjectStatus = 'DRAFT' |
    'ONGOING' |
    'COMPLETED' |
    'ARCHIVED' |
    'CANCELLED';

export type MemberRole = 'PI' | 'Co-PI' | 'Advisor' | 'Leader' | 'RA';

export type ProjectMember = {
    projectId: string;
    userId: string;
    memberRole: MemberRole;
    responsibilities: string;
    assignedBy: string;
    assignedDate: Date;
    updatedDate: Date;
}
