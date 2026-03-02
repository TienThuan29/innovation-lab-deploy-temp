export type Activity = {
    id: string;
    labId: string;
    title: string;
    summary: string;
    content: string;
    activityTypeId: string;
    status: ActivityStatus;
    isFeatured: boolean; // pin to the top of the activity list
    startDate: Date;
    duration: number;
    isOnline: boolean;
    meetUrl: string;
    isPublic: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export type ActivityType = {
    id: string;
    name: string;
    description: string;
    isEnable: boolean;
    createdDate: Date;
    updatedDate: Date;
}

export type ActivityStatus = 'DRAFT' | 'FUTURE' | 'COMPLETED' | 'CANCELLED';

