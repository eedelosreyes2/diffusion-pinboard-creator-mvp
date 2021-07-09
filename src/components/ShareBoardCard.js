import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	border: 2px solid grey;
	height: 200px;
	width: 300px;
`;

export default class ShareBoardCard extends Component {
	render() {
		const { url, quickThoughts, category } = this.props.content;

		return <Container>{url}</Container>;
	}
}
