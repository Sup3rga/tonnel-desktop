import Appbar from "./appbar";


export default function ExposedView({
    wall = null,
    title = "",
    children = [],
    style = {},
    className=""
}){
    
    return (
        <div className={["ui-container ui-fluid exposition ui-column ui-unwrap", className].join(" ")} style={style}>
            <Appbar title="" withSearch={false}/>
            <div className="ui-container ui-size-fluid wall" style={{
                backgroundImage: `url(${wall})`
            }}>
                <div className="ui-container ui-fluid ui-vertical-bottom mask">
                    <label className="ui-container title ui-size-fluid ui-text-ellipsis">{title}</label>
                </div>
            </div>
            <div className="ui-container ui-size-fluid body ui-no-scroll">
                <div className="ui-container ui-fluid-height ui-size-fluid content ui-scroll-y">
                    {children}
                </div>
            </div>
        </div>
    )
}