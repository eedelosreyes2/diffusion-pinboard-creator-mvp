import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import LogOutComponent from './LogOutComponent';
import { IconContext } from 'react-icons/lib';
import { FiTrash } from 'react-icons/fi';
import styled from 'styled-components';
import { colors } from '../theme';

const Container = styled.div`
	display: flex;
	height: 100px;
	width: 100%;
`;

const H1 = styled.h1`
	color: #00b1d2;
	margin: auto;
	text-align: center;
	width: 50%;
`;

const ButtonsContainer = styled.div`
	display: flex;
	justify-content: ${(props) =>
		props.type === 'logout' ? 'flex-end' : 'flex-start'};
	margin: auto;
	width: 25%;
`;

const Button = styled.div`
	background-color: ${(props) =>
		props.type === 'board' ? colors.primary : colors.secondary};
	border-radius: 15px;
	color: ${colors.darkBg};
	cursor: pointer;
	font-weight: bold;
	height: 35px;
	margin-right: 10px;
	padding: 15px 15px 0 15px;
	text-align: center;
`;

const TrashContainer = styled.div`
	background-color: ${(props) => (props.isDraggingOver ? 'red' : '')};
	border: 3px solid red;
	border-radius: 15px;
	height: 35px;
	margin-right: 10px;
	padding-top: 10px;
	text-align: center;
	width: 75px;
`;

export default class Header extends Component {
	render() {
		const { givenName } = this.props.profileObj;

		return (
			<Container>
				<ButtonsContainer>
					<Button type="board" onClick={this.props.createBoard}>
						+Board
					</Button>
					<Button type="content" onClick={this.props.createContent}>
						+Content
					</Button>
					<Droppable droppableId="trash">
						{(provided, snapshot) => {
							return (
								<TrashContainer
									ref={provided.innerRef}
									{...provided.innerRef}
									isDraggingOver={snapshot.isDraggingOver}
								>
									<IconContext.Provider
										value={{
											size: '1.5em',
											style: {
												color: snapshot.isDraggingOver
													? ''
													: 'red',
											},
										}}
									>
										<FiTrash />
									</IconContext.Provider>
								</TrashContainer>
							);
						}}
					</Droppable>
				</ButtonsContainer>
				<H1>{`${givenName}'s Diffusion Pinboard Creator`}</H1>
				<ButtonsContainer type="logout">
					<LogOutComponent
						responseGoogleLogout={this.props.responseGoogleLogout}
					/>
				</ButtonsContainer>
			</Container>
		);
	}
}
