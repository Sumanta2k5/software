import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import "../../Message.css"; // Import the CSS file

const Message = ({ message }) => {
	const authUser = localStorage.getItem("userId");
	const authUserData = JSON.parse(localStorage.getItem("chat-user") || "{}"); // Ensure valid JSON parsing
	const { selectedConversation } = useConversation();

	const fromMe = message.senderId === authUser;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	console.log("authUserData", authUserData);
	const profilePic = fromMe ? authUserData.profilePic : selectedConversation?.profilePic || "default-profile.jpg";
	console.log("profilePic", profilePic);
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className="chat-image avatar">
				<div className="avatar">
					<img alt="User Profile" src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble ${bubbleBgColor} ${shakeClass}`}>{message.message}</div>
			<div className="chat-footer">{formattedTime}</div>
		</div>
	);
};

export default Message;
