import { useLayoutEffect, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import styled from "styled-components";

function WorldMap({ selectedCountry, coordinates }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/geo/worldLow.json")
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  useLayoutEffect(() => {
    if (!geoData) return;

    const root = am5.Root.new("chartdiv");

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "translateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geoData,
        exclude: ["AQ"],
      })
    );

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

    pointSeries.bullets.push(function () {
      const circle = am5.Circle.new(root, {
        radius: 7,
        tooltipText: "Latitude: {latitude}\nLongitude: {longitude}",
        fill: am5.color(0xff0000),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 2,
      });
      circle.states.create("hover", {
        scale: 1.5,
      });
      return am5.Bullet.new(root, { sprite: circle });
    });

    if (coordinates) {
      pointSeries.data.push({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      chart.animate({
        key: "rotationX",
        to: -coordinates.latitude,
        duration: 1500,
        easing: am5.ease.inOut(am5.ease.cubic),
      });
      chart.animate({
        key: "rotationY",
        to: -coordinates.longitude,
        duration: 1500,
        easing: am5.ease.inOut(am5.ease.cubic),
      });
    }

    if (selectedCountry) {
      polygonSeries.events.on("datavalidated", function () {
        const dataItem = polygonSeries.getDataItemById(selectedCountry);
        if (dataItem) {
          chart.zoomToDataItem(dataItem, 2.5);
        }
      });
    }

    return () => root.dispose();
  }, [geoData, selectedCountry, coordinates]);

  return <MapContainer id="chartdiv" />;
}

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
`;

export default WorldMap;
