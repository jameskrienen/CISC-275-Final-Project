import { Video } from "../interfaces/VideoInterface";

export interface Moderator {
    // List of videos that have bene flagged for review
    review_list: Video[];
    username: string;
}
