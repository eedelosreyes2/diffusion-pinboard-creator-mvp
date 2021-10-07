import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import ReactTooltip from 'react-tooltip';
import Card from './Card';
import styled from 'styled-components';
import { colors } from '../globals';

const Container = styled.div`
  display: flex;
  margin: 0 auto 10px auto;
  padding-top: 30px;
  width: 100%;
`;

const Button = styled.div`
  align-items: center;
  background-color: ${colors.primary};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  height: 175px;
  margin-top: 5px;
  margin-right: 10px;
  padding: 5px;
  text-align: center;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: left;
  min-height: ${(props) => (props.contentLength <= 1 ? '10px' : '100px')};
  overflow: auto;
  position: relative;
  padding-left:8px;
  padding-bottom:8px;
`;

const ScrollCotainer = styled.div`
  background-color: grey;
  height: 100%;
  width: 50px;
  position: absolute;
  opacity: ${(props) => (props.isHovered ? 0.75 : 0.25)};
  left: 0;
  z-index: 100;
`;

export default class NewContentContainer extends Component {
  constructor() {
    super();
    this.state = { leftScrollHovered: false, rightScrollHovered: false };
  }

  render() {
    let content = [];
    if (this.props.content) {
      content = this.props.board0.contentIds.map(
        (contentId) => this.props.content[contentId]
      );
    }

    let { leftScrollHovered, rightScrollHovered } = this.state;

    return (
      <Container>
        <Button
          onClick={() => this.props.createContent('board0')}
          data-tip
          data-for="content"
        >
          +
        </Button>
        <ReactTooltip id="content" place="right" type="info" effect="solid">
          <span>Add new Content</span>
        </ReactTooltip>
        <Droppable droppableId="board0" direction="horizontal">
          {(provided) => {
            return (
              <CardsContainer
                contentLength={content.length}
                className="hidden-scroll"
                ref={provided.innerRef}
                {...provided.innerRef}
              >
                {/* add hoverable divs */}
                {/* <ScrollCotainer
                  isHovered={leftScrollHovered}
                  onMouseEnter={() =>
                    this.setState({ leftScrollHovered: true })
                  }
                  onMouseLeave={() =>
                    this.setState({ leftScrollHovered: false })
                  }
                ></ScrollCotainer> */}

                {content.map((content, index) => {
                  return content ? (
                    <Card
                      key={content.id}
                      content={content}
                      index={index}
                      editContent={this.props.editContent}
                      deleteContent={this.props.deleteContent}
                      boardId="board0"
                    />
                  ) : (
                    ''
                  );
                })}

                {/* <ScrollCotainer
                  isHovered={leftScrollHovered}
                  onMouseEnter={() =>
                    this.setState({ leftScrollHovered: true })
                  }
                  onMouseLeave={() =>
                    this.setState({ leftScrollHovered: false })
                  }
                ></ScrollCotainer> */}
                {provided.placeholder}
              </CardsContainer>
            );
          }}
        </Droppable>
      </Container>
    );
  }
}
