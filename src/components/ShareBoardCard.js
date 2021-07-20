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
	min-height: 50px;
	justify-content: center;
	padding: 20px 10px;
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
		let { url, quickThoughts, category } = this.props.content;
		url = this.setHttp(url);

		let quickThoughtsArr = quickThoughts.split('<div>');
		let i;
		for (i = 0; i < quickThoughtsArr.length; i++) {
			quickThoughtsArr[i] = quickThoughtsArr[i].replaceAll(
				'&nbsp;',
				'\n'
			);
			quickThoughtsArr[i] = quickThoughtsArr[i].replaceAll('</div>', '');
			quickThoughtsArr[i] = quickThoughtsArr[i].replaceAll('<br>', '\n');
			if (quickThoughtsArr[i] === '\n') {
				quickThoughtsArr[i] = <br />;
			}
		}

		return (
			<a href={url} target="_blank" rel="noreferrer">
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
						<QuickThoughts>
							{quickThoughtsArr.map((quickThought, index) => (
								<div key={index}>{quickThought}</div>
							))}
						</QuickThoughts>
						<Category>{category}</Category>
					</div>
				</Container>
			</a>
		);
	}
}
