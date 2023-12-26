import {useState} from "react";
import State from "./lib/stater";
import { useEffect } from "react";
import { useViewportSize } from "./ext/hooks";
import { Library } from "./ext/library";
import SplashScreen from "./views/splashscreen";
import UI from "./views/ui";
import PlayerUI from "./views/playerui";

const {bridge : {initialize, isReady, exchange, activateWatcher} } = window;

function App() {
  const [state] = State.init("app", useState({
      libraryReady: false,
      launched : false,
      initialize: true,
      playerUiActive: false,
      feed: {
        music: 0,
        album: 0,
        artist: 0
      },
      floatingBar: false
  })).get("app");

  useEffect(()=>{
      isReady().then((ready)=>{
        if(ready){
            exchange.emit("hide");
            State.set("app", {
                libraryReady: true
            });
            Library.all()
            .then(()=> Library.albumlist())
            .then(()=> Library.artistList())
            .then(()=>{
                activateWatcher();
                exchange.emit("resize", {
                    resizable: true
                }).then(()=>{
                    State.set("app", {launched: true});
                    setTimeout(()=> exchange.emit("show"), 300);
                }); 
            })   
            return;
        }
        State.set("app", {
            initialize: false
        });
        
        initialize((feed)=>{
           State.set("app", {feed});
        }).then((list)=>{
           State.set("app", {
               libraryReady: true
           });
            activateWatcher();
            exchange.emit("hide");
            exchange.emit("resize", {
                resizable: true
            }).then(()=>{
                State.set("app", {launched: true});
                setTimeout(()=> exchange.emit("show"), 300);
            });
            //    exchange.emit("background-change", "#eee");
        //    exchange.emit("resize", {
        //         width: 800, 
        //         height: 500, 
        //         resizable: true
        //     }); 
        });
      })
  }, []);

  if(!state.libraryReady) return <SplashScreen initialize={state.initialize} feed={state.feed}/> 

  if(!state.launched) return null;

  return (
      <>
        <UI active={!state.playerUiActive}/>
        <PlayerUI active={state.playerUiActive}/>
      </>
  )
}

export default App;