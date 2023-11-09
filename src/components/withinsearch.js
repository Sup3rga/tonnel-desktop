import Icon from "./icon";

export default function WithinSearch({children, title = "", style = {}}){
    console.log('[Style]',style);
    return (
        <div className="ui-container ui-fluid view-search" style={style}>
            <div className="ui-container ui-size-fluid search-zone ui-unwrap ui-vertical-center">
                <div className="ui-container nav-box">
                    <Icon icon="angle-left"/>
                    <Icon icon="angle-right"/>
                </div>
                <label className="ui-container ui-size-2">{title}</label>
                <div className="ui-container ui-size-7 ui-unwrap field">
                    <Icon icon="search"/>
                    <input type="text" placeholder="search something" className="ui-container ui-size-fluid"/>
                </div>
            </div>
            <div className="ui-container ui-size-fluid scroll-view ui-scroll-y">
                {children}
            </div>
        </div>
    )
}