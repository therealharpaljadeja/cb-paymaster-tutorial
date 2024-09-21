"use client";

import Button from "@/components/Button";
import CoinbaseButton from "@/components/CoinbaseButton";
import { useAccount, useConnect } from "wagmi";
import { useCallsStatus, useWriteContracts } from "wagmi/experimental";
import { abi } from "@/abi/NFT";
import TransactionStatus from "@/components/TransactionStatus";
import { Name } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

const nameStyles = {
    background: "transparent",
    border: "1px solid transparent",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#0052FF",
    padding: "8px 14px",
    borderRadius: 10,
};

function App() {
    const { connectors, status, error } = useConnect();
    const {
        addresses,
        address,
        status: accountStatus,
        chainId,
        isConnected,
    } = useAccount();
    const {
        writeContractsAsync,
        error: mintError,
        status: mintStatus,
        data: id,
    } = useWriteContracts();
    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: !!id,
            // Poll every second until the calls are confirmed
            refetchInterval: (data) =>
                data.state.data?.status === "CONFIRMED" ? false : 1000,
        },
    });

    async function mint() {
        try {
            await writeContractsAsync({
                contracts: [
                    {
                        address: "0x665Bb63Fea63914d9E8c8824dcB629EF349B0773",
                        abi,
                        args: [
                            address,
                            BigInt(0), // tokenId
                            BigInt(1), // quantity
                            // "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // currency
                            // BigInt(0), // pricePerToken
                            // {
                            //     proof: [],
                            //     quantityLimitPerWallet: BigInt(
                            //         "115792089237316195423570985008687907853269984665640564039457584007913129639935"
                            //     ),
                            //     pricePerToken: BigInt(0),
                            //     currency:
                            //         "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                            // },
                            `0x`, // data
                        ],
                        functionName: "mint",
                    },
                ],
                capabilities: {
                    paymasterService: {
                        // Paymaster Proxy Node url goes here.
                        url: "",
                    },
                },
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div>
                <h2>Account</h2>

                <div>
                    status: {accountStatus}
                    <br />
                    chainId: {chainId}
                </div>
            </div>

            <div>
                <h2>Connect</h2>
                {connectors
                    .filter((connector) => connector.name === "Coinbase Wallet")
                    .map((connector, index) => (
                        <CoinbaseButton key={index} />
                    ))}
                <div>{error?.message}</div>
            </div>

            {isConnected ? (
                <div>
                    <h2>Mint</h2>
                    {address ? (
                        <Name
                            style={nameStyles}
                            address={address}
                            chain={base}
                        />
                    ) : (
                        <div>{"No address"}</div>
                    )}
                    <Button onClick={mint} isLoading={mintStatus === "pending"}>
                        {mintStatus === "pending" ? "Loading..." : "Mint"}
                    </Button>
                    <div>writeContracts Status: {mintStatus}</div>
                    <div>{mintError?.message}</div>
                    <TransactionStatus callStatus={callsStatus} />
                </div>
            ) : null}
        </>
    );
}

export default App;
