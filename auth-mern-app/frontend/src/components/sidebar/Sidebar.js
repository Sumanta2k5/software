import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import "../../Sidebar.css"; // Import CSS file

const Sidebar = () => {
	return (
		<div className="sidebar-container">
			<SearchInput />
			<div className="sidebar-divider"></div>
			<Conversations />
		</div>
	);
};

export default Sidebar;
