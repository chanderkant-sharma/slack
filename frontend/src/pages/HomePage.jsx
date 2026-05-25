import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../hooks/useStreamChat";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../components/PageLoader";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";
import { HashIcon, LogOutIcon, PlusIcon, UsersIcon } from "lucide-react";
import CreateChannelModal from "../components/CreateChannelModal";
import CustomChannelPreview from "../components/CustomChannelPreview";
import UsersList from "../components/UsersList";
import CustomChannelHeader from "../components/CustomChannelHeader";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout } = useAuth();

  const { chatClient, error, isLoading } = useStreamChat();

  useEffect(() => {
    if (!chatClient) return;

    const channelId = searchParams.get("channel");
    if (!channelId) {
      setActiveChannel(null);
      return;
    }

    const channel = chatClient.channel("messaging", channelId);

    channel
      .watch()
      .then(() => setActiveChannel(channel))
      .catch((err) => console.log("Error watching channel:", err));
  }, [chatClient, searchParams]);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-red-600 font-medium">Could not connect to chat</p>
        <p className="text-gray-600 text-sm max-w-md">
          {error.response?.data?.message || error.message || "Something went wrong"}
        </p>
        <button onClick={logout} className="btn btn-primary">
          Sign out and try again
        </button>
      </div>
    );
  }

  if (isLoading || !chatClient) return <PageLoader />;

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="Logo" className="brand-logo" />
                  <span className="brand-name">Slap</span>
                </div>
                <div className="user-button-wrapper flex items-center gap-2">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="size-8 rounded-full" />
                  ) : (
                    <div className="size-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-gray-700 hidden sm:inline">{user?.name}</span>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded hover:bg-gray-100"
                    title="Sign out"
                  >
                    <LogOutIcon className="size-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button onClick={() => setIsCreateModalOpen(true)} className="create-channel-btn">
                    <PlusIcon className="size-4" />
                    <span>Create Channel</span>
                  </button>
                </div>

                <ChannelList
                  filters={{ members: { $in: [chatClient.user.id] } }}
                  options={{ state: true, watch: true }}
                  Preview={({ channel }) => (
                    <CustomChannelPreview
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={(ch) => setSearchParams({ channel: ch.id })}
                    />
                  )}
                  List={({ children, loading, error: listError }) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="size-4" />
                          <span>Channels</span>
                        </div>
                      </div>

                      {loading && <div className="loading-message">Loading channels...</div>}
                      {listError && <div className="error-message">Error loading channels</div>}

                      <div className="channels-list">{children}</div>

                      <div className="section-header direct-messages">
                        <div className="section-title">
                          <UsersIcon className="size-4" />
                          <span>Direct Messages</span>
                        </div>
                      </div>
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="chat-main">
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <Window>
                  <CustomChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a channel or start a direct message
              </div>
            )}
          </div>
        </div>

        {isCreateModalOpen && <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />}
      </Chat>
    </div>
  );
};

export default HomePage;
