import React, { Component } from 'react';
import LogOutComponent from './LogOutComponent';
import styled from 'styled-components';
import { colors } from '../globals';

const Container = styled.div`
  display: flex;
  height: 100px;
  padding-top: 20px;
  width: 100%;
`;

const H1 = styled.h1`
  color: #00b1d2;
  margin: auto;
  text-align: center;
  width: 50%;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: ${(props) =>
    props.type === 'logout' ? 'flex-end' : 'flex-start'};
  margin: auto;
  width: 25%;
`;

const Button = styled.div`
  background-color: ${(props) =>
    props.type === 'board' ? colors.primary : colors.secondary};
  border-radius: 10px;
  color: ${colors.darkBg};
  cursor: pointer;
  font-weight: bold;
  height: 35px;
  margin-right: 10px;
  padding: 15px 15px 0 15px;
  text-align: center;
`;

export default class Header extends Component {
  render() {
    const { givenName } = this.props.profileObj;

    return (
      <Container>
        <ButtonsContainer>
          <Button type="board" onClick={this.props.createBoard}>
            +Board
          </Button>
          <Button type="content" onClick={this.props.createContent}>
            +Content
          </Button>
        </ButtonsContainer>
        <H1>{`${givenName}'s Diffusion Boards`}</H1>
        <ButtonsContainer type="logout">
          <LogOutComponent
            responseGoogleLogout={this.props.responseGoogleLogout}
          />
        </ButtonsContainer>
      </Container>
    );
  }
}
