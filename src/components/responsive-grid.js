import {useCallback} from "react";
import {Grid} from "react-virtualized";
import { useViewportSize } from "../ext/hooks";
import State from "../lib/stater";


export default function ResponsiveGrid({
    data = [],
    xs = 2,
    sm = 3,
    md = 4,
    lg = 5,
    xl = 6,
    rowHeight = 100,
    render = ()=>{}
}){
    const [width, height] = useViewportSize();

    const defineColCount = useCallback(()=>{
        if(width >= 1200) return xl;
        if(width >= 992) return lg;
        if(width >= 768) return md;
        if(width >= 480) return sm;
        return xs;
    },[width]);

    const columnCount = defineColCount();

    const containerWidth = width - State.get("app")[0].width - 3;

    const defineColWidth = useCallback(()=>{
        const container = width - State.get("app")[0].width;
        return Math.floor(container / columnCount);
    }, [columnCount]);

    const columnWidth = defineColWidth();
    rowHeight = columnWidth;
    let rowCount = Math.floor(data.length / columnCount);
    if(data.length % columnCount > 0){
        rowCount++;
    }
    rowCount = isNaN(rowCount) ? 1 : rowCount;

    console.log('[TST]',{
        width,
        rowCount,
        containerWidth,
        height,
        columnWidth,
        columnCount,
        rowHeight
    });

    // return null;

    return (
        <Grid
            columnCount={columnCount}
            rowCount={rowCount}
            autoContainerWidth={true}
            height={height}
            width={containerWidth}
            rowHeight={rowHeight}
            cellRenderer={render}
            columnWidth={columnWidth}
        />
    )
}