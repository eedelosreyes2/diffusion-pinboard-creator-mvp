import React, { Component } from 'react';
import styled from 'styled-components';
import { colors } from '../globals';
import Logo from '../images/Logo_zoom_out.png';

const Container = styled.div`
  align-items: center;
  background-color: white;
  border-radius:8px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);
  color: ${colors.grey500};
  cursor: pointer;
  display: flex;
  margin: 10px;
  min-height: 250px;
  justify-content: center;
  padding-bottom: 50px;
  position: relative;
  transform: ${(props) => (props.isHovered ? 'scale(1.05)' : '')};
  transition: all 0.2s ease-in-out;
  width: 300px;
`;

const Image = styled.img`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 100%;
  width: 300px;
`;

const Url = styled.div`
  color: ${colors.grey900};
  font-weight: bold;
  font-size: 16px;
  line-height: 130%;
  display: flex;
  margin-left:16px;
  margin-top: 16px;
  margin-bottom:16px;
  text-decoration: none;
  width: 90%;
`;

const QuickThoughts = styled.div`
  display: inline-block;
  padding-left: 16px;
  margin-bottom:16px;
  width: 275px;
  word-wrap: break-word;
  color: ${colors.grey400};
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
`;

const Category = styled.div`
  background-color: ${colors.grey50};
  border: none;
  border-radius: 4px;
  bottom: 0;
  display: inline-block;
  font-size: 12px;
  left: 0;
  margin: 15px;
  min-width: 10px;
  padding: 4px 8px;
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
            {category ? <Category>{category}</Category> : ''}
            {/* {metaFavicon ? <Favicon src={metaFavicon} /> : ''} */}
          </div>
        </Container>
      </a>
    );
  }
}
