import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import styled from 'styled-components';
import { colors } from '../globals';

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
			</Container>
		);
	}
}

export default LogInComponent;
