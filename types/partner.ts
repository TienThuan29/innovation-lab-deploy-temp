export type PartnerType = 'UNIVERSITY' | 'COMPANY' | 'LAB';

export type Partner = {
    id: string;
    labId: string;
    name: string;
    type: PartnerType;
    description: string;
    websiteUrl: string;
    logoFile: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    isPublic: boolean;
    createdDate: Date;
    updatedDate: Date;
}

