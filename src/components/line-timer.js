

export default function LineTimer({
    progression = 0,
    onChange = ()=>{}
}){

    return (
        <div className="ui-container ui-size-fluid line-container ui-all-center ui-unwrap">
            <div className="ui-container ui-size-fluid line">
                <div className="ui-container indicator" style={{width: progression+'%'}}/>
            </div>
            <div className="ui-container marker" style={{
                left : progression+'%',
                transform: 'translate3d(-4px,-50%,0)'
            }}/>
        </div>
    )
}