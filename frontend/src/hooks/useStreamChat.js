import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useAuth } from "./useAuth";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
  const { user } = useAuth();
  const [chatClient, setChatClient] = useState(null);
  const [connectError, setConnectError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const {
    data: tokenData,
    isLoading: isTokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ["streamToken", user?.id],
    queryFn: getStreamToken,
    enabled: !!user?.id,
    retry: 1,
  });

  useEffect(() => {
    setConnectError(null);
    setChatClient(null);

    if (!user?.id) return;

    if (!STREAM_API_KEY) {
      setConnectError(new Error("Stream API key is not configured"));
      return;
    }

    if (tokenError) {
      setConnectError(tokenError);
      return;
    }

    if (!isTokenLoading && !tokenData?.token) {
      setConnectError(new Error("Could not get Stream token. Try signing out and back in."));
      return;
    }

    if (!tokenData?.token) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);
    let cancelled = false;

    const connect = async () => {
      setIsConnecting(true);
      try {
        await client.connectUser(
          {
            id: user.id,
            name: user.name,
            image: user.image || undefined,
          },
          tokenData.token
        );
        if (!cancelled) {
          setChatClient(client);
          setConnectError(null);
        }
      } catch (error) {
        console.log("Error connecting to stream", error);
        if (!cancelled) {
          setConnectError(
            error instanceof Error ? error : new Error("Failed to connect to chat")
          );
        }
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    };

    connect();

    return () => {
      cancelled = true;
      client.disconnectUser().catch(() => {});
    };
  }, [tokenData?.token, user?.id, user?.name, user?.image, tokenError, isTokenLoading]);

  const isLoading = !!user?.id && (isTokenLoading || isConnecting || (!chatClient && !connectError));

  return {
    chatClient,
    isLoading,
    error: tokenError || connectError,
  };
};
