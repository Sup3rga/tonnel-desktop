import { useEffect } from "react"


export default function SplashScreen({
    initialize,
    feed = {}
}){

    return (
        <div id="app-main" className="ui-container ui-vfluid app-main splash ui-no-scroll initializer">
            <div className="ui-container ui-size-fluid image ui-all-center">
                <div className="ui-element app-name ui-column">
                    <h1>TonneL</h1>
                    <br/>
                    <label className="ui-element">Tone never loud</label>
                </div>
            </div>
            <div className="ui-container ui-size-fluid info">
                <label className="ui-container ui-size-fluid message">
                    {initialize ? "Initializing..." : "Retrieving data from library" }
                </label>
                {
                    initialize ? null :
                    <>
                        <div className="ui-container ui-size-fluid item">
                            <label>{feed.music}</label> <b>musics</b>
                        </div>
                        <div className="ui-container ui-size-fluid item">
                            <label>{feed.album}</label> <b>albums</b>
                        </div>
                        <div className="ui-container ui-size-fluid item">
                            <label>{feed.artist}</label> <b>artists</b>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}