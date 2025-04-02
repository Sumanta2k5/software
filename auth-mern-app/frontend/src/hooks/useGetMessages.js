import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
	console.log(selectedConversation);
	useEffect(() => {
		const getMessages = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				console.error("No token found in local storage");
				toast.error("Authentication error! Please log in again.");
				return;
			}

			setLoading(true);
			try {
				const res = await fetch(`http://localhost:8080/api/messages/${selectedConversation?._id}`, {
					headers: { Authorization: `${token}` }, // Ensure proper format for token
				});
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);
                console.log(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	return { messages, loading };
};

export default useGetMessages;
