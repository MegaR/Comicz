import React from "react";
import './readerpage.scss';
import api from "../../../services/api";
import {Card, IconButton} from "material-ui";
import {LoadingIndicator} from "../../loadingindicator/loadingindicator";
import GestureRecognizer from "./gesture_recognizer";
import {ErrorBoundary} from "../../errorboundary";

export class ReaderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pageNumber: 0, totalPages: 0, pages: [], zoom: 0, offsetX: 0, offsetY: 0, showUI: true, error: null};
    }

    get canvas() {
        return this.refs.canvas;
    }

    get currentPage() {
        return this.state.pages[this.state.pageNumber];
    }

    getScale(zoom) {
        return 1+zoom;
    }

    componentDidMount() {
        this.resizeListener = () => this.resize();
        window.addEventListener('resize', this.resizeListener);
        this.fullscreenListener = ()=>this.setState(this.state);
        document.addEventListener('webkitfullscreenchange', this.fullscreenListener);
        this.resize();
        this.gestureRecognizer = new GestureRecognizer(this.canvas, {
            next: () => this.nextPage(),
            previous: () => this.previousPage(),
            zoom: direction => this.zoom(-direction),
            move: offset => {
                this.setState({
                    offsetX: this.state.offsetX + offset.x,
                    offsetY: this.state.offsetY + offset.y
                });
            },
            scroll: direction => this.zoom(direction),
            tap: () => this.toggleUI()
        });

        const params = this.props.match.params;
        api.issueDetails(params.issueId, params.source, params.volume, params.issue)
            .then(async data => {
                data.progress = data.progress>data.totalPages-1?data.totalPages-1:data.progress;

                if(data.totalPages == 0) {
                    this.setState({error: "Error issue number not found!"});
                }

                this.setState({
                    pageNumber: data.progress,
                    totalPages: data.totalPages
                });

                const promises = [];
                for(let i = 0; i < data.totalPages; i++) {
                    promises.push(this.loadPage((data.progress + i) % data.totalPages));
                }
                await Promise.all(promises);
                console.info('finished downloading pages');
            })
            .catch(error => {
                console.error(error);
                this.setState({error: error});
            });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
        document.removeEventListener('webkitfullscreenchange', this.fullscreenListener);
        this.gestureRecognizer.stopEventListeners();
        if(document.webkitCurrentFullScreenElement) {
            document.webkitExitFullscreen();
        }
    }

    componentDidUpdate() {
        this.renderCanvas();
    }

    toggleUI() {
        this.setState({showUI: !this.state.showUI});
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.renderCanvas();
    }

    zoom(direction) {
        let zoom = this.state.zoom;
        zoom += direction;
        if(this.getScale(zoom) <= 0) zoom -= direction;
        this.setState({zoom: zoom});
    }

    async loadPage(pageNumber) {
        if (this.state.pages[pageNumber]) {
            return;
        }

        const params = this.props.match.params;
        try {
            const page = await api.page(params.issueId, params.source, params.volume, params.issue, pageNumber);
            this.setState((prevState) => {
                prevState.pages[pageNumber] = page;
                return prevState;
            });
        } catch (error) {
            console.error(error);
            this.setState({error: error});
        }
    }

    renderCanvas() {
        if(this.state.error) return;

        const canvas = this.canvas;
        const context = canvas.getContext('2d');
        context.imageSmoothingQuality = 'high';
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (this.currentPage) {
            const height = this.canvas.height * this.getScale(this.state.zoom);
            const width = this.currentPage.naturalWidth / this.currentPage.naturalHeight * height;

            let x = (window.innerWidth / 2) - (width / 2) + this.state.offsetX;
            let y = this.state.offsetY;

            context.drawImage(this.currentPage, x, y, width, height);
        }
    }

    close() {
        window.history.back();
    }

    fullscreen() {
        if(document.webkitCurrentFullScreenElement) {
            document.webkitExitFullscreen();
        } else {
            document.body.webkitRequestFullscreen();
        }
    }

    nextPage() {
        let pageNum = this.state.pageNumber + 1;
        if(pageNum > this.state.totalPages - 1) pageNum = this.state.totalPages - 1;
        this.setState({pageNumber: pageNum, offsetY: 0, offsetX: 0});

        if(pageNum === this.state.totalPages -1) {
            api.markFinished(this.props.match.params.issueId, true);
        } else {
            api.setProgress(this.props.match.params.issueId, pageNum);
        }

        this.loadPage(pageNum);
    }

    previousPage() {
        let pageNum = this.state.pageNumber - 1;
        if(pageNum < 0) pageNum = 0;
        this.setState({pageNumber: pageNum, offsetY: 0, offsetX: 0});
        api.setProgress(this.props.match.params.issueId, pageNum);
        this.loadPage(pageNum);
    }

    render() {
        if(this.state.error) {
            return <div>
                <Card>
                    <h1>Something went wrong.</h1>
                    <pre>{'' + this.state.error}</pre>
                </Card>
            </div>;
        }

        const classes = ["readerpage"];
        if(!this.state.showUI) classes.push('hide-ui');
        return <div className={classes.join(' ')}>
            <canvas ref="canvas"/>
            {document.body.webkitRequestFullScreen &&
            <IconButton className="fullscreen" iconClassName="material-icons"
                        onClick={()=>this.fullscreen()}>
                {document.webkitCurrentFullScreenElement?'fullscreen_exit':'fullscreen'}
            </IconButton>
            }
            <IconButton className="close" iconClassName="material-icons" onClick={() => this.close()}>close</IconButton>
            <IconButton className="next-page" iconClassName="material-icons" onClick={() => this.nextPage()}>keyboard_arrow_right</IconButton>
            <IconButton className="previous-page" iconClassName="material-icons" onClick={() => this.previousPage()}>keyboard_arrow_left</IconButton>
            <IconButton className="zoom-out" iconClassName="material-icons" onClick={() => this.zoom(-0.25)}>zoom_out</IconButton>
            <IconButton className="zoom-in" iconClassName="material-icons" onClick={() => this.zoom(0.25)}>zoom_in</IconButton>
            {this.state.totalPages && <div className="page-numbers">{this.state.pageNumber + 1} / {this.state.totalPages}</div>}
            {!this.currentPage && <LoadingIndicator/>}
        </div>;
    }

}