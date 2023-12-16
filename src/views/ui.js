import {useState} from "react";
import Sidemenu from "../components/sidemenu";
import State from "../lib/stater";
import Explore from "./explore";
import PlayerBar from "../components/player-bar";
import Router, { Route } from "../components/router";
import Albums from "./albums";
import AlbumInfo from "./albuminfo";
import Artists from "./artists";
import ArtistInfo from "./artistinfo";

const sizes = {
    minimal : 90,
    maximal: 200
};

export default function UI({active = true}){

    const [state] = State.init("ui", useState({
        parallax : "",
        darkMode: false,
        minimal: false,
        floatingBar: false
    })).get("ui");

    document.querySelector('#root').classList[state.darkMode ? 'add' : 'remove']('dark-mode');
    console.log('[Active][UI]',active);
    return  (
        <div id="app" style={{opacity : active ? 1 : 0, zIndex : active ? 3 : 1}} className={`ui-container ui-absolute ui-all-close ui-vfluid app-main ${state.darkMode ? 'dark-theme' : ''} ui-no-scroll`}>
          <div className="ui-container ui-vfluid ui-absolute ui-all-close app-background" style={{backgroundImage: `url(${state.parallax})`}}/>
          <div className="ui-container ui-vfluid ui-absolute ui-all-close app-content">
            <div className={`ui-container ui-size-fluid app-section-1 ${state.floatingBar ? 'immersive' : ''}`}>
                <Sidemenu
                    width={state.minimal ? sizes.minimal : sizes.maximal}
                    copyColor={state.parallax}
                    minimal={state.minimal}
                />
                <div className="ui-container ui-relative ui-fluid-height" style={{width: `calc(100% - ${state.minimal ? sizes.minimal : sizes.maximal}px)`}}>
                    <Router defaultRoute="/explore" stack>
                        {/* <Explore route="/explore" width={totalWidth - (state.minimal ? sizes.minimal : sizes.maximal)} persistent/> */}
                        <Route
                            component={Explore}
                            route="/explore"
                            props
                            lazy
                            persistent
                        />
                        <Route
                            component={Albums}
                            route="/albums"
                            lazy
                            persistent
                        />
                        <Route
                            component={AlbumInfo}
                            route="/album/[\s\S]+"
                            reference="/albums"
                            lazy
                            generic
                        />
                        <Route
                            component={Artists}
                            route="/artists"
                            lazy
                            persistent
                        />
                        <Route
                            component={ArtistInfo}
                            route="/artist/[\S\s]+"
                            reference="/artists"
                            lazy
                            generic
                        />
                    </Router>
                    {!state.floatingBar ? null :
                        <PlayerBar floating={true}/>
                    }
                </div>
            </div>
            {state.floatingBar ? null :
                <div className="ui-container ui-size-fluid app-section-2 control-bar">
                    <PlayerBar/>
                </div>
            }
          </div>
      </div>
    )
}