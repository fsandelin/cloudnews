import { mapGetters, mapActions } from 'vuex';
import * as d3 from "d3";

const sizeOfCurrentWindow = () => { 
  const ratio = 2.1;
  const width = d3.select("#main-section").node().getBoundingClientRect().width;
  const height = d3.select("#main-section").node().getBoundingClientRect().height;
  const size =
    width * ratio < height
      ? width/500
      : height/500;
  return size;
}

export const mapZoom = (setZoomValue) => {
  return d3
    .zoom()
    .wheelDelta(() => {
      let deltaY = d3.event.deltaY > 0 ? 125 : -125
      return -deltaY * (1) / 500;
    })
    .scaleExtent([0.2, 50])
    .on("zoom", () => {
      d3.select(".map").attr("transform", d3.event.transform);
    
      if (d3.event.transform.k !== this.zoomValue) {
        setZoomValue(d3.event.transform.k);
      }
    })
}

export const transitionToCounty = (mapZoom, county) => {
  const x = county.x;
  const y = county.y;
  const size = sizeOfCurrentWindow();
  const newZoomValue = 3.0*size;
  const xOffset = (100*(size/newZoomValue))
  d3.select(".mapContainer").transition().duration(450).call(mapZoom.translateTo, x+ xOffset, y)
                            .transition().duration(200).call(mapZoom.scaleTo, newZoomValue);
}

export const longTransitionToCounty = (mapZoom, county) => {
  const x = county.x;
  const y = county.y;
  const size = sizeOfCurrentWindow()
  const newZoomValue = 3.0*size;
  const xOffset = (100*(size/newZoomValue))
  d3.select(".mapContainer").transition().duration(350).call(mapZoom.scaleTo, 1)
                            .transition().duration(450).call(mapZoom.translateTo, x+ xOffset, y)
                            .transition().duration(350).call(mapZoom.scaleTo, newZoomValue);
                 
}

export const initialZoom = (mapZoom) => {
  const size = sizeOfCurrentWindow();
  d3.select(".mapContainer").call(mapZoom.translateTo, 550,255);
  d3.select(".mapContainer").call(mapZoom.scaleTo, 0.5*size);
  d3.select(".mapContainer").transition().duration(750).call(mapZoom.scaleTo, 0.9*size);
}
