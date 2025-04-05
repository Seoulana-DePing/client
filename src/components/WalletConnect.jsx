import { useState, useEffect } from "react";
import styled from "styled-components";

function WalletConnect({ walletAddress, setWalletAddress }) {
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    // 팬텀 지갑이 설치되어 있는지 확인
    const checkPhantomWallet = () => {
      if (window.phantom?.solana?.isPhantom) {
        setIsPhantomInstalled(true);
      }
    };
    checkPhantomWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const { solana } = window.phantom;

      // 지갑 연결 요청
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());

      console.log("Connected with Public Key:", response.publicKey.toString());
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      const { solana } = window.phantom;
      await solana.disconnect();
      setWalletAddress(null);
    } catch (error) {
      console.error("Error disconnecting from wallet:", error);
    }
  };

  if (!isPhantomInstalled) {
    return (
      <InstallMessage>
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Phantom 지갑을 설치해주세요
        </a>
      </InstallMessage>
    );
  }

  return (
    <WalletContainer>
      {walletAddress ? (
        <>
          <WalletInfo>
            Connected: {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </WalletInfo>
          <WalletButton onClick={disconnectWallet}>
            Disconnect Wallet
          </WalletButton>
        </>
      ) : (
        <WalletButton onClick={connectWallet}>
          Connect Phantom Wallet
        </WalletButton>
      )}
    </WalletContainer>
  );
}

const WalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const WalletButton = styled.button`
  background: #512da8;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: #4527a0;
  }
`;

const WalletInfo = styled.div`
  font-size: 14px;
  color: #666;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 20px;
`;

const InstallMessage = styled.div`
  a {
    color: #512da8;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default WalletConnect;
