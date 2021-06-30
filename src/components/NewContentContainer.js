import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import styled from 'styled-components';

const Container = styled.div`
	margin: 0 auto 10px auto;
	width: 100%;
`;

const CardsContainer = styled.div`
	display: flex;
	flex-grow: 1;
	justify-content: left;
	min-height: 100px;
	overflow: auto;
`;

export default class NewContentContainer extends Component {
	render() {
		let content = [];
		if (this.props.content) {
			content = this.props.board0.contentIds.map(
				(contentId) => this.props.content[contentId]
			);
		}

		return (
			<Container>
				<Droppable droppableId="board0" direction="horizontal">
					{(provided) => {
						return (
							<CardsContainer
								className="hidden-scroll"
								ref={provided.innerRef}
								{...provided.innerRef}
							>
								{content.map((content, index) => {
									return content ? (
										<Card
											key={content.id}
											content={content}
											index={index}
										/>
									) : (
										''
									);
								})}
								{provided.placeholder}
							</CardsContainer>
						);
					}}
				</Droppable>
			</Container>
		);
	}
}
