import { Video } from "../interfaces/VideoInterface";

export interface Viewer {
    // The viewer's username
    username: string;
    // List of videos the user adds
    watchlist: Video[];
}
