import { Video } from "./VideoInterface";
import { Viewer } from "./ViewerInterface";

export interface Creator {
    // The creator's username
    username: string;
    // List of all videos the creator has made
    createdVideos: Video[];
    // List of videos that have been flagged from the created_videos list
    flaggedVideos: Video[];
    blockedUsers: Viewer[];
}
