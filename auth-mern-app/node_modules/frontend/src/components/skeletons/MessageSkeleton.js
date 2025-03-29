import "../../MessageSkeleton.css"; // Import CSS file

const MessageSkeleton = () => {
	return (
		<div className="skeleton-container">
			<div className="skeleton-wrapper">
				<div className="skeleton-avatar"></div>
				<div className="skeleton-message">
					<div className="skeleton-text"></div>
					<div className="skeleton-text"></div>
				</div>
			</div>
			<div className="skeleton-wrapper" style={{ justifyContent: "flex-end" }}>
				<div className="skeleton-message">
					<div className="skeleton-text"></div>
				</div>
				<div className="skeleton-avatar"></div>
			</div>
		</div>
	);
};

export default MessageSkeleton;
