import useConversation from "../../zustand/useConversation";
import "../../Conversation.css"; // Import CSS file

const Conversation = ({ conversation, lastIdx, emoji }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;

	return (
		<>
			<div
				className={`conversation-container ${isSelected ? "conversation-selected" : ""}`}
				onClick={() => setSelectedConversation(conversation)}
			>
				<div className="avatar online">
					<div className="conversation-avatar">
						<img src={conversation.profilePic || "default-profile.jpg"} alt="user avatar" />
					</div>
				</div>

				<div className="flex flex-col flex-1">
					<div className="flex gap-3 justify-between">
						<p className="conversation-name">{conversation.name}</p>
						
					</div>
				</div>
			</div>

			{!lastIdx && <div className="divider" />}
		</>
	);
};

export default Conversation;
