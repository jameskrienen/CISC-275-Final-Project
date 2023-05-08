export interface Video {
    // The title of the video
    name: string;
    // The desciption for the video
    description: string;
    // The video's genre
    genre: string;
    // List of recommended videos from this video
    recommended: string[];
    //If the reccommended list is wanted
    wantRecommended: boolean;
    // If the video has been reported
    isReported: boolean;
    //The video's thumbnail
    thumbnail: string;
    //The video's like count
    likes: number;
    //The creator of the video
    creator: string;
}
