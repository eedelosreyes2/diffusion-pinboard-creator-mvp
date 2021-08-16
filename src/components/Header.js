import React, { Component } from 'react';
import LogOutComponent from './LogOutComponent';
import { IconContext } from 'react-icons/lib';
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
  color: white;
  font-size: 25px;
  margin: auto;
  margin-left: 35px;
  text-align: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

export default class Header extends Component {
  render() {
    const { givenName } = this.props.profileObj;

    return (
      <Container>
        <InfoContainer>
          <a href="https://diffusion.me" target="_blank" rel="noreferrer">
            <LogoContainer src={Logo} />
          </a>
          <H1>{`${givenName}'s Boards`}</H1>
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
          <LogOutComponent
            responseGoogleLogout={this.props.responseGoogleLogout}
          />
        </ButtonsContainer>
      </Container>
    );
  }
}
