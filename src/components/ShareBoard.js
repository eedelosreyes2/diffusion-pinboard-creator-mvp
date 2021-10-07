import React, { Component } from 'react';
import axios from 'axios';
import ShareBoardCard from './ShareBoardCard';
import styled from 'styled-components';
import { DB_URL } from '../globals';
import { colors } from '../globals';
import Logo from '../images/Logo_cool.png';

const Container = styled.div`
  align-items: center;
  background-color: ${colors.grey50};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  width: 100%;
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  height: 90px;
  justify-content: center;
  padding-top: 30px;
  width: 100%;
`;

const LogoImg = styled.img`
  cursor: pointer;
  height: 50px;
`;

const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 75%;
  margin: auto;
  padding-top: 50px;
  text-align: center;
  width: 80%;
`;

const Title = styled.div`
  font-size: 60px;
  overflow-wrap: break-word;
  text-overflow: wrap;
  font-color:${colors.grey900};
  font-weight:bold;
  font-size:40px;
  line-height:130%;
`;

const TitleUnderline = styled.div`
  display:none;
  height: 2px;
  background-color: ${colors.grey100};
  margin: auto;
  margin-bottom: 20px;
  width: 100px;
`;

const Story = styled.div`
  margin-left: auto;
  margin-right:auto;
  margin-top:24px;
  width: 80%;
  // color: ${colors.grey400};
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
  @media only screen and (max-width: 1400px) {
    width: 100%;
  }
`;

const CardsContainer = styled.div`
  align-content: space-evenly;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: 90%;
  margin: auto;
  padding: 50px 0 100px 0;
  justify-content: space-evenly;
  justify-items: center;
  width: 70%;
  @media only screen and (max-width: 1400px) {
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }
`;

const Footer = styled.div`
  height: 75px;
  line-height: 75px;
  text-align: center;
  width: 100%;
`;

export default class ShareBoard extends Component {
  constructor() {
    super();
    this.state = { data: null, name: null, board: null, content: null };
  }

  componentDidMount = () => {
    this.getBoard();
  };

  getBoard = () => {
    const hashs = window.location.hash.split('/');
    const username = hashs[2];
    const boardId = hashs[3];
    const url = DB_URL + username + '/data.json';

    axios
      .get(url)
      .then((res) => {
        const { data } = res;
        if (data) {
          const { name } = data;
          const board = data.boards[boardId];
          const content = board.contentIds.map(
            (contentId) => data.content[contentId]
          );
          this.setState({ data, name, board, content });
          document.title = `${name.split(' ')[0]}'s Diffusion Board`;
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    if (this.state.data) {
      let story = this.state.board.story;
      if (story === 'Click here to add a story to this board!') {
        story = 'This is a super cool board!';
      }

      let storyArr = story.split('<div>');
      let i;
      for (i = 0; i < storyArr.length; i++) {
        storyArr[i] = storyArr[i].replaceAll('&nbsp;', '\n');
        storyArr[i] = storyArr[i].replaceAll('</div>', '');
        storyArr[i] = storyArr[i].replaceAll('<br>', '\n');
        if (storyArr[i] === '\n') {
          storyArr[i] = <br />;
        }
      }

      return (
        <Container>
          <Header>
            <a
              href="https://diffusion.me"
              target="_blank"
              without
              rel="noreferrer"
            >
              <LogoImg src={Logo}></LogoImg>
            </a>
          </Header>
          <StoryContainer>
            <div>
              <Title>{this.state.board.title}</Title>
              <TitleUnderline />
            </div>
            <Story>
              {storyArr.map((quickThought, index) => (
                <div key={index}>{quickThought}</div>
              ))}
            </Story>
          </StoryContainer>
          <CardsContainer>
            {this.state.content.map((content, index) => {
              return content ? (
                <ShareBoardCard key={index} content={content} />
              ) : (
                ''
              );
            })}
          </CardsContainer>
          <Footer>
            curated by <b>{this.state.name}</b>
          </Footer>
        </Container>
      );
    }
    return <div></div>;
  }
}
