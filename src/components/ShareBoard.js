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
	border-radius: 10px;
	height: 95vh;
	position: relative;
	width: 95vw;
`;

const Title = styled.div`
	color: white;
	font-size: 30px;
	margin: 25px;
	text-align: center;
`;

const Author = styled.div`
	bottom: 0;
	color: white;
	margin: 10px;
	position: absolute;
	text-align: center;
	width: 100%;
`;

export default class ShareBoard extends Component {
	constructor() {
		super();
		this.state = { data: null, name: null, board: null, content: null };
	}

	componentDidMount = () => {
		this.getBoard();
	};

	getBoard = () => {
		const hashs = window.location.hash.split('/');
		const username = hashs[2];
		const boardId = hashs[3];
		const url = DB_URL + username + '/data.json';

		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				if (data) {
					const { name } = data;
					const board = data.boards[boardId];
					const content = board.contentIds.map(
						(contentId) => data.content[contentId]
					);
					this.setState({ data, name, board, content });
				}
			})
			.catch((err) => console.log(err));
	};

	render() {
		if (this.state.data) {
			return (
				<Container>
					<InnerContainer>
						<Title>{this.state.board.title}</Title>
						<Author>
							diffused by <b>{this.state.name}</b>
						</Author>
					</InnerContainer>
				</Container>
			);
		}
		return <div></div>;
	}
}
