class Message {
	constructor(author, text, time = Date.now()) {
		this.time = time;
		this.author = author;
		this.text = text;
	}
}