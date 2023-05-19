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
//
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
    const [selectedViewer, setSelectedViewer] = useState<string>("Dan");

    function updateViewerName(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedViewerName = event.target.value;
        setSelectedViewer(selectedViewerName);

        const selectedViewerData = allViewers.find(
            (viewer) => viewer.username === selectedViewerName
        );

        if (selectedViewerData) {
            setWatchList(selectedViewerData.watchlist);
        }
    }
    function updateModerator(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentModerator({
            ...currentModerator,
            username: event.target.value
        });
    }
    const [currentCreator, setCurrentCreator] = useState<Creator>({
        username: "",
        createdVideos: [],
        flaggedVideos: [],
        viewers: [],
        blockedUsers: []
    });

    function updateCreator(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentCreator({
            ...currentCreator,
            username: event.target.value
        });
    }

    const [allVideos, setAllVideos] = useState<Video[]>(VIDEOS);
    const [watchList, setWatchList] = useState<Video[]>([]);
    const [uploadMode, setUploadMode] = useState<boolean>(false);
    function updateMode(event: React.ChangeEvent<HTMLInputElement>) {
        setUploadMode(event.target.checked);
    }

    const [videoName, setName] = useState<string>("");
    function updateName(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    const [videoDescription, setDescription] = useState<string>("");
    function updateDescription(event: React.ChangeEvent<HTMLInputElement>) {
        setDescription(event.target.value);
    }

    const [videoImage, setVideoImage] = useState<string>(placeholderimage);
    function updateImage(event: React.ChangeEvent<HTMLInputElement>) {
        setVideoImage(event.target.value);
    }

    const [videoGenre, setGenre] = useState<string>("");
    function updateGenre(event: React.ChangeEvent<HTMLInputElement>) {
        setGenre(event.target.value);
    }

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

    const selectedViewerData = allViewers.find(
        (viewer) => viewer.username === selectedViewer
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const viewerWatchlist = selectedViewerData
        ? selectedViewerData.watchlist
        : [];

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

    function deleteVideoFromCentralList(vid: Video) {
        const newCentralList = allVideos.filter(
            (video: Video) => video.name !== vid.name
        );
        setAllVideos(newCentralList);
    }

    function deleteVideoFromCreatorList(vid: Video) {
        const newCreatorList = currentCreator.createdVideos.filter(
            (video: Video) => video.name !== vid.name
        );
        const newCreator = { ...currentCreator, createdVideos: newCreatorList };
        setCurrentCreator(newCreator);
    }

    function deleteFromReviewList(vid: Video) {
        const newList = currentModerator.review_list.filter(
            (video: Video) => video.name !== vid.name
        );
        const newModerator = { ...currentModerator, review_list: newList };
        setCurrentModerator(newModerator);
    }

    function approveVideo(vid: Video) {
        deleteFromReviewList(vid);
        updateCentralList({ ...vid, isReported: false });
        updateCreatorVideos({ ...vid, isReported: false });
        updateWatchList({ ...vid, isReported: false });
    }

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
            /*
            const newList = watchList.filter(
                (video: Video, num: number) => num !== index
            );
            const updatedViewers = allViewers.map((viewer) => {
                return { ...viewer, watchlist: newList };
            });
            setAllViewers(updatedViewers);
            */
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

    function addVideoToCentralList(video: Video) {
        const newVideos = [...allVideos, video];
        setAllVideos(newVideos);
    }

    function updateCentralList(toEdit: Video) {
        const vidNames = allVideos.map((video: Video) => video.name);
        if (vidNames.includes(toEdit.name)) {
            const newVideos = allVideos.map((video: Video) => {
                return video.name === toEdit.name ? toEdit : video;
            });
            setAllVideos(newVideos);
        }
    }

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
            setWatchList((prevWatchlist) => [...prevWatchlist, videoToAdd]);
        }
        updatePrevWatchlist();
    }

    function updateWatchList(toEdit: Video) {
        setAllViewers((prevViewers) =>
            prevViewers.map((viewer) => {
                if (viewer.username === selectedViewer) {
                    const newWatchlist = viewer.watchlist.map(
                        (video: Video) => {
                            return video.name === toEdit.name ? toEdit : video;
                        }
                    );
                    return {
                        ...viewer,
                        watchlist: newWatchlist
                    };
                }
                return viewer;
            })
        );

        setWatchList((previous) =>
            previous.map((video: Video) => {
                return video.name === toEdit.name ? toEdit : video;
            })
        );
    }

    const [filteredWatchlist, setFilteredWatchlist] = useState<string>("");
    function filterWatchlistAlphabet() {
        setFilteredWatchlist("Name");
        const sortedData = [...watchList].sort((vid1, vid2) => {
            return vid1.name.localeCompare(vid2.name);
        });
        setWatchList(sortedData);
    }

    function filterWatchlistGenre() {
        if (filteredWatchlist != null) {
            setFilteredWatchlist("Genre");
            const sortedData = [...watchList].sort((vid1, vid2) => {
                return vid1.genre === vid2.genre
                    ? vid1.name.localeCompare(vid2.name)
                    : vid1.genre.localeCompare(vid2.genre);
            });
            setWatchList(sortedData);
        }
    }
    const [filteredVideos, setFilteredVideos] = useState<string>("");
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

    const [prevWatchlist, setPrevWatchlist] = useState<Viewer[]>([
        { username: "Dan", watchlist: [] },
        { username: "Jess", watchlist: [] },
        { username: "James", watchlist: [] }
    ]);
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

    const [currentSearch, setCurrentSearch] = useState<string>("");
    function updateCurrentSearch(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value);
    }
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

    const [newViewerName, setNewViewerName] = useState<string>("");
    function addViewer() {
        const newViewer = { username: newViewerName, watchlist: [] };
        setAllViewers((prevViewers) => [...prevViewers, newViewer]);
        setSelectedViewer(newViewerName);
        setNewViewerName("");
    }

    function handleNewViewer(event: React.ChangeEvent<HTMLInputElement>) {
        setNewViewerName(event.target.value);
    }

    function deleteViewer(username: string) {
        setAllViewers((prevViewers) =>
            prevViewers.filter((viewer) => viewer.username !== username)
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
                            <Col style={{ columnCount: 3 }}>
                                {allVideos.map(
                                    (video: Video, index: number) => {
                                        return (
                                            <ul
                                                key={video.name}
                                                style={{ breakInside: "avoid" }}
                                            >
                                                <VideoComponent
                                                    key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}`}
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
                                                    updateWatchList={
                                                        updateWatchList
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
                                {viewerWatchlist.map(
                                    (video: Video, index: number) => {
                                        return (
                                            <div key={video.name}>
                                                <VideoComponent
                                                    key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}`}
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
                                                    updateWatchList={
                                                        updateWatchList
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
                                                key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}`}
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
                                                updateWatchList={
                                                    updateWatchList
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
                                            ></VideoComponent>
                                        );
                                    }
                                )}
                            </div>
                        </Col>
                    </Row>
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
                    <Row>
                        <Col>
                            {currentCreator.createdVideos.map(
                                (video: Video, index: number) => {
                                    return (
                                        <VideoComponent
                                            key={`${video.name}-${video.likes}-${video.isReported}-${video.wantRecommended}-${video.commentList}`}
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
                                            updateWatchList={updateWatchList}
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
                                            data-testid="creator-list"
                                        ></VideoComponent>
                                    );
                                }
                            )}
                        </Col>
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
            </div>
        </>
    );
}
export default DragDrop;

// style={{ columnCount: 1, display: "flex" }}
