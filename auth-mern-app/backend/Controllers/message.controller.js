const Conversation = require ("../Models/conversation.model.js");
const Message = require ("../Models/message.model.js");

const sendMessage = async (req, res) => {
	console.log("message sent",req.params.id);
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;
		console.log("senderId",senderId);
		console.log("receiverId",receiverId);


		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// SOCKET IO FUNCTIONALITY WILL GO HERE

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });}
	
};

const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;
		console.log("senderId",senderId);
		console.log("receiverId",userToChatId);

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);
console.log("conversation",conversation);
		const messages = conversation.messages;
		console.log("messages",messages);

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {sendMessage,getMessages}