
export interface CreateOrUpdateProject {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    image: string;
    tagIds: Array<number>;
}
