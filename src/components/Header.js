import React, { Component } from 'react';
import LogOutComponent from './LogOutComponent';
import { IconContext } from 'react-icons/lib';
import { FiHelpCircle } from 'react-icons/fi';
import { IoExtensionPuzzleOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { chromeExtensionUrl } from '../globals';
import Logo from '../images/Logo_128x128.png';

const Container = styled.div`
  align-items: center;
  display: flex;
  height: 60px;
  justify-content: space-between;
  padding-top: 20px;
  width: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
`;

const LogoContainer = styled.img`
  height: 30px;
  width: 30px;
`;

const H1 = styled.h1`
  color: #6B7280;
  font-size: 25px;
  margin: auto;
  margin-left: 35px;
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

export default class Header extends Component {
  handleHelpClick = () => {
    alert(
      'Click on the Buttons with + on the left to create Content Cards and Boards!'
    );
  };

  render() {
    const { givenName } = this.props.profileObj;

    return (
      <Container>
        <InfoContainer>
          <a href="https://diffusion.me" target="_blank" rel="noreferrer">
            <LogoContainer src={Logo} />
          </a>
          <H1>{`What's up, ${givenName} 🤟`}</H1>
        </InfoContainer>
        <ButtonsContainer>
          <a href={chromeExtensionUrl} target="_blank" rel="noreferrer">
            <IconContext.Provider
              value={{
                size: '2em',
                style: {
                  cursor: 'pointer',
                  marginRight: '25px',
                  paddingTop: '1px',
                },
              }}
            >
              <IoExtensionPuzzleOutline />
            </IconContext.Provider>
          </a>
          <IconContext.Provider
            value={{
              size: '2em',
              style: {
                color: '#6B7280',
                cursor: 'pointer',
                paddingTop: '2px',
                marginRight: '27px',
              },
            }}
          >
            <FiHelpCircle onClick={this.handleHelpClick} />
          </IconContext.Provider>
          <LogOutComponent
            responseGoogleLogout={this.props.responseGoogleLogout}
          />
        </ButtonsContainer>
      </Container>
    );
  }
}
