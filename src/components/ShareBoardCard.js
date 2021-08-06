import React, { Component } from 'react';
import styled from 'styled-components';
import { colors } from '../globals';
import Logo from '../images/Logo_zoom_out.png';

const Container = styled.div`
  align-items: center;
  border: 2px solid grey;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  min-height: 250px;
  justify-content: center;
  padding-bottom: 40px;
  position: relative;
  transform: ${(props) => (props.isHovered ? 'scale(1.05)' : '')};
  transition: all 0.2s ease-in-out;
  width: 300px;
`;

const Image = styled.img`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
`;
const NoImage = styled.div`
  width: 300px;
`;

const Url = styled.div`
  color: ${colors.primary};
  display: flex;
  font-size: 20px;
  margin: 10px auto;
  text-decoration: none;
  width: 90%;
`;

const QuickThoughts = styled.div`
  display: flex;
  margin: auto;
  width: 90%;
`;

const Category = styled.div`
  border: 1px solid ${colors.secondary};
  border-radius: 5px;
  bottom: 0;
  display: inline-block;
  font-size: 12px;
  margin: 10px;
  min-width: 10px;
  padding: 2px 5px;
  position: absolute;
`;

const Favicon = styled.img`
  bottom: 0;
  height: 20px;
  margin: 10px;
  position: absolute;
  right: 0;
  width: 20px;
`;

export default class ShareBoardCard extends Component {
  constructor() {
    super();
    this.state = { isHovered: false };
  }

  toggleHover = () => {
    this.setState({ isHovered: !this.state.isHovered });
  };

  setHttp = (link) => {
    if (link) {
      if (link.search(/^http[s]?:\/\//) === -1) {
        link = 'https://' + link;
      }
    }
    return link;
  };

  render() {
    const {
      id,
      quickThoughts,
      category,
      metaTitle,
      metaFavicon,
      metaImagebase64,
      customImage,
    } = this.props.content;
    const url = this.setHttp(this.props.content.url);

    let imgSrc = '';
    if (metaImagebase64) {
      imgSrc = `data:image/png;base64,${metaImagebase64}`;
    } else if (customImage) {
      imgSrc = customImage;
    } else {
      imgSrc = Logo;
    }

    let quickThoughtsArr = quickThoughts.split('<div>');
    let i;
    for (i = 0; i < quickThoughtsArr.length; i++) {
      quickThoughtsArr[i] = quickThoughtsArr[i].replaceAll('&nbsp;', '\n');
      quickThoughtsArr[i] = quickThoughtsArr[i].replaceAll('</div>', '');
      quickThoughtsArr[i] = quickThoughtsArr[i].replaceAll('<br>', '\n');
      if (quickThoughtsArr[i] === '\n') {
        quickThoughtsArr[i] = <br />;
      }
    }

    return (
      <a href={url} target="_blank" rel="noreferrer">
        <Container
          onMouseEnter={() => this.toggleHover()}
          onMouseLeave={() => this.toggleHover()}
          isHovered={this.state.isHovered}
        >
          <div>
            <Image src={imgSrc} />
            <Url as="a" href={url} target="__blank">
              {metaTitle
                ? metaTitle
                : url
                ? url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0]
                : ''}
            </Url>
            <QuickThoughts>
              {quickThoughtsArr.map((quickThought, index) => (
                <div key={index}>{quickThought}</div>
              ))}
            </QuickThoughts>
            <Category>{category}</Category>
            {metaFavicon ? <Favicon src={metaFavicon} /> : ''}
          </div>
        </Container>
      </a>
    );
  }
}
