import Icon from "./icon";
import LineTimer from "./line-timer";

export default function PlayerBar(){

    return (
        <div className="ui-container ui-size-fluid ui-fluid-height control-bar">
            <div className="ui-container ui-size-4 ui-md-size-3 ui-lg-size-2 ui-unwrap">
                <div className="ui-container album-art ui-all-center ui-all-center">
                    <Icon icon="music-note"/>
                </div>
                <div className="ui-container music-info">
                    <label className="ui-container ui-size-fluid title">Music title</label>
                    <label className="ui-container ui-size-fluid artist">Artist name</label>
                </div>
            </div>
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-1 ui-unwrap ui-vertical-center controls">
                <button>
                    <Icon icon="step-backward"/>
                </button>
                <button>
                    <Icon icon="play"/>
                </button>
                <button>
                    <Icon icon="skip-forward"/>
                </button>
            </div>
            <div className="ui-container ui-size-4 ui-md-size-5 ui-lg-size-6 time-control ui-vertical-center">
                <label className="ui-container ui-all-center ui-size-2 time">
                    0:00
                </label>
                <div className="ui-container ui-all-center ui-size-8">
                    <LineTimer/>
                </div>
                <label className="ui-container ui-all-center ui-size-2 time">
                    0:00
                </label>
            </div>
            <div className="ui-container ui-size-2 ui-md-size-2 ui-lg-size-3 ui-vertical-center queue-control ui-unwrap">
                <button>
                    <Icon icon="sync"/>
                </button>
                <button>
                    <Icon icon="shuffle"/>
                </button>
                <div className="ui-container ui-size-5 ui-all-center ui-unwrap">
                    <button>
                        <Icon icon="volume"/>
                    </button>
                    <div className="ui-container ui-size-7 volume">
                        <LineTimer/>
                    </div>
                </div>
            </div>
        </div>
    )
}