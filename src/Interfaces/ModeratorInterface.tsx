import { Video } from "./VideoInterface";

export interface Moderator {
    // The moderator's username
    username: string;
    // List of videos that have bene flagged for review
    review_list: Video[];
}
