import { Video } from "./VideoInterface";

export interface Viewer {
    // The viewer's username
    username: string;
    // List of videos the user adds
    watchlist: Video[];
}
