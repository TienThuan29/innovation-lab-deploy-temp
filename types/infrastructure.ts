export type Field = {
    id: string;
    name: string;
    description: string;
    isAction: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export type InfrastructureType = {
    id: string;
    name: string;
    description: string;
    isEnable: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export type InfrastructureStatus = 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';

export type Infrastructure = {
    id: string;
    labId: string;
    typeId: string;
    coverImageUrl: string;
    description: string;
    specifications: string;
    status: InfrastructureStatus;
    contactPerson: string;
    contactEmail: string;
    referenceUrl: string;
    displayOrder: number;
    createdBy: string;
    createdDate: Date;
    updatedDate: Date;
}

export type InfrastructureField = {
    infrastructureId: string;
    fieldId: string;
}

