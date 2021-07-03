import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PinboardCreator from './components/PinboardCreator';
import LogInComponent from './components/LogInComponent';
import ShareBoard from './components/ShareBoard';
import styled from 'styled-components';
import { colors } from './theme';
import './App.css';
const DB_URL = 'https://diffusion-web-app-mvp-default-rtdb.firebaseio.com/';

const Container = styled.div`
	background-color: ${colors.darkBg};
	color: white;
`;

export default class App extends Component {
	state = { profileObj: null, username: null, data: null };

	componentDidMount = () => {
		this.getCache();
		window.addEventListener('load', this.getCache);
		window.addEventListener('beforeunload', this.setCache);
		setInterval(() => {
			this.fetchNewContent();
		}, 1000);
	};

	componentWillUnmount = () => {
		this.setCache();
		window.removeEventListener('load', this.getCache);
		window.removeEventListener('beforeunload', this.setCache);
	};

	getCache = () => {
		const state = JSON.parse(sessionStorage.getItem('state'));
		if (state) {
			const { profileObj, username } = state;
			this.setState({ profileObj, username });
			setTimeout(() => {
				this.fetchBoads();
			}, 1000);
		}
	};

	setCache = () => {
		sessionStorage.setItem('state', JSON.stringify(this.state));
		this.putBoards();
	};

	fetchBoads = async () => {
		let url = DB_URL + this.state.username + '/data.json';

		axios
			.get(url)
			.then((res) => {
				const { data } = res;
				if (data) {
					this.setState({ data });
				}
			})
			.catch((err) => console.log(err));
	};

	putBoards = async () => {
		let url = DB_URL + this.state.username + '/data.json';
		const { data } = this.state;

		if (data) {
			data.newContent = null;
			axios.put(url, data, { headers: { 'Content-Type': 'text/plain' } });
		}
	};

	fetchNewContent = async () => {
		let url = DB_URL + this.state.username + '/data/newContent.json';

		axios.get(url).then((res) => {
			const { data } = res;
			if (data) {
				Object.entries(data).map((newContent) => {
					const { url, quickThoughts, category, date } =
						newContent[1];
					const id = uuidv4();
					const newCard = {
						id,
						url,
						quickThoughts,
						category,
						date,
					};
					const content = {
						...this.state.data.content,
						[newCard.id]: newCard,
					};
					const board0 = {
						...this.state.data.boards.board0,
						contentIds: [
							id,
							...this.state.data.boards.board0.contentIds,
						],
					};
					const boards = {
						...this.state.data.boards,
						board0,
					};
					const newState = {
						...this.state,
						data: {
							...this.state.data,
							content,
							boards,
						},
					};
					this.setState(newState);
					this.putBoards();
				});
			}
		});
	};

	updateBoards = (newState) => {
		this.setState(newState);
		this.putBoards();
	};

	responseGoogleLogin = (response) => {
		if (response.profileObj) {
			const profileObj = response.profileObj;
			const email = profileObj.email;
			const username = email.replace(/[^a-zA-Z0-9 ]/g, '');
			this.setState({ username });
			this.setState({ profileObj });
			this.fetchBoads();
		}
	};

	responseGoogleLogout = (response) => {
		this.setState({ profileObj: null, username: null });
	};

	render() {
		const { profileObj, username, data } = this.state;

		return (
			<Router>
				<Switch>
					<Route path="/u">
						<ShareBoard />
					</Route>
					{profileObj ? (
						<Route path="/">
							<Container>
								<PinboardCreator
									profileObj={profileObj}
									username={username}
									data={data}
									updateBoards={this.updateBoards}
									responseGoogleLogout={
										this.responseGoogleLogout
									}
								/>
							</Container>
						</Route>
					) : (
						<LogInComponent
							responseGoogleLogin={this.responseGoogleLogin}
						/>
					)}
				</Switch>
			</Router>
		);
	}
}
