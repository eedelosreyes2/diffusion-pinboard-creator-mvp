import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default class ShareBoard extends Component {
	render() {
		console.log(this.props);
		return (
			<>
				{this.props.data
					? Object.entries(this.props.data.boards).map(
							(board, key) => {
								return (
									<IndividialBoard board={board} key={key} />
								);
							}
					  )
					: ''}
			</>
		);
	}
}

export class IndividialBoard extends Component {
	render() {
		const { board } = this.props;
		const url = '/board/' + board[0];

		return (
			<Router>
				<Switch>
					<Route path={url}>
						<div style={{ backgroundColor: 'red' }}>"PEEPEEP</div>
					</Route>
				</Switch>
			</Router>
		);
	}
}
