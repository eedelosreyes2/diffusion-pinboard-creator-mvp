import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
	background-color: ${(props) => (props.isDragging ? 'lightblue' : ' white')};
	border: 1px solid lightgrey;
	border-radius: 5px;
	margin: 5px;
	min-height: 50px;
	max-width: 250px;
	min-width: 250px;
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
							{...provided.dragHandleProps}
							ref={provided.innerRef}
							isDragging={snapshot.isDragging}
						>
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
