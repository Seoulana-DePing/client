import styled from "styled-components";
import WorldMap from "./WorldMap";

function MapPage({ onBack, selectedCountry, coordinates }) {
  console.log(selectedCountry, coordinates);
  return (
    <MapContainer>
      <BackArrow onClick={onBack}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </BackArrow>
      <MapWrapper>
        <WorldMap selectedCountry={selectedCountry} coordinates={coordinates} />
      </MapWrapper>
    </MapContainer>
  );
}

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MapWrapper = styled.div`
  width: 100vh;
  height: 100vh;
`;

const BackArrow = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #000000;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default MapPage;
