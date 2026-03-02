export type User = {
    id: string;
    email: string;
    password: string;
    fullname: string;
    avartarUrl: string;
    isEnable: boolean;
    profile?: UserProfile;
    role: Role;
    labId: string;
    lastLoginDate: Date;
    createdDate: Date;
    updatedDate: Date;
}

export type Role = 'SUPER_DIRECTOR' |
    'DIRECTOR' |
    'LECTURER' |
    'RESEARCHER' |
    'STUDENT';

export type UserProfile = {
    id: string;
    academicTitle: string; // Prof, PhD, Dr, etc.
    researchInterests: string;
    publicEmail: string;
    publicPhone: string;
    researchGateUrl: string;
    googleScholarUrl: string;
    orcid: string;
    linkedinUrl: string;
    joinDate: Date;
    leaveDate: Date;
    createdDate: Date;
    updatedDate: Date;
}
