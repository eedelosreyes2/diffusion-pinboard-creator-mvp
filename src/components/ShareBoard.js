import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { DB_URL } from '../globals';
import { colors } from '../globals';

const Container = styled.div`
	align-items: center;
	background-color: ${colors.primary};
	display: flex;
	height: 100vh;
	justify-content: center;
	width: 100vw;
`;

const InnerContainer = styled.div`
	background-color: ${colors.darkBg};
	border-radius: 15px;
	height: 95vh;
	width: 95vw;
`;

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
		return (
			<Container>
				<InnerContainer>asasd</InnerContainer>
			</Container>
		);
	}
}
