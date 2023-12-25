

export default function ArrowLine({
    down = false,
    onClick = ()=>{}
}){
    return (
        <div onClick={onClick} className={`ui-container ui-size-1 no-drag-zone arrow-line ${down ? 'down' : ''}`}>
            <span className="ui-element line left"/>
            <span className="ui-element line right"/>
        </div>
    )
}