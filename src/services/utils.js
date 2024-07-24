export function convertFromSnake(text) {
	return text
		.replace(/_/g, " ") // Replace underscores with spaces
		.split(" ") // Split the string into an array of words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(" ");
}
