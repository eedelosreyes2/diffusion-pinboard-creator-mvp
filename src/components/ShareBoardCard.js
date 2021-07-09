import React, { Component } from 'react';
import styled from 'styled-components';
import { colors } from '../globals';

const Container = styled.div`
	align-items: center;
	border: 2px solid grey;
	border-radius: 10px;
	color: white;
	cursor: pointer;
	display: flex;
	height: 200px;
	justify-content: center;
	position: relative;
	text-align: center;
	transform: ${(props) => (props.isHovered ? 'scale(1.05)' : '')};
	transition: all 0.2s ease-in-out;
	width: 300px;
`;

const Url = styled.div`
	color: ${colors.primary};
	font-size: 20px;
`;

const QuickThoughts = styled.div`
	margin: 30px 0;
`;

const Category = styled.div`
	border: 1px solid ${colors.secondary};
	border-radius: 5px;
	display: inline-block;
	font-size: 12px;
	padding: 2px 5px;
`;

export default class ShareBoardCard extends Component {
	constructor() {
		super();
		this.state = { isHovered: false };
	}

	toggleHover = () => {
		this.setState({ isHovered: !this.state.isHovered });
	};

	setHttp = (link) => {
		if (link) {
			if (link.search(/^http[s]?:\/\//) === -1) {
				link = 'https://' + link;
			}
		}
		return link;
	};

	render() {
		const { quickThoughts, category } = this.props.content;
		let url = this.props.content.url;
		url = this.setHttp(url);

		return (
			<a href={url} target="_blank">
				<Container
					onMouseEnter={() => this.toggleHover()}
					onMouseLeave={() => this.toggleHover()}
					isHovered={this.state.isHovered}
				>
					<div>
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
					</div>
				</Container>
			</a>
		);
	}
}
