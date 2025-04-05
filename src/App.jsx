import { useState } from "react";
import SearchPage from "./components/SearchPage";
import MapPage from "./components/MapPage";
import styled from "styled-components";

function App() {
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedCountry, _] = useState(null);
  const [geoData, setGeoData] = useState({
    selectedCountry: null,
    coordinates: {},
  });

  // 예시 데이터
  const exCountry = "KR"; // 국가 코드 (예: 한국)
  const exCoordinates = {
    latitude: 36.009498296798375,
    longitude: 127.82239717049633,
  };

  // 페이지 전환을 위한 핸들러
  const handleSearch = (data) => {
    setCurrentPage("map");
    setGeoData(data);
    // setGeoData({
    //   selectedCountry: exCountry,
    //   coordinates: exCoordinates,
    // });
  };

  const handleBack = () => {
    setCurrentPage("search");
  };

  return (
    <AppContainer>
      {currentPage === "search" ? (
        <SearchPage onSearch={handleSearch} />
      ) : (
        <MapPage
          selectedCountry={geoData["selectedCountry"]}
          coordinates={geoData["coordinates"]}
          onBack={handleBack}
        />
      )}
    </AppContainer>
  );
}

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5; // 배경색 추가
`;

export default App;
