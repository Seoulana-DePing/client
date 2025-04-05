import { useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import styled from "styled-components";

function WorldMap({ selectedCountry, coordinates }) {
  const [geoData, setGeoData] = useState(null);
  const [mapRoot, setMapRoot] = useState(null);

  // JSON 파일 로드
  useLayoutEffect(() => {
    fetch("/geo/worldLow.json")
      .then((response) => response.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  }, []);

  useLayoutEffect(() => {
    if (!geoData) return;

    let root;
    if (!mapRoot) {
      root = am5.Root.new("chartdiv");
      setMapRoot(root);
    } else {
      root = mapRoot;
    }

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "none",
        panY: "none",
        wheelY: "none",
        projection: am5map.geoMercator(),
        layout: root.horizontalLayout,
        homeZoomLevel: 1,
        maxZoomLevel: 1,
        minZoomLevel: 1,
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: geoData,
        exclude: ["AQ"],
        fill: am5.color(0xdadada),
      })
    );

    const pointSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
      })
    );

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
      pointSeries.data.setAll([
        {
          longitude: coordinates.longitude,
          latitude: coordinates.latitude,
        },
      ]);
    }

    if (selectedCountry) {
      polygonSeries.events.on("datavalidated", function () {
        const dataItem = polygonSeries.getDataItemById(selectedCountry);

        if (dataItem) {
          const polygon = dataItem.get("mapPolygon");
          if (polygon) {
            polygon.set("fill", am5.color("#B5C0F1")); // 원하는 색으로
            polygon.set("stroke", am5.color("#DEE8F4")); // 테두리도 바꿀 수 있어
            polygon.set("strokeWidth", 2);
          }
        }
      });
    }
  }, [geoData, selectedCountry, coordinates]);

  return <MapContainer id="chartdiv" />;
}

const MapContainer = styled.div`
  width: 100vh;
  height: 100vh;
`;

export default WorldMap;
