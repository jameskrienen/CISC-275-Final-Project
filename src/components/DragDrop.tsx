import React, { useState } from "react";
import { useDrop } from "react-dnd";
import "../App.css";
import VideoComponent from "./VideoComponent";
import { Video } from "../interfaces/VideoInterface";
import { VIDEOS } from "./allVideos";
import { Button, Col, Form, Row } from "react-bootstrap";
import "./DragDrop.css";
import { Viewer } from "../interfaces/ViewerInterface";
import { Creator } from "../interfaces/CreatorInterface";
import { Moderator } from "../interfaces/ModeratorInterface";
import placeholderimage from "../placeholder.jpeg";

function DragDrop({ role }: { role: string }): JSX.Element {
    const users = ["Dan", "Jess", "James"];
    const [currentModerator, setCurrentModerator] = useState<Moderator>({
        review_list: [],
        username: ""
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [allViewers, setAllViewers] = useState<Viewer[]>([
        { username: "Dan", watchlist: [] },
        { username: "Jess", watchlist: [] },
        { username: "James", watchlist: [] }
    ]);
    // State to keep track of the current viewer select box
    const [selectedViewer, setSelectedViewer] = useState<string>("Dan");
    // Updates the state of the current viewer's username and watchlist
    function updateViewerName(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedViewerName = event.target.value;
        setSelectedViewer(selectedViewerName);

        const selectedViewerData = allViewers.find(
            (viewer) => viewer.username === selectedViewerName
        );

        if (selectedViewerData) {
            setAllViewers(
                allViewers.map((viewer: Viewer) =>
                    viewer.username === selectedViewer
                        ? { ...viewer, watchlist: selectedViewerData.watchlist }
                        : { ...viewer }
                )
            );
        }
    }

    // State to keep track of the moderator username textbox
    const [currentModerator, setCurrentModerator] = useState<Moderator>({
        review_list: [],
        username: ""
    });
    // Updates the state of the moderator in the username textbox
    function updateModerator(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentModerator({
            ...currentModerator,
            username: event.target.value
        });
    }

    // State to keep track of creator being entered in username textbox
    const [currentCreator, setCurrentCreator] = useState<Creator>({
        username: "",
        createdVideos: [],
        flaggedVideos: [],
        viewers: [],
        blockedUsers: []
    });
    // Updates the state of the creator in the username textbox
    function updateCreator(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentCreator({
            ...currentCreator,
            username: event.target.value
        });
    }

    // State to keep track of the central item list
    const [allVideos, setAllVideos] = useState<Video[]>(VIDEOS);

    // State to keep track of whether or not the creator is in upload mode
    const [uploadMode, setUploadMode] = useState<boolean>(false);
    // Updates the upload mode state
    function updateMode(event: React.ChangeEvent<HTMLInputElement>) {
        setUploadMode(event.target.checked);
    }

    // State to keep track of the name of the video in creator's upload mode textbox
    const [videoName, setName] = useState<string>("");
    // Updates video name state from upload mode textbox
    function updateName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    // State to keep track of the description in creator's upload mode textbox
    const [videoDescription, setDescription] = useState<string>("");
    // Updates description state from upload mode textbox
    function updateDescription(event: React.ChangeEvent<HTMLInputElement>) {
        setDescription(event.target.value);
    }

    // State to keep track of the url in creator's upload mode textbox
    const [videoImage, setVideoImage] = useState<string>(placeholderimage);
    // Updates url state from upload mode textbox
    function updateImage(event: React.ChangeEvent<HTMLInputElement>) {
        setVideoImage(event.target.value);
    }

    // State to keep track of the genre in creator's upload mode textbox
    const [videoGenre, setGenre] = useState<string>("");
    // Updates genre state from upload mode textbox
    function updateGenre(event: React.ChangeEvent<HTMLInputElement>) {
        setGenre(event.target.value);
    }

    // Updates creator's uploaded list when video attributes are changed
    function updateCreatorVideos(newVideo: Video) {
        const videoNames: string[] = currentCreator.createdVideos.map(
            (vid: Video) => vid.name
        );
        if (
            !videoNames.includes(newVideo.name) &&
            newVideo.creator === currentCreator.username
        ) {
            const newCreator = {
                ...currentCreator,
                createdVideos: [...currentCreator.createdVideos, newVideo]
            };
            setCurrentCreator(newCreator);
            addVideoToCentralList(newVideo);
        } else {
            const newList = currentCreator.createdVideos.map((video: Video) => {
                return video.name === newVideo.name ? newVideo : video;
            });
            setCurrentCreator({ ...currentCreator, createdVideos: newList });
        }
    }

    // Updates moderator's review list when video attributes are changed
    function updateModeratorVideos(newVideo: Video) {
        const videoNames: string[] = currentModerator.review_list.map(
            (vid: Video) => vid.name
        );
        if (!videoNames.includes(newVideo.name) && newVideo.isReported) {
            const newModerator = {
                ...currentModerator,
                review_list: [...currentModerator.review_list, newVideo]
            };
            setCurrentModerator(newModerator);
        } else {
            const newList = currentModerator.review_list.map((video: Video) => {
                return video.name === newVideo.name ? newVideo : video;
            });
            setCurrentModerator({ ...currentModerator, review_list: newList });
        }
    }

    // Current viewer data
    const selectedViewerData = allViewers.find(
        (viewer) => viewer.username === selectedViewer
    );

    // Current viewer watchlist is set to current viewer data
    const viewerWatchlist = selectedViewerData
        ? selectedViewerData.watchlist
        : [];

    // React DnD implementation. Viewers can drag and drop videos from the central item list
    // into their own watchlist.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: "VIDEO",
            drop: (item: Video) => addVideoToWatchlist(item.name),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        }),
        [addVideoToWatchlist]
    );

    // Deletes video from the central item list when moderator deeltes video from whole website
    function deleteVideoFromCentralList(vid: Video) {
        const newCentralList = allVideos.filter(
            (video: Video) => video.name !== vid.name
        );
        setAllVideos(newCentralList);
    }

    // Deletes video from the creators uploaded list. Used when moderator deletes video from whole website
    function deleteVideoFromCreatorList(vid: Video) {
        const newCreatorList = currentCreator.createdVideos.filter(
            (video: Video) => video.name !== vid.name
        );
        const newCreator = { ...currentCreator, createdVideos: newCreatorList };
        setCurrentCreator(newCreator);
    }

    // Deletes a video from the review list. Used when moderator deletes video from whole website
    function deleteFromReviewList(vid: Video) {
        const newList = currentModerator.review_list.filter(
            (video: Video) => video.name !== vid.name
        );
        const newModerator = { ...currentModerator, review_list: newList };
        setCurrentModerator(newModerator);
    }

    // Removes a reported video from the review list and removes its flagged status on all lists
    function approveVideo(vid: Video) {
        deleteFromReviewList(vid);
        updateCentralList({ ...vid, isReported: false });
        updateCreatorVideos({ ...vid, isReported: false });
    }

    // Deletes a video from the current users watchlist when they click delete button (red X) in their watchlist,
    // or the moderator removes it from the entire Website. "Specific" parameter is for whether or not
    // it is removed by the moderator
    function deleteFromWatchList(
        vid: Video,
        index: number,
        specific: boolean,
        name: string
    ) {
        if (!specific) {
            const currentViewer = allViewers.filter((viewer: Viewer) => {
                return viewer.username === name;
            });
            const newList = currentViewer[0].watchlist.filter(
                (video: Video) => {
                    return video.name != vid.name;
                }
            );
            const updatedViewers = allViewers.map((viewer: Viewer) =>
                viewer.username === name
                    ? { ...viewer, watchlist: newList }
                    : { ...viewer }
            );
            setAllViewers(updatedViewers);
        } else {
            const currentViewer = allViewers.filter((viewer: Viewer) => {
                return viewer.username === name;
            });
            const newList = currentViewer[0].watchlist.filter(
                (video: Video, num: number) => {
                    return num != index;
                }
            );
            const updatedViewers = allViewers.map((viewer: Viewer) =>
                viewer.username === name
                    ? { ...viewer, watchlist: newList }
                    : { ...viewer }
            );
            setAllViewers(updatedViewers);
        }
        updatePrevWatchlist();
    }

    // Adds a video to the central item list when its uploaded
    function addVideoToCentralList(video: Video) {
        const newVideos = [...allVideos, video];
        setAllVideos(newVideos);
    }

    // Updates the central item list when video attributes are changed
    function updateCentralList(toEdit: Video) {
        const vidNames = allVideos.map((video: Video) => video.name);
        if (vidNames.includes(toEdit.name)) {
            const newVideos = allVideos.map((video: Video) => {
                return video.name === toEdit.name ? toEdit : video;
            });
            setAllVideos(newVideos);
        }
    }

    // Adds a video to the current user's watchlist. If the video was made by a user (not the default website videos)
    // then the viewer appears in the creator's list, with repeats allowed so that the creator can see how many times
    // their video has been added
    function addVideoToWatchlist(name: string) {
        const videoToAdd = allVideos.find(
            (video: Video) => name === video.name
        );
        if (videoToAdd && selectedViewer) {
            setAllViewers((prevViewers) =>
                prevViewers.map((viewer: Viewer) => {
                    if (viewer.username === selectedViewer) {
                        return {
                            ...viewer,
                            watchlist: [...viewer.watchlist, videoToAdd]
                        };
                    }
                    return viewer;
                })
            );
        }
        updatePrevWatchlist();
        if (videoToAdd?.creator !== "Clipped") {
            const selectedViewerObj = allViewers.find((viewer: Viewer) => {
                return viewer.username === selectedViewer;
            });

            if (selectedViewerObj) {
                const newViewers = [
                    ...currentCreator.viewers,
                    selectedViewerObj
                ];

                setCurrentCreator({
                    ...currentCreator,
                    viewers: newViewers
                });
            }
        }
    }

    // State to keep track of watchlist filter type
    const [filteredWatchlist, setFilteredWatchlist] = useState<string>("");
    // Filters videos in the user's watchlist by alphabetical order
    function filterWatchlistAlphabet() {
        setFilteredWatchlist("Name");
        const sortedData = [...viewerWatchlist].sort((vid1, vid2) => {
            return vid1.name.localeCompare(vid2.name);
        });
        setAllViewers(
            allViewers.map((viewer: Viewer) =>
                viewer.username === selectedViewer
                    ? { ...viewer, watchlist: sortedData }
                    : { ...viewer }
            )
        );
    }

    // Filters videos in the user's watchlist by genre
    function filterWatchlistGenre() {
        if (filteredWatchlist != null) {
            setFilteredWatchlist("Genre");
            const sortedData = [...viewerWatchlist].sort((vid1, vid2) => {
                return vid1.genre === vid2.genre
                    ? vid1.name.localeCompare(vid2.name)
                    : vid1.genre.localeCompare(vid2.genre);
            });
            setAllViewers(
                allViewers.map((viewer: Viewer) =>
                    viewer.username === selectedViewer
                        ? { ...viewer, watchlist: sortedData }
                        : { ...viewer }
                )
            );
        }
    }

    // State to keep track of all other filter types
    const [filteredVideos, setFilteredVideos] = useState<string>("");
    // Filters videos in the central item list, creator list, and review list by alphabetical order
    function filterAlphabet() {
        setFilteredVideos("Name");
        if (role === "viewer") {
            const sortedData = [...allVideos].sort((vid1, vid2) => {
                return vid1.name.localeCompare(vid2.name);
            });
            setAllVideos(sortedData);
        } else if (role === "moderator") {
            const sortedReviewList = [...currentModerator.review_list].sort(
                (vid1, vid2) => {
                    return vid1.name.localeCompare(vid2.name);
                }
            );
            setCurrentModerator({
                ...currentModerator,
                review_list: sortedReviewList
            });
        } else {
            const sortedCreatorList = [...currentCreator.createdVideos].sort(
                (vid1, vid2) => {
                    return vid1.name.localeCompare(vid2.name);
                }
            );
            setCurrentCreator({
                ...currentCreator,
                createdVideos: sortedCreatorList
            });
        }
    }

    // Filters videos in the central item list, creator list, and review list by genre
    function filterGenre() {
        if (filteredVideos != null) {
            setFilteredVideos("Genre");
            if (role === "viewer") {
                const sortedCentralList = [...allVideos].sort((vid1, vid2) => {
                    return vid1.genre === vid2.genre
                        ? vid1.name.localeCompare(vid2.name)
                        : vid1.genre.localeCompare(vid2.genre);
                });
                setAllVideos(sortedCentralList);
            } else if (role === "moderator") {
                const sortedReviewList = [...currentModerator.review_list].sort(
                    (vid1, vid2) => {
                        return vid1.genre === vid2.genre
                            ? vid1.name.localeCompare(vid2.name)
                            : vid1.genre.localeCompare(vid2.genre);
                    }
                );
                setCurrentModerator({
                    ...currentModerator,
                    review_list: sortedReviewList
                });
            } else {
                const sortedCreatorList = [
                    ...currentCreator.createdVideos
                ].sort((vid1, vid2) => {
                    return vid1.genre === vid2.genre
                        ? vid1.name.localeCompare(vid2.name)
                        : vid1.genre.localeCompare(vid2.genre);
                });
                setCurrentCreator({
                    ...currentCreator,
                    createdVideos: sortedCreatorList
                });
            }
        }
    }

    // Empties the current users watchlist
    function clearWatchlist(name: string) {
        setAllViewers(
            allViewers.map((viewer: Viewer) =>
                viewer.username === name
                    ? { ...viewer, watchlist: [] }
                    : { ...viewer }
            )
        );
        updatePrevWatchlist();
    }

    // State to keep track of previous user watchlists for undo button
    const [prevWatchlist, setPrevWatchlist] = useState<Viewer[]>([
        { username: "Dan", watchlist: [] },
        { username: "Jess", watchlist: [] },
        { username: "James", watchlist: [] }
    ]);

    // Updates state as current watchlists are changed, stays one step behind
    function updatePrevWatchlist() {
        const newWatchlist = [...viewerWatchlist];
        setPrevWatchlist(
            prevWatchlist.map((viewer: Viewer) =>
                viewer.username === selectedViewer
                    ? { ...viewer, watchlist: newWatchlist }
                    : { ...viewer }
            )
        );
    }

    // For undo button, only reverts once. Can be adjusted with a stack in the future
    function revertWatchlist() {
        const previousList = prevWatchlist.filter((viewer: Viewer) => {
            return viewer.username === selectedViewer;
        });
        setAllViewers(
            allViewers.map((viewer: Viewer) =>
                viewer.username === selectedViewer
                    ? { ...viewer, watchlist: previousList[0].watchlist }
                    : { ...viewer }
            )
        );
    }

    // State for search bar textbox
    const [currentSearch, setCurrentSearch] = useState<string>("");
    // updates the value that is being entered in the search bar
    function updateCurrentSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value);
    }

    // Searches the watchlist for a video based on if the string entered is in the title or description
    // Case-sensitive and must be entered exactly
    function searchWatchlist(search: string, type: string) {
        if (type === "description") {
            const newWatchlist = viewerWatchlist.filter((video: Video) =>
                video.description.includes(search)
            );
            setAllViewers(
                allViewers.map((viewer: Viewer) =>
                    viewer.username === selectedViewer
                        ? { ...viewer, watchlist: newWatchlist }
                        : { ...viewer }
                )
            );
        } else {
            const newWatchlist = viewerWatchlist.filter((video: Video) =>
                video.name.includes(search)
            );
            setAllViewers(
                allViewers.map((viewer: Viewer) =>
                    viewer.username === selectedViewer
                        ? { ...viewer, watchlist: newWatchlist }
                        : { ...viewer }
                )
            );
        }
        updatePrevWatchlist();
    }

    // State for new viewer textbox
    const [newViewerName, setNewViewerName] = useState<string>("");

    // Allow creators to add a new user to the website
    function addViewer() {
        const newViewer = { username: newViewerName, watchlist: [] };
        setAllViewers((prevViewers) => [...prevViewers, newViewer]);
        setSelectedViewer(newViewerName);
        setNewViewerName("");
        const newUsers = [...users, newViewerName];
        setUsers(newUsers);
    }

    // Update new user value
    function handleNewViewer(event: React.ChangeEvent<HTMLInputElement>) {
        setNewViewerName(event.target.value);
    }

    // Allow creators to delete a viewer from the website
    function deleteViewer(username: string) {
        setAllViewers((prevViewers) =>
            prevViewers.filter((viewer) => viewer.username !== username)
        );
        setUsers((prevUsers) =>
            prevUsers.filter((user: string) => user !== username)
        );
    }

    return (
        <>
            <div hidden={role !== "viewer"} data-testid="viewer-component">
                <div className="lists">
                    <div
                        className="centralList"
                        data-testid="central item list"
                    >
                        <div
                            style={{
                                fontWeight: "bold",
                                fontSize: "xx-large",
                                marginLeft: "50px"
                            }}
                        >
                            Videos:
                        </div>
                        <span style={{ marginLeft: "50px" }}>
                            <Button onClick={filterAlphabet}>Filter A-Z</Button>
                            <Button onClick={filterGenre}>
                                Filter by Genre
                            </Button>
                        </span>
                        <Row>
                            {/** Central item list */}
                            <Col style={{ columnCount: 3 }}>
                                {allVideos.map(
                                    (video: Video, index: number) => {
                                        return (
                                            <ul
                                                key={video.name}
                                                style={{ breakInside: "avoid" }}
                                            >
                                                <VideoComponent
                                                    key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}-${currentCreator.viewers}`}
                                                    name={video.name}
                                                    description={
                                                        video.description
                                                    }
                                                    genre={video.genre}
                                                    recommended={
                                                        video.recommended
                                                    }
                                                    isReported={
                                                        video.isReported
                                                    }
                                                    thumbnail={video.thumbnail}
                                                    wantRecommended={
                                                        video.wantRecommended
                                                    }
                                                    likes={video.likes}
                                                    creator={video.creator}
                                                    commentList={
                                                        video.commentList
                                                    }
                                                    inWatchlist={false}
                                                    wantToComment={
                                                        video.wantToComment
                                                    }
                                                    updateCentralList={
                                                        updateCentralList
                                                    }
                                                    updateModeratorList={
                                                        updateModeratorVideos
                                                    }
                                                    updateCreatorList={
                                                        updateCreatorVideos
                                                    }
                                                    deleteCentralVid={
                                                        deleteVideoFromCentralList
                                                    }
                                                    deleteCreatorVid={
                                                        deleteVideoFromCreatorList
                                                    }
                                                    deleteReviewVid={
                                                        deleteFromReviewList
                                                    }
                                                    deleteWatchVid={
                                                        deleteFromWatchList
                                                    }
                                                    approveVid={approveVideo}
                                                    index={index}
                                                    role={role}
                                                    dropdown={false}
                                                    currentViewer={
                                                        selectedViewer
                                                    }
                                                    viewers={
                                                        currentCreator.viewers
                                                    }
                                                ></VideoComponent>
                                            </ul>
                                        );
                                    }
                                )}
                            </Col>
                        </Row>
                    </div>
                    <div
                        className="watchList"
                        ref={drop}
                        data-testid="user watchlist"
                    >
                        <Row>
                            <Col style={{ columnCount: 1 }}>
                                <div
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "xx-large"
                                    }}
                                >
                                    <div>
                                        {/** Prompt users to select a valid username in order to act (one is defaulted) */}
                                        <Form.Group controlId="currentViewer">
                                            <Form.Label>
                                                <small>
                                                    Select your username:
                                                </small>
                                            </Form.Label>
                                            <Form.Select
                                                value={selectedViewer}
                                                onChange={updateViewerName}
                                            >
                                                {allViewers.map(
                                                    (viewer: Viewer) => (
                                                        <option
                                                            key={
                                                                viewer.username
                                                            }
                                                            value={
                                                                viewer.username
                                                            }
                                                        >
                                                            {viewer.username}
                                                        </option>
                                                    )
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                    {selectedViewer}
                                    {"'s"} Watchlist:
                                </div>
                                <div>
                                    <Form.Group>
                                        <Form.Label>Search:</Form.Label>
                                        <Form.Control
                                            value={currentSearch}
                                            onChange={updateCurrentSearch}
                                        ></Form.Control>
                                        <span>
                                            <Button
                                                onClick={() =>
                                                    searchWatchlist(
                                                        currentSearch,
                                                        "description"
                                                    )
                                                }
                                            >
                                                Search Descriptions
                                            </Button>
                                        </span>
                                        <span>
                                            <Button
                                                onClick={() =>
                                                    searchWatchlist(
                                                        currentSearch,
                                                        "title"
                                                    )
                                                }
                                            >
                                                Search Titles
                                            </Button>
                                        </span>
                                        <span>
                                            <Button onClick={revertWatchlist}>
                                                View most recent watchlist:
                                            </Button>
                                        </span>
                                    </Form.Group>
                                    <Button
                                        data-testid="A-Z"
                                        onClick={filterWatchlistAlphabet}
                                    >
                                        Filter A-Z
                                    </Button>
                                    <Button
                                        data-testid="by genre"
                                        onClick={filterWatchlistGenre}
                                    >
                                        Filter Genre
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            clearWatchlist(selectedViewer)
                                        }
                                        data-testid="clear watchlist"
                                        style={{
                                            color: "red",
                                            marginLeft: "25px"
                                        }}
                                    >
                                        Clear Watchlist
                                    </Button>
                                </div>
                                {/** User watchlist */}
                                {viewerWatchlist.map(
                                    (video: Video, index: number) => {
                                        return (
                                            <div key={video.name}>
                                                <VideoComponent
                                                    key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${currentCreator.viewers}`}
                                                    name={video.name}
                                                    description={
                                                        video.description
                                                    }
                                                    genre={video.genre}
                                                    recommended={
                                                        video.recommended
                                                    }
                                                    isReported={
                                                        video.isReported
                                                    }
                                                    thumbnail={video.thumbnail}
                                                    wantRecommended={
                                                        video.wantRecommended
                                                    }
                                                    likes={video.likes}
                                                    creator={video.creator}
                                                    commentList={
                                                        video.commentList
                                                    }
                                                    inWatchlist={true}
                                                    wantToComment={
                                                        video.wantToComment
                                                    }
                                                    updateCentralList={
                                                        updateCentralList
                                                    }
                                                    updateModeratorList={
                                                        updateModeratorVideos
                                                    }
                                                    updateCreatorList={
                                                        updateCreatorVideos
                                                    }
                                                    deleteCentralVid={
                                                        deleteVideoFromCentralList
                                                    }
                                                    deleteCreatorVid={
                                                        deleteVideoFromCreatorList
                                                    }
                                                    deleteReviewVid={
                                                        deleteFromReviewList
                                                    }
                                                    deleteWatchVid={
                                                        deleteFromWatchList
                                                    }
                                                    approveVid={approveVideo}
                                                    index={index}
                                                    role={role}
                                                    dropdown={false}
                                                    currentViewer={
                                                        selectedViewer
                                                    }
                                                    viewers={
                                                        currentCreator.viewers
                                                    }
                                                ></VideoComponent>
                                            </div>
                                        );
                                    }
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <div hidden={role !== "moderator"} data-testid="moderator list">
                <div className="moderatorList">
                    {/** Moderators can review videos that show up in their list when reported  */}
                    <Row>
                        <Col style={{ columnCount: 1 }}>
                            <div
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "xx-large",
                                    marginRight: "1000px"
                                }}
                            >
                                Review List
                            </div>
                            <div>
                                <p
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "large"
                                    }}
                                >
                                    Select username:{" "}
                                    {users
                                        .map((name: string) => ` ${name}`)
                                        .join(", ")}
                                </p>
                                {/** Prompt users to enter a valid username */}
                                <Form.Group>
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        value={currentModerator.username}
                                        onChange={updateModerator}
                                    ></Form.Control>
                                    <Form.Label>
                                        {users.includes(
                                            currentModerator.username
                                        )
                                            ? "Welcome "
                                            : ""}
                                        {users.includes(
                                            currentModerator.username
                                        )
                                            ? currentModerator.username
                                            : "Not a moderator"}
                                        {"!"}
                                    </Form.Label>
                                </Form.Group>
                            </div>
                            <span style={{ marginLeft: "50px" }}>
                                <Button onClick={filterAlphabet}>
                                    Filter A-Z
                                </Button>
                                <Button onClick={filterGenre}>
                                    Filter by Genre
                                </Button>
                            </span>
                            <div key={allVideos.length.toString()}>
                                {currentModerator.review_list.map(
                                    (video: Video, index: number) => {
                                        return (
                                            <VideoComponent
                                                key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}-${currentCreator.viewers}`}
                                                name={video.name}
                                                description={video.description}
                                                genre={video.genre}
                                                recommended={video.recommended}
                                                isReported={video.isReported}
                                                thumbnail={video.thumbnail}
                                                wantRecommended={
                                                    video.wantRecommended
                                                }
                                                likes={video.likes}
                                                creator={video.creator}
                                                commentList={video.commentList}
                                                inWatchlist={false}
                                                wantToComment={
                                                    video.wantToComment
                                                }
                                                updateCentralList={
                                                    updateCentralList
                                                }
                                                updateModeratorList={
                                                    updateModeratorVideos
                                                }
                                                updateCreatorList={
                                                    updateCreatorVideos
                                                }
                                                deleteCentralVid={
                                                    deleteVideoFromCentralList
                                                }
                                                deleteCreatorVid={
                                                    deleteVideoFromCreatorList
                                                }
                                                deleteReviewVid={
                                                    deleteFromReviewList
                                                }
                                                deleteWatchVid={
                                                    deleteFromWatchList
                                                }
                                                approveVid={approveVideo}
                                                index={index}
                                                role={role}
                                                dropdown={false}
                                                currentViewer={selectedViewer}
                                                viewers={currentCreator.viewers}
                                            ></VideoComponent>
                                        );
                                    }
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
                <span style={{ marginLeft: "50px" }}>
                    <Button onClick={filterAlphabet}>Filter A-Z</Button>
                    <Button onClick={filterGenre}>Filter by Genre</Button>
                </span>
                {/** Central item list */}
                <div>
                    <div
                        style={{
                            fontWeight: "bold",
                            fontSize: "xx-large"
                        }}
                    >
                        Videos:
                    </div>
                    <Col style={{ columnCount: 3, marginRight: "50px" }}>
                        {allVideos.map((video: Video, index: number) => {
                            return (
                                <ul
                                    key={video.name}
                                    style={{ breakInside: "avoid" }}
                                >
                                    <VideoComponent
                                        key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}-${currentCreator.viewers}`}
                                        name={video.name}
                                        description={video.description}
                                        genre={video.genre}
                                        recommended={video.recommended}
                                        isReported={video.isReported}
                                        thumbnail={video.thumbnail}
                                        wantRecommended={video.wantRecommended}
                                        likes={video.likes}
                                        creator={video.creator}
                                        commentList={video.commentList}
                                        inWatchlist={false}
                                        wantToComment={video.wantToComment}
                                        updateCentralList={updateCentralList}
                                        updateModeratorList={
                                            updateModeratorVideos
                                        }
                                        updateCreatorList={updateCreatorVideos}
                                        deleteCentralVid={
                                            deleteVideoFromCentralList
                                        }
                                        deleteCreatorVid={
                                            deleteVideoFromCreatorList
                                        }
                                        deleteReviewVid={deleteFromReviewList}
                                        deleteWatchVid={deleteFromWatchList}
                                        approveVid={approveVideo}
                                        index={index}
                                        role={role}
                                        dropdown={false}
                                        currentViewer={selectedViewer}
                                        viewers={currentCreator.viewers}
                                    ></VideoComponent>
                                </ul>
                            );
                        })}
                    </Col>
                </div>
            </div>
            <div hidden={role !== "creator"} data-testid="creator list">
                <div className="creatorList">
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "xx-large",
                            marginRight: "1000px"
                        }}
                    >
                        Creator List:
                    </span>

                    <p
                        style={{
                            fontWeight: "bold",
                            fontSize: "large"
                        }}
                    >
                        Select username:{" "}
                        {users.map((name: string) => ` ${name}`).join(", ")}
                    </p>
                    {/** Users must enter a valid username in order to upload/edit videos */}
                    <Form.Group>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control
                            value={currentCreator.username}
                            onChange={updateCreator}
                        ></Form.Control>
                        <Form.Label>
                            {users.includes(currentCreator.username)
                                ? "Welcome "
                                : ""}
                            {users.includes(currentCreator.username)
                                ? currentCreator.username
                                : "Not a creator"}
                            {"!"}
                        </Form.Label>
                    </Form.Group>
                    {/** Creator's uploaded video list */}
                    <Row>
                        <Col>
                            {currentCreator.createdVideos.map(
                                (video: Video, index: number) => {
                                    return (
                                        <VideoComponent
                                            key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}-${currentCreator.viewers}`}
                                            name={video.name}
                                            description={video.description}
                                            genre={video.genre}
                                            recommended={video.recommended}
                                            isReported={video.isReported}
                                            thumbnail={video.thumbnail}
                                            wantRecommended={
                                                video.wantRecommended
                                            }
                                            likes={video.likes}
                                            creator={video.creator}
                                            commentList={video.commentList}
                                            inWatchlist={false}
                                            wantToComment={video.wantToComment}
                                            updateCentralList={
                                                updateCentralList
                                            }
                                            updateModeratorList={
                                                updateModeratorVideos
                                            }
                                            updateCreatorList={
                                                updateCreatorVideos
                                            }
                                            deleteCentralVid={
                                                deleteVideoFromCentralList
                                            }
                                            deleteCreatorVid={
                                                deleteVideoFromCreatorList
                                            }
                                            deleteReviewVid={
                                                deleteFromReviewList
                                            }
                                            deleteWatchVid={deleteFromWatchList}
                                            approveVid={approveVideo}
                                            index={index}
                                            role={role}
                                            dropdown={false}
                                            currentViewer={selectedViewer}
                                            viewers={currentCreator.viewers}
                                            data-testid="creator-list"
                                        ></VideoComponent>
                                    );
                                }
                            )}
                        </Col>
                        {/** Creators can upload their own videos */}
                        <Col>
                            <Form.Switch
                                type="switch"
                                id="upload-mode-check"
                                label="Enter Upload Mode"
                                checked={uploadMode}
                                onChange={updateMode}
                            />
                            {uploadMode === true && role === "creator" ? (
                                <Form.Group controlId="formUserName">
                                    <Form.Label>Enter name:</Form.Label>
                                    <Form.Control
                                        data-testid="name-form"
                                        value={videoName}
                                        onChange={updateName}
                                    />
                                    <Form.Label>Enter description:</Form.Label>
                                    <Form.Control
                                        data-testid="name-form"
                                        value={videoDescription}
                                        onChange={updateDescription}
                                    />
                                    <Form.Label>
                                        Enter thumbnail url:
                                    </Form.Label>
                                    <Form.Control
                                        data-testid="name-form"
                                        value={videoImage}
                                        onChange={updateImage}
                                    />
                                    <Form.Label>Choose genre:</Form.Label>
                                    <Form.Check
                                        data-testid="music-checkbox"
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-music"
                                        label="Music"
                                        value="Music"
                                        checked={videoGenre === "Music"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-gaming"
                                        label="Gaming"
                                        value="Gaming"
                                        checked={videoGenre === "Gaming"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-sports"
                                        label="Sports"
                                        value="Sports"
                                        checked={videoGenre === "Sports"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-comedy"
                                        label="Comedy"
                                        value="Comedy"
                                        checked={videoGenre === "Comedy"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-education"
                                        label="Education"
                                        value="Education"
                                        checked={videoGenre === "Education"}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="genres"
                                        onChange={updateGenre}
                                        id="genre-check-howto"
                                        label="How-To"
                                        value="How-To"
                                        checked={videoGenre === "How-To"}
                                    />
                                    <Button
                                        data-testid={"upload-button"}
                                        onClick={() => {
                                            updateCreatorVideos({
                                                name: videoName,
                                                description: videoDescription,
                                                genre: videoGenre,
                                                recommended: [],
                                                isReported: false,
                                                thumbnail: videoImage,
                                                wantRecommended: false,
                                                commentList: [],
                                                likes: 0,
                                                creator:
                                                    currentCreator.username,
                                                wantToComment: false,
                                                dropdown: false
                                            });
                                        }}
                                        disabled={
                                            !users.includes(
                                                currentCreator.username
                                            )
                                        }
                                    >
                                        Upload Video{" "}
                                    </Button>
                                </Form.Group>
                            ) : (
                                <span>{""}</span>
                            )}
                        </Col>
                        {/** Creators can add/delete users from the website */}
                        <div>
                            {" "}
                            <Col>
                                <Form.Group controlId="addViewer">
                                    <Form.Label>
                                        <small>Add a new viewer:</small>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newViewerName}
                                        onChange={handleNewViewer}
                                    />
                                    <Button
                                        onClick={addViewer}
                                        disabled={
                                            !users.includes(
                                                currentCreator.username
                                            )
                                        }
                                    >
                                        Add Viewer
                                    </Button>
                                </Form.Group>
                            </Col>
                            <Col>
                                <span>List of Viewers:</span>
                                {allViewers.map((viewer: Viewer) => (
                                    <div
                                        key={viewer.username}
                                        style={{ marginBottom: "4px" }}
                                    >
                                        {viewer.username}
                                        <Button
                                            onClick={() =>
                                                deleteViewer(viewer.username)
                                            }
                                            size="sm"
                                            disabled={
                                                !users.includes(
                                                    currentCreator.username
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </Col>
                        </div>
                    </Row>
                </div>
                {/** Central item list */}
                <div>
                    {" "}
                    <div
                        style={{
                            fontWeight: "bold",
                            fontSize: "xx-large"
                        }}
                    >
                        Videos:
                    </div>
                    <Col style={{ columnCount: 3, marginRight: "50px" }}>
                        {allVideos.map((video: Video, index: number) => {
                            return (
                                <ul
                                    key={video.name}
                                    style={{ breakInside: "avoid" }}
                                >
                                    <VideoComponent
                                        key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}-${currentCreator.viewers}`}
                                        name={video.name}
                                        description={video.description}
                                        genre={video.genre}
                                        recommended={video.recommended}
                                        isReported={video.isReported}
                                        thumbnail={video.thumbnail}
                                        wantRecommended={video.wantRecommended}
                                        likes={video.likes}
                                        creator={video.creator}
                                        commentList={video.commentList}
                                        inWatchlist={false}
                                        wantToComment={video.wantToComment}
                                        updateCentralList={updateCentralList}
                                        updateModeratorList={
                                            updateModeratorVideos
                                        }
                                        updateCreatorList={updateCreatorVideos}
                                        deleteCentralVid={
                                            deleteVideoFromCentralList
                                        }
                                        deleteCreatorVid={
                                            deleteVideoFromCreatorList
                                        }
                                        deleteReviewVid={deleteFromReviewList}
                                        deleteWatchVid={deleteFromWatchList}
                                        approveVid={approveVideo}
                                        index={index}
                                        role={role}
                                        dropdown={false}
                                        currentViewer={selectedViewer}
                                        viewers={currentCreator.viewers}
                                    ></VideoComponent>
                                </ul>
                            );
                        })}
                    </Col>
                </div>
            </div>
        </>
    );
}
export default DragDrop;

// style={{ columnCount: 1, display: "flex" }}
