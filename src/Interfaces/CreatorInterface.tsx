import { Video } from "./VideoInterface";
import { Viewer } from "./ViewerInterface";

export interface Creator {
    // The creator's username
    username: string;
    // List of all videos the creator has made
    created_videos: Video[];
    // List of videos that have been flagged from the created_videos list
    flagged_videos: Video[];
    blocked_users: Viewer[];
}
