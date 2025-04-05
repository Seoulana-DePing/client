import { useState } from "react";
import SearchPage from "./components/SearchPage";
import MapPage from "./components/MapPage";
import styled from "styled-components";

function App() {
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <AppContainer>
      {currentPage === "search" ? (
        <SearchPage onSearch={() => setCurrentPage("map")} />
      ) : (
        <MapPage
          selectedCountry={selectedCountry}
          onBack={() => setCurrentPage("search")}
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
`;

export default App;
