"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "@/wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";

export function Providers(props: {
    children: ReactNode;
    initialState?: State;
}) {
    const [config] = useState(() => getConfig());
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider chain={base}>
                    {props.children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
