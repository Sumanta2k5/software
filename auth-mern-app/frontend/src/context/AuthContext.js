import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const [authUser, setAuthUser] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("chat-user")) || null;
		} catch (error) {
			console.error("Error parsing auth user from localStorage:", error);
			return null;
		}
	});

	// Update localStorage when authUser changes
	useEffect(() => {
		if (authUser) {
			localStorage.setItem("chat-user", JSON.stringify(authUser));
		} else {
			localStorage.removeItem("chat-user");
		}
	}, [authUser]);

	return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};
