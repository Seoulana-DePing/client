import { useState, useEffect } from "react";
import styled from "styled-components";
import WalletConnect from "./WalletConnect";
import { wsService } from "../services/websocket";

import * as web3 from "@solana/web3.js";
import { Buffer } from "buffer";

function SearchPage({ onSearch }) {
  const [ip, setIp] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 컴포넌트 언마운트 시 웹소켓 연결 해제
    return () => {
      wsService.disconnect();
    };
  }, [onSearch]);

  const handleSearch = async () => {
    if (!ip.trim()) {
      setError("Please enter an IP address");
      return;
    }

    setIsLoading(true);
    setError(null);
    // 1. 웹소켓 연결
    wsService.connect(
      () => {
        // openCallback
        const message = { type: 1, data: { ip: "8.8.8.8" } };
        wsService.sendMessage(message);
      },
      () => {
        // closeCallback
        wsService.connect(
          () => {
            // openCallback
            const message = {
              type: 2,
              data: {
                signed_tx: "signedTxEX",
                request_id: "74f75535-6c07-4b6c-a091-350fc27e2409",
              },
            };
            wsService.sendMessage(message);
          },
          () => {} // closeCallback
        );

        // 4. IP 위치 응답 리스너 설정
        wsService.on("result", (data) => {
          setIsLoading(false);

          if (data.error) {
            setError(data.error);
            return;
          }

          //   onSearch({
          //     latitude: data.latitude,
          //     longitude: data.longitude,
          //     country: data.country_code,
          //     geoResult: data.geoResult,
          //   });
        });

        try {
          wsService.searchIpLocation(ip);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    );

    // 2. 1.에서 unsignedTx 넘어오면 서명하는 callback
    wsService.on("unsignedTx", async (message) => {
      if (message.type === "unsignedTx") {
        const payload = message.payload;

        // Decode and sign the transaction
        const transaction = web3.Transaction.from(
          Buffer.from(payload.transaction, "base64")
        );
        const signedTx = await window.solana.signTransaction(transaction);

        wsService.sendSignedTransaction(
          signedTx.serialize().toString("base64")
        );
      }
    });
  };

  return (
    <SearchContainer>
      <SearchBox>
        <Title>DePing</Title>
        <WalletConnect
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
        />
        <InputWrapper>
          <Input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter IP address..."
            disabled={isLoading}
          />
          <SearchButton onClick={handleSearch} disabled={isLoading}>
            {isLoading ? "Searching..." : "Search Location"}
          </SearchButton>
        </InputWrapper>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </SearchBox>
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  flex: 1;
  min-width: 250px;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &:disabled {
    background: #f5f5f5;
  }
`;

const SearchButton = styled.button`
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  background: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #45a049;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 14px;
  text-align: center;
`;

export default SearchPage;
