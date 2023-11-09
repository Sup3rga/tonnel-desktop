import Sidemenu from "./components/sidemenu";
import State from "./lib/stater";
import {useState} from "react";
import Explore from "./views/explore";
import { useEffect } from "react";
import { useViewportSize } from "./ext/hooks";
import PlayerBar from "./components/player-bar";
import Router from "./components/router";
import Albums from "./views/albums";

const {bridge : {initialize, isReady, exchange} } = window;

function App() {
  const [totalWidth] = useViewportSize();
  const [state] = State.init("app", useState({
      width: 250,
      libraryReady: false,
      initialize: true,
      parallax : "",
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
        <div className="ui-container ui-vfluid app-main ui-no-scroll initializer">
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
      <div className="ui-container ui-vfluid app-main ui-no-scroll" style={{backgroundImage: `url(${state.parallax})`}}>
          <div className={`ui-container ui-size-fluid app-section-1 ${state.floatingBar ? 'immersive' : ''}`}>
              <Sidemenu
                  width={state.width}
                  copyColor={state.parallax}
              />
              <div className="ui-container ui-relative ui-fluid-height" style={{width: `calc(100% - ${state.width}px)`}}>
                  <Router defaultRoute="/explore">
                      <Explore route="/explore" width={totalWidth - state.width} persistent/>
                      <Albums route="/albums"/>
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
  );
}

export default App;