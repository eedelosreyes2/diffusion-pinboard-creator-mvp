import React, { Component } from 'react';
import axios from 'axios';
import ShareBoardCard from './ShareBoardCard';
import styled from 'styled-components';
import { DB_URL } from '../globals';
import { colors } from '../globals';
import Logo from '../images/Logo_cool.png';

const Container = styled.div`
  align-items: center;
  background-color: ${colors.primary};
  color: white;
  display: flex;
  min-height: 100vh;
  justify-content: center;
  width: 100vw;
  @media only screen and (max-width: 1400px) {
    height: 100%;
    width: 100%;
  }
`;

const Background = styled.div`
  background-color: ${colors.darkBg};
  border-radius: 10px;
  min-height: 95vh;
  position: relative;
  width: 95vw;
  @media only screen and (max-width: 1400px) {
    height: 90%;
    padding: 0;
    width: 90%;
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  width: 95%;
  @media only screen and (max-width: 1400px) {
    flex-direction: column;
  }
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  height: 90px;
  justify-content: center;
  top: 0;
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
  justify-content: center;
  margin: auto;
  padding-top: 100px;
  width: 80%;
  @media only screen and (max-width: 1400px) {
    display: block;
    padding: 0;
    width: 100%;
  }
`;

const Title = styled.div`
  font-size: 60px;
  overflow-wrap: break-word;
  text-overflow: wrap;
`;

const TitleUnderline = styled.div`
  height: 2px;
  background-color: ${colors.secondary};
  margin-bottom: 50px;
  width: 300px;
  @media only screen and (max-width: 1400px) {
    margin-bottom: 50px;
  }
`;

const Story = styled.div`
  width: 80%;
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

const ShareBoardCardContainer = styled.div`
  margin: 10px;
  @media only screen and (max-width: 1400px) {
    margin: 20px;
  }
`;

const Footer = styled.div`
  align-items: center;
  bottom: 0;
  display: flex;
  height: 150px;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  width: 100%;
`;

const Author = styled.div`
  margin-top: 100px;
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
          <Background>
            <InnerContainer>
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
                    <ShareBoardCardContainer key={index}>
                      <ShareBoardCard key={index} content={content} />
                    </ShareBoardCardContainer>
                  ) : (
                    ''
                  );
                })}
              </CardsContainer>
              <Footer>
                <Author>
                  diffused by <b>{this.state.name}</b>
                </Author>
              </Footer>
            </InnerContainer>
          </Background>
        </Container>
      );
    }
    return <div></div>;
  }
}
