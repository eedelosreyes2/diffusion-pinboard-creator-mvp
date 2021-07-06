import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import { IconContext } from 'react-icons/lib';
import { AiOutlineMediumWorkmark } from 'react-icons/ai';
import { FaTwitter, FaDiscord } from 'react-icons/fa';
import styled from 'styled-components';
import { socials, colors } from '../globals';

const Container = styled.div`
	background-color: ${colors.primary};
	align-items: center;
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: top;
`;

const H1 = styled.h1`
	color: white;
	margin-top: 300px;
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
	font-size: 50px;
	font-family: Aleo;
	padding: 0 20px;
	text-decoration: none;
`;

export class LogInComponent extends Component {
	render() {
		return (
			<Container>
				<H1>Login to access your Diffusion boards!</H1>
				<GoogleLogin
					clientId="173875502237-vqno633dqovkrmnot06va4r1iu0m2882.apps.googleusercontent.com"
					buttonText="Login"
					onSuccess={this.props.responseGoogleLogin}
					onFailure={this.props.responseGoogleLogin}
					cookiePolicy={'single_host_origin'}
				/>
				<Footer>
					<IconContext.Provider
						value={{
							size: '3em',
							style: { cursor: 'pointer', padding: '0 30px' },
						}}
					>
						<a target="_blank" href={socials.diffusion}>
							<DiffusionIcon>D</DiffusionIcon>
						</a>
						<a target="_blank" href={socials.twitter}>
							<FaTwitter />
						</a>
						<a target="_blank" href={socials.discord}>
							<FaDiscord />
						</a>
						<a target="_blank" href={socials.medium}>
							<AiOutlineMediumWorkmark />
						</a>
					</IconContext.Provider>
				</Footer>
			</Container>
		);
	}
}

export default LogInComponent;
