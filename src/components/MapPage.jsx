import WorldMap from "./WorldMap";

function MapPage() {
  // 예시 데이터
  const selectedCountry = "KR"; // 국가 코드 (예: 한국)
  const coordinates = {
    latitude: 37.5665, // 위도 (예: 서울)
    longitude: 126.978, // 경도 (예: 서울)
  };

  return (
    <div>
      <WorldMap selectedCountry={selectedCountry} coordinates={coordinates} />
    </div>
  );
}

export default MapPage;
