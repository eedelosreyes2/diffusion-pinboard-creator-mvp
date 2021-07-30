import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { IconContext } from 'react-icons/lib';
import { BsPlay } from 'react-icons/bs';
import { AiOutlineMediumWorkmark } from 'react-icons/ai';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import styled from 'styled-components';
import { socials, colors, accessCode } from '../globals';

const Container = styled.div`
	align-items: center;
	background-color: ${colors.primary};
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: top;
`;

const H1 = styled.h1`
	color: white;
	margin-top: 300px;
`;

const AccessCode = styled.a`
	color: ${colors.secondary};
	cursor: pointer;
	text-decoration: underline;
`;

const Form = styled.div`
	display: flex;
	margin-bottom: 10px;
	margin-top: 30px;
`;

const AccessCodeInput = styled.input`
	border: none;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	font-family: aleo;
	height: 30px;
	padding-left: 10px;
	padding-right: 10px;
	outline: none;
	text-align: center;
	width: 200px;
`;

const AccessCodeSubmit = styled.button`
	background-color: ${colors.secondary};
	border: none;
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
	cursor: pointer;
	height: 32px;
	outline: none;
	width: 60px;
`;

const LoginButton = styled.button`
	background-color: ${colors.secondary};
	border: none;
	border-radius: 10px;
	color: white;
	cursor: pointer;
	font-family: aleo;
	font-size: 20px;
	font-weight: bolder;
	margin: 10px;
	padding: 5px 20px;
	transition: visibility 5s, opacity 0.5s linear;
	opacity: ${(props) => (props.isVisible ? 1 : 0)};
`;

const Footer = styled.div`
	align-items: center;
	bottom: 0;
	color: white;
	display: flex;
	height: 10vh;
	justify-content: center;
	position: absolute;
	text-align: center;
	width: 100%;
`;

const DiffusionIcon = styled.a`
	font-size: 35px;
	font-family: Aleo;
	padding: 0 20px;
	text-decoration: none;
`;

export class LogInComponent extends Component {
	constructor() {
		super();
		this.state = {
			hasAccess: false,
			fade: false,
		};
	}

	handleSubmit = () => {
		const value = document.getElementById('access-code').value;

		if (value === accessCode) {
			this.setState({ hasAccess: true });
		}
	};

	render() {
		return (
			<Container>
				<H1>
					Enter your{' '}
					<AccessCode href={socials.typeform} target="__blank">
						access code
					</AccessCode>{' '}
					to curate Diffusion Boards!
				</H1>
				<Form id="form">
					<AccessCodeInput id="access-code"></AccessCodeInput>
					<AccessCodeSubmit
						onClick={this.handleSubmit}
						onAnimationEnd={() => console.log('what')}
					>
						<IconContext.Provider
							value={{
								size: '2em',
								style: {
									color: 'white',
									paddingTop: '2px',
								},
							}}
						>
							<BsPlay />
						</IconContext.Provider>
					</AccessCodeSubmit>
				</Form>
				<GoogleLogin
					clientId="173875502237-vqno633dqovkrmnot06va4r1iu0m2882.apps.googleusercontent.com"
					buttonText="Login"
					onSuccess={this.props.responseGoogleLogin}
					onFailure={this.props.responseGoogleLogin}
					cookiePolicy={'single_host_origin'}
					render={(renderProps) => (
						<LoginButton
							onClick={renderProps.onClick}
							isVisible={this.state.hasAccess}
						>
							Login
						</LoginButton>
					)}
				/>
				<Footer>
					<IconContext.Provider
						value={{
							size: '2em',
							style: { cursor: 'pointer', padding: '0 30px' },
						}}
					>
						<a
							target="_blank"
							href={socials.diffusion}
							rel="noreferrer"
						>
							<DiffusionIcon>D</DiffusionIcon>
						</a>
						<a
							target="_blank"
							href={socials.twitter}
							rel="noreferrer"
						>
							<FaTwitter />
						</a>
						<a
							target="_blank"
							href={socials.discord}
							rel="noreferrer"
						>
							<FaDiscord />
						</a>
					</IconContext.Provider>
					<IconContext.Provider
						value={{
							size: '3.5em',
							style: { cursor: 'pointer', padding: '0 30px' },
						}}
					>
						<a
							target="_blank"
							href={socials.medium}
							rel="noreferrer"
						>
							<AiOutlineMediumWorkmark />
						</a>
					</IconContext.Provider>
				</Footer>
			</Container>
		);
	}
}

export default LogInComponent;
