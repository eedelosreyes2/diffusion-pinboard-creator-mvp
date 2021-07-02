import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
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
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	height: 7px;
	left: 0;
	position: absolute:
	top: 0;
	width: 100%;
`;

const Url = styled.div`
	margin: 10px;
	text-decoration: none;
`;

const QuickThoughts = styled.div`
	padding: 10px;
`;

const Category = styled.div`
	border: 1px solid ${colors.secondary};
	border-radius: 5px;
	display: inline-block;
	font-size: 12px;
	margin: 10px;
	padding: 2px 5px;
`;

export class Card extends Component {
	setHttp = (link) => {
		if (link.search(/^http[s]?:\/\//) === -1) {
			link = 'https://' + link;
		}
		return link;
	};

	render() {
		const { id, quickThoughts, category } = this.props.content;
		const url = this.setHttp(this.props.content.url);

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
							<Url as="a" href={url} target="__blank">
								{url
									? url
											.replace(
												/^(?:https?:\/\/)?(?:www\.)?/i,
												''
											)
											.split('/')[0]
									: ''}
							</Url>
							<QuickThoughts>
								<ContentEditable
									id="card-quick-thoughts"
									html={quickThoughts}
									onChange={(e) => this.props.editCard(e, id)}
									disabled={false}
								/>
							</QuickThoughts>
							<Category>
								<ContentEditable
									id="card-category"
									html={category}
									onChange={(e) => this.props.editCard(e, id)}
									disabled={false}
								/>
							</Category>
						</Container>
					);
				}}
			</Draggable>
		);
	}
}

export default Card;
