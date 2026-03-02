export type StudentAssignment = {
    id: string;
    studentId: string;
    suppervisorId: string;
    labId: string;
    name: string;
    description: string;
    finalScore: number;
    feedback: string;
    startDate: Date;
    endDate: Date;
    createdDate: Date;
    updatedDate: Date;
    status: AssignmentStatus;
}

export type AssignmentStatus = 'DRAFT' | 'ONGOING' | 'COMPLETED' | 'FAIL';

