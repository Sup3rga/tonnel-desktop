import Sidemenu from "./components/sidemenu";
import State from "./lib/stater";
import {useState} from "react";
import Explore from "./views/explore";
import { useEffect } from "react";
import { useViewportSize } from "./ext/hooks";
import PlayerBar from "./components/player-bar";
import Router, { Route } from "./components/router";
import Albums from "./views/albums";
import AlbumInfo from "./views/albuminfo";
import Artists from "./views/artists";
import ArtistInfo from "./views/artistinfo";

const {bridge : {initialize, isReady, exchange} } = window;
const sizes = {
    minimal : 90,
    maximal: 200
};

function App() {
  const [totalWidth] = useViewportSize();
  const [state] = State.init("app", useState({
      libraryReady: false,
      initialize: true,
      parallax : "",
      darkMode: false,
      minimal: false,
      feed: {
        music: 0,
        album: 0,
        artist: 0
      },
      floatingBar: false
  })).get("app");

  useEffect(()=>{
      isReady().then((ready)=>{
        console.log('[ready]', ready);

        if(ready){
            State.set("app", {
                libraryReady: true
            });
            exchange.emit("resize", {
                resizable: true
            });    
            return;
        }
        State.set("app", {
            initialize: false
        });

        initialize((feed)=>{
           State.set("app", {feed});
        }).then((list)=>{
           console.log('[List]',list);
           State.set("app", {
               libraryReady: true
           });
           exchange.emit("resize", {
                width: 800, 
                height: 500, 
                resizable: true
            }); 
        });
      })
  }, []);

  if(!state.libraryReady){
    return (
        <div className="ui-container ui-vfluid app-main splash ui-no-scroll initializer">
            <div className="ui-container ui-size-fluid image ui-all-center">
                <div className="ui-element app-name ui-column">
                    <h1>TonneL</h1>
                    <br/>
                    <label className="ui-element">Tone never loud</label>
                </div>
            </div>
            <div className="ui-container ui-size-fluid info">
                <label className="ui-container ui-size-fluid message">
                    {state.initialize ? "Initializing..." : "Retrieving data from library" }
                </label>
                {
                    state.initialize ? null :
                    <>
                        <div className="ui-container ui-size-fluid item">
                            <label>{state.feed.music}</label> <b>musics</b>
                        </div>
                        <div className="ui-container ui-size-fluid item">
                            <label>{state.feed.album}</label> <b>albums</b>
                        </div>
                        <div className="ui-container ui-size-fluid item">
                            <label>{state.feed.artist}</label> <b>artists</b>
                        </div>
                    </>
                }
            </div>
        </div>
    );
  }

  return (
      <div className={`ui-container ui-vfluid app-main ${state.darkMode ? 'dark-theme' : ''} ui-no-scroll`}>
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
                            route="/album/[\w]+"
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
  );
}

export default App;