import React, { Component } from 'react';
import { GoogleLogout } from 'react-google-login';
import { IconContext } from 'react-icons/lib';
import { IoLogOutOutline } from 'react-icons/io5';

export class LogOutComponent extends Component {
  render() {
    return (
      <GoogleLogout
        clientId="173875502237-vqno633dqovkrmnot06va4r1iu0m2882.apps.googleusercontent.com"
        buttonText="Logout"
        onLogoutSuccess={this.props.responseGoogleLogout}
        onFailure={this.props.responseGoogleLogout}
        theme="dark"
        render={(renderProps) => (
          <div onClick={renderProps.onClick}>
            <IconContext.Provider
              value={{ size: '2.2em', style: { cursor: 'pointer' } }}
            >
              <IoLogOutOutline />
            </IconContext.Provider>
          </div>
        )}
      />
    );
  }
}

export default LogOutComponent;
