import Appbar from "../components/appbar";
import ScrollWrapper from "../components/scrollwrapper";


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
            <ScrollWrapper className="body">
                {children}
            </ScrollWrapper>
        </div>
    )
}