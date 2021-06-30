import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';

export class LogOutComponent extends Component {
	render() {
		return (
			<GoogleLogout
				clientId="173875502237-vqno633dqovkrmnot06va4r1iu0m2882.apps.googleusercontent.com"
				buttonText="Logout"
				onLogoutSuccess={this.props.responseGoogleLogout}
				onFailure={this.props.responseGoogleLogout}
			/>
		);
	}
}

export default LogOutComponent;
