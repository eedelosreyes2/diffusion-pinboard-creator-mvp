import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { colors } from '../theme';

const Container = styled.div`
	background-color: ${(props) =>
		props.isDragging ? 'lightyellow' : ' white'};
	border: 1px solid lightgrey;
	border-radius: 5px;
	margin: 5px;
	min-height: 50px;
	max-width: 250px;
	min-width: 250px;
`;

const Handle = styled.div`
	background-color: ${colors.secondary};
	height: 7px;
	left: 0;
	position: absolute:
	top: 0;
	width: 100%;
`;

const Url = styled.div`
	padding: 10px;
`;

const QuickThoughts = styled.div`
	padding: 10px;
`;

const Category = styled.div`
	font-size: 12px;
	padding: 10px;
`;

export class Card extends Component {
	render() {
		const { id, url, quickThoughts, category } = this.props.content;

		return (
			<Draggable draggableId={id} index={this.props.index}>
				{(provided, snapshot) => {
					return (
						<Container
							{...provided.draggableProps}
							ref={provided.innerRef}
							isDragging={snapshot.isDragging}
						>
							<Handle {...provided.dragHandleProps} />
							<Url>
								{url
									? url
											.replace(
												/^(?:https?:\/\/)?(?:www\.)?/i,
												''
											)
											.split('/')[0]
									: ''}
							</Url>
							<QuickThoughts>{quickThoughts}</QuickThoughts>
							<Category>{category}</Category>
						</Container>
					);
				}}
			</Draggable>
		);
	}
}

export default Card;
