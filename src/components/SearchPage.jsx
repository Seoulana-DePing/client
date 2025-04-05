import styled from "styled-components";
import WalletConnect from "./WalletConnect";

function SearchPage({ onSearch }) {
  return (
    <SearchContainer>
      <SearchBox>
        <WalletConnect />
        <SearchButton onClick={onSearch}>Search Location</SearchButton>
      </SearchBox>
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

export default SearchPage;
