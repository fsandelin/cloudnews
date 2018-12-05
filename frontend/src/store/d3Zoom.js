import d3 from '../store/d3Importer.js';
import { event as d3Event } from 'd3-selection';


export const sizeOfCurrentWindow = () => { 
  const ratio = 2.1;
  const width = d3.select("#main-section").node().getBoundingClientRect().width;
  const height = d3.select("#main-section").node().getBoundingClientRect().height;
  const size =
    width * ratio < height
      ? width/500
      : height/500;
  return size;
}

let currentZoom = null;

export const mapZoom = (setZoomValue) => {
  return d3
    .zoom()
    .scaleExtent([0.45, 50])
    .on("zoom", () => {
      d3.select(".map").attr("transform", d3Event.transform);
      if (d3Event.transform.k !== currentZoom) {
        currentZoom = d3Event.transform.k;
        setZoomValue(d3Event.transform.k);
      }
    })
}

const determineValues = (county) => {
  const x = county.x;
  const y = county.y;
  const size = sizeOfCurrentWindow()
  const newZoomValue = 1.25*size;
  const scaleMultiplier = 358/Math.max(county.width, county.height);
  const xOffset = (100*(size*(1/scaleMultiplier)/newZoomValue));
  return {
    x: x+xOffset,
    y: y,
    newZoomValue: newZoomValue*scaleMultiplier,
  }
}

export const transitionToCounty = (mapZoom, county) => {
  let { x, y, newZoomValue } = determineValues(county);
  d3.select(".mapContainer").transition().duration(450).call(mapZoom.translateTo, x, y)
                            .transition().duration(200).call(mapZoom.scaleTo, newZoomValue);
}

export const longTransitionToCounty = (mapZoom, county) => {
  let { x, y, newZoomValue } = determineValues(county);
  d3.select(".mapContainer").transition().duration(350).call(mapZoom.scaleTo, 0.6)
                            .transition().duration(450).call(mapZoom.translateTo, x, y)
                            .transition().duration(350).call(mapZoom.scaleTo, newZoomValue);
                 
}

export const initialZoom = (mapZoom) => {
  const size = sizeOfCurrentWindow();
  const x = 96.85589492211898;  //Some x somewhere to the right of sweden
  const y = 419.64406816831024; //Some y somewhere in the middle of sweden
  d3.select(".mapContainer").call(mapZoom.translateTo, x,y);
  d3.select(".mapContainer").call(mapZoom.scaleTo, 0.2*size);
  d3.select(".mapContainer").transition().duration(750).call(mapZoom.scaleTo, 0.45*size);
}

// const projection = d3.geoMercator().scale(2000).translate([-705.9955609952726, 3262.481908764047])

// export const XYFromLatLong = (lat, long) => {
//   return projection([long,lat])
// }