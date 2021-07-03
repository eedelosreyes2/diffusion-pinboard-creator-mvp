import React, { Component } from 'react';
import axios from 'axios';
import { DB_URL } from '../globals';

export default class ShareBoard extends Component {
	constructor() {
		super();
		this.state = { data: null, board: null, content: null };
	}

	componentDidMount = () => {
		this.getBoard();
	};

	getBoard = () => {
		const paths = window.location.pathname.split('/');
		const username = paths[2];
		const boardId = paths[3];
		const url = DB_URL + username + '/data.json';

		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				if (data) {
					const board = data.boards[boardId];
					const content = board.contentIds.map(
						(contentId) => data.content[contentId]
					);
					this.setState({ data, board, content });
				}
			})
			.catch((err) => console.log(err));
	};

	render() {
		return <div>Share board</div>;
	}
}
