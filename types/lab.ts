export type Lab = {
    id: string;
    name: string;
    shortName: string;
    description: string;
    mission: string;
    scope: string;
    techStacks: string[];
    contactEmail: string;
    contactPhone: string;
    coverImageUrl: string;
    address: string;
    status: LabStatus;
    createdDate: Date;
    updatedDate: Date;
}

export type LabStatus = 'ACTIVE' | 'STOPPED'