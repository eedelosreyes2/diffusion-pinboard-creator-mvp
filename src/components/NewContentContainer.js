import React, { Component } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin: 0 auto 10px auto;
  padding-top: 30px;
  width: 100%;
`;

const Button = styled.div`
  align-items: center;
  background-color: rgba(110, 110, 110, 0.25);
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
`;

export default class NewContentContainer extends Component {
  render() {
    let content = [];
    if (this.props.content) {
      content = this.props.board0.contentIds.map(
        (contentId) => this.props.content[contentId]
      );
    }

    return (
      <Container>
        <Button onClick={this.props.createContent}>+</Button>
        <Droppable droppableId="board0" direction="horizontal">
          {(provided) => {
            return (
              <CardsContainer
                contentLength={content.length}
                className="hidden-scroll"
                ref={provided.innerRef}
                {...provided.innerRef}
              >
                {content.map((content, index) => {
                  return content ? (
                    <Card
                      key={content.id}
                      content={content}
                      index={index}
                      editCard={this.props.editCard}
                      deleteContent={this.props.deleteContent}
                      boardId="board0"
                    />
                  ) : (
                    ''
                  );
                })}
                {provided.placeholder}
              </CardsContainer>
            );
          }}
        </Droppable>
      </Container>
    );
  }
}
