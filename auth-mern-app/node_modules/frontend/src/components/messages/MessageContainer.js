import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import "../../MessageContainer.css"; // Import CSS file

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className="message-container">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className="message-header">
						<span className="label-text">To:</span>{" "}
						<span className="recipient-name">{selectedConversation.name}</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	return (
		<div className="no-chat-selected">
			<div className="no-chat-content">
				<p>Welcome ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className="no-chat-icon" />
			</div>
		</div>
	);
};
