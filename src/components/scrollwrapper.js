

export default function ScrollWrapper({className,children}){
    return (
        <div className={["ui-container ui-size-fluid body ui-no-scroll",className].join(" ")}>
            <div className="ui-element ui-fluid-height ui-size-fluid content ui-scroll-y">
                {children}
            </div>
        </div>
    )
}