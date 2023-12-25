import { useEffect,useState } from "react";
import State from "../lib/stater";
import Icon from "../components/icon";
import ImageTheme from "../lib/imagetheme";
import { defaultPlayer } from "../ext/player";
import { Library } from "../ext/library";
import SongProgression from "../components/song-progression";
import PlayerControls from "../components/player-controls";
import TabManager, {Tab, TabBody} from "../layout/tabmanager";
import ScrollWrapper from "../components/scrollwrapper";
import ArrowLine from "../components/arrowline";
import LyricsViewer from "../components/lyricsviewer";
import Musicitem from "../components/musicitem";
import MusicItem from "../components/musicitem";
import InfiniteScrolView from "../layout/infinitescrollview";

const {bridge : {exchange} } = window;

export default function PlayerUI({active = false, parallax = ""}){

    const [state] = State.init("playerui", useState({
        dark: false,
        theme: "unset",
        action_theme: "unset",
        queue: [],
        current: {},
        pullup: false,
        playContext: []
    })).get("playerui");

    // console.log('[Active][PlayerUI]',active, parallax);

    const refresh = ()=>{
        const info = defaultPlayer.getPlayInfo();
        // console.log('[Info]',info.current);
        State.set("playerui", {
            current: info.current ? info.current : {},
            queue: Library.getByPaths(info.queue),
            playContext: info.queue
        })
    }
    
    useEffect(()=>{
        exchange.emit("hide");
        if(!active){
            exchange.emit("resize", {
                resizable: true,
                restore: true
            }).then(()=> exchange.emit("show"));
            return;
        }
        exchange.emit("save-dimension");
        exchange.emit("resize", {
            width: 520,
            height: 540,
            minimal: {
                width: 670,
                height: 600
            },
            maximal: {
                width: 780,
                height: 800
            },
            resizable: true
        }).then(()=> exchange.emit("show"));
    }, [active]);

    useEffect(()=>{
        State.watch("song-start", refresh);
        State.watch("ui", ({parallax})=>{
            const colors = parallax ? new ImageTheme().setImageDataUrl(parallax).get() : [255,255,255];
            State.set("playerui", {
                theme: `rgba(${colors.join(",")}, 0.1)`,
                action_theme: `rgba(${colors.join(",")}, 0.5)`
            });
        });
    }, []);

    useEffect(()=>{
        if(defaultPlayer.isEmpty) return;
        refresh();
    }, []);

    return (
        <div className="ui-container ui-size-fluid ui-absolute ui-all-close player-ui-container" style={{
            backgroundImage: `url(${state.current.albumart})`,
            opacity : active ? 1 : 0,
            zIndex : active ? 2 : 1
        }}>
            <div style={{
                backgroundColor: state.theme
            }} className={`ui-container ui-absolute ui-all-close ui-column ui-vfluid player-ui ${active ? 'drag-zone' : ''} ${state.dark ? 'dark' : ''}`}>
                <div className="ui-container ui-absolute header">
                    <button>
                        <Icon icon="arrow-left" className="no-drag-zone" onClick={()=> State.set("app", {playerUiActive: false})}/>
                    </button>
                </div>
                <div className="ui-container ui-absolute ui-all-close mask">
                    <div className={`ui-container ui-column ui-fluid ui-all-center main-info ${state.pullup ? 'up' : ''}`}>
                        <div className="ui-container albumart ui-all-center" style={{
                            backgroundImage: `url(${state.current.albumart})`
                        }}>
                            {state.current.albumart ? null :
                                <Icon icon="music-note"/>
                            }
                        </div>
                        <div className="ui-container ui-size-fluid music-metadata">
                            <label className="ui-container ui-size-fluid title">
                                {state.current.title}
                            </label>
                            <label className="ui-container ui-size-fluid artist">
                                {state.current.artist}
                            </label>
                            <label className="ui-container ui-size-fluid album">
                                {state.current.album}
                            </label>
                        </div>
                        <div className="ui-container ui-size-fluid progression no-drag-zone">
                            <SongProgression name="song-playui-progress" className="ui-size-fluid"/>
                        </div>
                        <div className="ui-container ui-size-fluid ui-all-center controls">
                            <PlayerControls/>
                        </div>
                    </div>
                </div>
                <div className={`ui-container ui-absolute ui-bottom-close ui-left-close ui-size-fluid actions ${state.pullup ? 'up' : ''}`} style={{
                    backgroundColor: state.theme
                }}>
                    <div className="ui-container ui-size-fluid header-actions-arrow ui-horizontal-center">
                        <ArrowLine
                            down={state.pullup}
                            onClick={ () => State.set("playerui", {pullup: !state.pullup})}
                        />
                    </div>
                    <div className="ui-container ui-size-fluid tab-container ui-relative">
                        <TabManager onHeadClick={()=>State.set("playerui", {pullup: true})}>
                            <Tab name="queue" label="Queue"/>
                            <TabBody name="queue">
                                <ScrollWrapper className="queue-list ui-fluid no-drag-zone">
                                    <InfiniteScrolView
                                        data={state.queue}
                                        limit={20}
                                        name="playerui-queue"
                                        grouped={false}
                                        render={(song, key)=>{
                                            return (
                                                <Musicitem key={key} {...song} contextParent={state.playContext} className="ui-size-fluid" cell={false}/>
                                            )
                                        }}
                                    />
                                </ScrollWrapper>
                            </TabBody>
                            <Tab name="lyrics" label="Lyrics"/>
                            <TabBody name="lyrics">
                                <LyricsViewer
                                    lyrics={
                                        'synchronisedLyrics' in state.current && state.current.synchronisedLyrics[0].synchronisedText.length ?
                                            state.current.synchronisedLyrics[0] :
                                            'unsynchronisedLyrics' in state.current ?
                                                state.current.unsynchronisedLyrics :
                                                    null
                                    }
                                    synchronised={'synchronisedLyrics' in state.current && state.current.synchronisedLyrics[0].synchronisedText.length}
                                />
                            </TabBody>
                        </TabManager>
                    </div>
                </div>
            </div>
        </div>
    )
}