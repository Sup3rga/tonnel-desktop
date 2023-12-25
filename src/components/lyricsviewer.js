import ScrollWrapper from "./scrollwrapper";
import {useCallback, useEffect, useState} from "react";
import {extractSyncedLyrics} from "../ext/bridge";
import {defaultPlayer} from "../ext/player";


export default function LyricsViewer({
    lyrics = {},
    synchronised = false
}){
    const refs = [];
    const [references,setReferences] = useState([]);
    const [index, setIndex] = useState(0);
    const ref = (node)=>{
        refs.push(node);

    };
    let synced = {};
    const extract = useCallback((lyric)=>{
        return extractSyncedLyrics(lyric);
    }, [lyrics]);
    if(synchronised){
        synced = extract(lyrics.synchronisedText);
    }
    const updateLyrics = (time)=>{
        let index = -1;
        // console.log('[Time]',time)
        for(let i = 0, j = synced.timestamps.length; i < j; i++){
            if(
                synced.timestamps[i] <= time &&
                (synced.timestamps[i + 1] > time || i === j - 1)
            ){
                index = i;
                break;
            }
        }
        if(index >= 0)
        // console.log('[Index]', [refs[index]]);
        setIndex(index);
    }

    useEffect(()=>{
        if(!synchronised) return;
        // console.log('[Synced]', synced.timestamps)
        // console.log('[Element]', [refs[5]])
        setReferences(refs);
        defaultPlayer.on("progress", ({currentTime})=>{
            // console.log('[current]', Math.ceil(currentTime * 1000))
            updateLyrics(Math.ceil(currentTime * 1000));
        })
    }, [lyrics]);
    if(!lyrics || (synchronised && !lyrics.synchronisedText.length) || !lyrics.text){
        return (
            <div className="ui-container ui-all-center ui-fluid no-lyrics">
                <label>No lyrics found for this song</label>
            </div>
        )
    }
    console.log('[Lyrics]',lyrics);
    return (
        <ScrollWrapper
            className={`lyrics-container ${synchronised ? '' : 'unsynchronised'} no-drag-zone`}
            centered={true}
            scroll={synchronised && index >= 0 && references[index] ? references[index].offsetTop : 0}
        >
            {(synchronised ? synced.texts : lyrics.text.split("\n")).map((text, key)=>{
                return (
                    <div key={key} ref={synchronised ? ref : null} className={`ui-container ${synchronised ? 'ui-horizontal-center' : ''} ${synchronised && key === index ? 'active' : ''} ui-size-fluid lyrics-bar`}>{text}</div>
                )
            })}
        </ScrollWrapper>
    )
}