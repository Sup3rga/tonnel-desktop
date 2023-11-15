import Appbar from "./appbar";

export default function WithinSearch({children, title = "", style = {}}){
    return (
        <div className="ui-container ui-fluid view-search" style={style}>
            <Appbar title={title}/>
            <div className="ui-container ui-size-fluid scroll-view ui-scroll-y">
                {children}
            </div>
        </div>
    )
}