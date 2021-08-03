import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import { IconContext } from 'react-icons/lib';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import styled from 'styled-components';
import { colors } from '../globals';

const Container = styled.div`
  background-color: ${colors.darkBg};
  border: 1px solid #636363;
  border-radius: 5px;
  margin: 5px;
  min-height: 50px;
  max-width: 250px;
  min-width: 250px;
  padding-bottom: 40px;
  position: relative;
`;

const Handle = styled.div`
  background-color: #636363;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  height: 20px;
  left: 0;
  text-align: center;
  top: 0;
  width: 100%;
`;

const iconStyle = {
  top: 0,
};

const Image = styled.img`
  height: 180px;
  width: 100%;
`;

const Url = styled.div`
  color: ${colors.primary};
  display: flex;
  margin: 10px auto;
  text-decoration: none;
  width: 90%;
`;

const QuickThoughts = styled.div`
  display: flex;
  margin: 10px auto;
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

export class Card extends Component {
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
    } = this.props.content;
    const url = this.setHttp(this.props.content.url);

    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <Container
              {...provided.draggableProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              <Handle {...provided.dragHandleProps}>
                <IconContext.Provider value={{}}>
                  <HiOutlineDotsHorizontal />
                </IconContext.Provider>
              </Handle>
              <a href={url} target="__blank">
                {metaImagebase64 ? (
                  <Image src={`data:image/png;base64,${metaImagebase64}`} />
                ) : (
                  ''
                )}
              </a>
              <Url as="a" href={url} target="__blank">
                {metaTitle
                  ? metaTitle
                  : url
                  ? url
                      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
                      .split('/')[0]
                  : ''}
              </Url>
              <QuickThoughts>
                <ContentEditable
                  id="card-quick-thoughts"
                  html={quickThoughts}
                  onChange={(e) => this.props.editCard(e, id)}
                  disabled={false}
                />
              </QuickThoughts>
              <Category>
                <ContentEditable
                  id="card-category"
                  html={category}
                  onChange={(e) => this.props.editCard(e, id)}
                  disabled={false}
                />
              </Category>
              {metaFavicon ? <Favicon src={metaFavicon} /> : ''}
            </Container>
          );
        }}
      </Draggable>
    );
  }
}

export default Card;
