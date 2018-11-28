import * as d3 from "d3";

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

let currentZoom = undefined;

export const mapZoom = (setZoomValue) => {
  return d3
    .zoom()
    .scaleExtent([0.2, 50])
    .on("zoom", () => {
      d3.select(".map").attr("transform", d3.event.transform);
      if (d3.event.transform.k !== currentZoom) {
        currentZoom = d3.event.transform.k;
        setZoomValue(d3.event.transform.k);
      }
    })
}

export const transitionToCounty = (mapZoom, county) => {
  const x = county.x;
  const y = county.y;
  const size = sizeOfCurrentWindow();
  const newZoomValue = 1.25*size;
  const xOffset = (100*(size/newZoomValue))
  d3.select(".mapContainer").transition().duration(450).call(mapZoom.translateTo, x+xOffset, y)
                            .transition().duration(200).call(mapZoom.scaleTo, newZoomValue);
}

export const longTransitionToCounty = (mapZoom, county) => {
  const x = county.x;
  const y = county.y;
  const size = sizeOfCurrentWindow()
  const newZoomValue = 1.25*size;
  const xOffset = (100*(size/newZoomValue))
  d3.select(".mapContainer").transition().duration(350).call(mapZoom.scaleTo, 0.6)
                            .transition().duration(450).call(mapZoom.translateTo, x+xOffset, y)
                            .transition().duration(350).call(mapZoom.scaleTo, newZoomValue);
                 
}

export const initialZoom = (mapZoom) => {
  const size = sizeOfCurrentWindow();
  const xy = XYFromLatLong(62.86, 23); //Some long and latitude somewhere to the right of sweden
  const x = xy[0];
  const y = xy[1];
  d3.select(".mapContainer").call(mapZoom.translateTo, x,y);
  d3.select(".mapContainer").call(mapZoom.scaleTo, 0.2*size);
  d3.select(".mapContainer").transition().duration(750).call(mapZoom.scaleTo, 0.45*size);
}

const projection = d3.geoMercator().scale(2000).translate([-705.9955609952726, 3262.481908764047])

export const XYFromLatLong = (lat, long) => {
  return projection([long,lat])
}