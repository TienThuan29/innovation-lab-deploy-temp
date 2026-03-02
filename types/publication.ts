export type PublicationType = 'JOURNAL' | 'CONFERENCE';

export type Publication = {
    id: string;
    labId: string;
    createdBy: string;
    title: string;
    abstract: string;
    poster: string;
    type: PublicationType;
    venue: string; // Journal name, conference name, etc.
    year: number;
    doi: string;
    url: string;
    intellectualProperty: string;
    citationText: string;
    publishedDate: Date;
    createdDate: Date;
    updatedDate: Date;
    isSelectedForShowcase: boolean;
}

export type PublicationAuthor = {
    publicationId: string;
    memberId: string;
    authorOrder: number; // begin from 0
    isCorresponding: boolean;
}

