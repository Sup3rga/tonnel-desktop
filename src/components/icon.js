
export default function Icon(props){
    const {mode = "uni", icon, onClick= ()=>{}, className = "", outlined = true}  = props;
    const style = ['line','ion', 'uni'].indexOf(mode.toString().toLowerCase()) >= 0 ? mode.toLowerCase() : 'uni';
    let prefix = "";
    switch (mode){
        case "line":
            prefix = "las la-";
        break;
        case "ion":
            prefix = "ion-";
        break;
        default:
            prefix = outlined ? "uil uil-" : "uis uis-";
        break;
    }
    const cls = prefix+icon+" "+className;
    return (
        <i
            {...props}
            className={cls}
            onClick={onClick}
        />
    )
}