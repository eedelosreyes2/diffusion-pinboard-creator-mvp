import React, { Component } from 'react';
import axios from 'axios';
import ShareBoardCard from './ShareBoardCard';
import styled from 'styled-components';
import { DB_URL } from '../globals';
import { colors } from '../globals';
import Logo from '../images/Logo.png';

const Container = styled.div`
	align-items: center;
	background-color: ${colors.primary};
	color: white;
	display: flex;
	height: 100vh;
	justify-content: center;
	width: 100vw;
	@media only screen and (max-width: 1400px) {
		height: 100%;
		width: 100%;
	}
`;

const Background = styled.div`
	background-color: ${colors.darkBg};
	border-radius: 10px;
	height: 95vh;
	position: relative;
	width: 95vw;
	@media only screen and (max-width: 1400px) {
		height: 90%;
		padding: 100px 0;
		width: 90%;
	}
`;

const InnerContainer = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
	margin: auto;
	width: 95%;
	@media only screen and (max-width: 1400px) {
		flex-direction: column;
	}
`;

const Header = styled.div`
	align-items: center;
	display: flex;
	height: 75px;
	justify-content: center;
	position: absolute;
	top: 0;
	width: 100%;
`;

const LogoImg = styled.img`
	cursor: pointer;
	height: 40px;
`;

const StoryContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 75%;
	justify-content: center;
	margin: auto;
	width: 100%;
	@media only screen and (max-width: 1400px) {
		display: block;
	}
`;

const Title = styled.div`
	font-size: 60px;
`;

const TitleUnderline = styled.div`
	height: 2px;
	background-color: ${colors.secondary};
	margin-bottom: 150px;
	width: 300px;
	@media only screen and (max-width: 1400px) {
		margin-bottom: 50px;
	}
`;

const Story = styled.div`
	width: 80%;
`;

const CardsContainer = styled.div`
	align-content: space-evenly;
	align-items: center;
	display: flex;
	flex-wrap: wrap;
	height: 90%;
	margin: auto;
	justify-content: space-evenly;
	justify-items: center;
	width: 100%;
	@media only screen and (max-width: 1400px) {
		padding: 100px 0;
		flex-direction: column;
		justify-content: space-between;
	}
`;

const Footer = styled.div`
	bottom: 0;
	align-items: center;
	display: flex;
	height: 150px;
	justify-content: center;
	position: absolute;
	width: 100%;
`;

const Author = styled.div`
	margin-top: 100px;
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
			let story = this.state.board.story;
			if (story === 'Click here to add a story to this board!') {
				story = 'This is a super cool board!';
			}

			return (
				<Container>
					<Background>
						<InnerContainer>
							<Header>
								<a href="https://diffusion.me" target="_blank">
									<LogoImg src={Logo}></LogoImg>
								</a>
							</Header>
							<StoryContainer>
								<div>
									<Title>{this.state.board.title}</Title>
									<TitleUnderline />
								</div>
								<Story>{story}</Story>
							</StoryContainer>
							<CardsContainer>
								{this.state.content.map((content, index) => {
									return content ? (
										<ShareBoardCard
											key={index}
											content={content}
										></ShareBoardCard>
									) : (
										''
									);
								})}
							</CardsContainer>
							<Footer>
								<Author>
									diffused by <b>{this.state.name}</b>
								</Author>
							</Footer>
						</InnerContainer>
					</Background>
				</Container>
			);
		}
		return <div></div>;
	}
}
