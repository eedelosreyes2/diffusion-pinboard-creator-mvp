import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import styled from 'styled-components';
import { colors } from '../theme';
import Card from './Card';
import { IconContext } from 'react-icons/lib';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { FiTrash, FiShare } from 'react-icons/fi';
import { BsArrowClockwise } from 'react-icons/bs';

const Container = styled.div`
	background-color: ${(props) =>
		props.boardId === 'board0'
			? colors.primary
			: props.isDragging
			? 'lightblue'
			: 'white'};
	border: 2px solid ${colors.primary};
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	margin: 5px;
	position: relative;
`;

const Handle = styled.div`
	background-color: ${colors.primary};
	border-bottom-left-radius: 15px;
	border-bottom-right-radius: 15px;
	color: white;
	height: 0px;
	margin: auto;
	padding-bottom: 16px;
	position: absoulte;
	text-align: center;
	top: 0;
	width: 70%;
`;

const iconStyle = {
	top: 0,
};

const Title = styled.div`
	font-size: 24px;
	margin-top: 10px;
	text-align: center;
	max-width: 262px;
`;

const CardsContainer = styled.div`
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	height: 100%;
	margin: 5px auto;
	max-width: 262px;
	min-width: 262px;
`;

const StoryContainer = styled.div`
	display: flex;
	height: 100%;
	margin: 5px auto;
	max-width: 262px;
	min-width: 262px;
`;

const Story = styled.div`
	height: 75%;
	padding: 25px 5px;
	margin: auto;
	text-align: center;
`;

const FooterContainer = styled.div`
	align-items: center;
	bottom: 0;
	color: 'black';
	display: flex;
	flex-direction: row;
	height: 35px;
	justify-content: space-evenly;
	left: 0,
	position: absolute;
	right: 0;
`;

export class Board extends Component {
	constructor() {
		super();
		this.state = {
			isFlipped: false,
		};
	}

	handleFlip = () => {
		this.setState((prevState) => ({ isFlipped: !prevState.isFlipped }));
	};

	render() {
		const { id, title, story } = this.props.board;

		return (
			<Draggable draggableId={id} index={this.props.index}>
				{(provided, snapshot) => {
					return (
						<Container
							boardId={id}
							{...provided.draggableProps}
							ref={provided.innerRef}
							isDragging={snapshot.isDragging}
						>
							<Handle {...provided.dragHandleProps}>
								<IconContext.Provider
									value={{ style: iconStyle }}
								>
									<HiOutlineDotsHorizontal />
								</IconContext.Provider>
							</Handle>

							<Title>
								<ContentEditable
									id="board-title"
									html={title}
									onChange={(e) =>
										this.props.editBoard(e, id)
									}
									disabled={false}
								/>
							</Title>

							{this.state.isFlipped ? (
								<Back
									boardId={id}
									story={story}
									editBoard={this.props.editBoard}
								/>
							) : (
								<Front id={id} content={this.props.content} />
							)}

							<Footer
								id={id}
								title={title}
								isFlipped={this.state.isFlipped}
								handleFlip={this.handleFlip}
								deleteBoard={this.props.deleteBoard}
							/>
						</Container>
					);
				}}
			</Draggable>
		);
	}
}

export default Board;

class Front extends Component {
	render() {
		const { id, content } = this.props;

		return (
			<Droppable droppableId={id}>
				{(provided) => {
					return (
						<CardsContainer
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{content
								? content.map((content, index) =>
										content ? (
											<Card
												key={content.id}
												content={content}
												index={index}
											/>
										) : (
											''
										)
								  )
								: ''}
							{provided.placeholder}
						</CardsContainer>
					);
				}}
			</Droppable>
		);
	}
}

class Back extends Component {
	render() {
		return (
			<StoryContainer>
				<Story>
					<ContentEditable
						id="board-story"
						html={this.props.story}
						onChange={(e) =>
							this.props.editBoard(e, this.props.boardId)
						}
						disabled={false}
					/>
				</Story>
			</StoryContainer>
		);
	}
}

class Footer extends Component {
	render() {
		const { id, title, isFlipped } = this.props;
		const flipIconStyle = {
			cursor: 'pointer',
			transform: isFlipped ? 'scaleX(-1)' : '',
		};

		return (
			<FooterContainer boardId={id}>
				<IconContext.Provider value={{ style: { cursor: 'pointer' } }}>
					<FiTrash
						onClick={() => this.props.deleteBoard(id, title)}
					/>
				</IconContext.Provider>
				<IconContext.Provider
					value={{
						size: '2em',
						style: flipIconStyle,
					}}
				>
					<BsArrowClockwise onClick={this.props.handleFlip} />
				</IconContext.Provider>
				<IconContext.Provider value={{ style: { cursor: 'pointer' } }}>
					<FiShare />
				</IconContext.Provider>
			</FooterContainer>
		);
	}
}
