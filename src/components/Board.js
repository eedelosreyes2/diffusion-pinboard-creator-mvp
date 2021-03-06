import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import Card from './Card';
import { IconContext } from 'react-icons/lib';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { FiShare } from 'react-icons/fi';
import { IoMdTrash } from 'react-icons/io';
import { BsArrowClockwise } from 'react-icons/bs';
import styled from 'styled-components';
import { colors } from '../globals';

const Container = styled.div`
  background-color: ${colors.grey50};
  border: 2px dashed #d1d5db;
  border-radius: 7.5px;
  display: flex;
  flex-direction: column;
  margin: 20px 5px;
  min-height: 420px;
  position: relative;
`;

const Handle = styled.div`
  background-color: #e5e7eb;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: ${colors.grey500};
  height: 10px;
  margin: 0 auto;
  padding-bottom: 16px;
  position: absoulte;
  text-align: center;
  top: 0;
  width: 100%;
`;

const iconStyle = {
  top: 0,
};

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
  color: ${colors.grey900};
  padding: 16px 0px;
`;

const CardsContainer = styled.div`
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: auto;
  width: 332px;
`;

const StoryContainer = styled.div`
  display: flex;
  height: 100%;
  margin: 5px auto;
  width: 332px;
`;

const Story = styled.div`
  height: 75%;
  color: ${colors.grey500};
  padding: 16px 16px;
  margin: auto;
  text-align: center;
  width: 100%;
`;

const AddContentButton = styled.div`
  align-items: center;
  background-color: ${colors.primary};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  font-weight: bold;
  height: 15px;
  margin: 10px auto;
  padding: 5px;
  text-align: center;
  width: 90%;
`;

const FooterContainer = styled.div`
	align-items: center;
	bottom: 0;
	display: flex;
	flex-direction: row;
	padding:16px 0px;
	justify-content: space-evenly;
	left: 0,
	position: absolute;
	right: 0;
`;

export class Board extends Component {
  constructor() {
    super();
    this.state = {
      isFlipped: false,
    };
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      document.activeElement.blur();
    }
  };

  handleFlip = () => {
    this.setState((prevState) => ({ isFlipped: !prevState.isFlipped }));
  };

  render() {
    const { id, title, story } = this.props.board;
    const { username } = this.props;

    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <Container
              boardId={id}
              {...provided.draggableProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              <Handle {...provided.dragHandleProps}>
                <IconContext.Provider
                  value={{ size: '1.5em', style: iconStyle }}
                >
                  <HiOutlineDotsHorizontal />
                </IconContext.Provider>
              </Handle>

              <Title>
                <ContentEditable
                  id="board-title"
                  html={title}
                  onKeyPress={(e) => this.handleKeyPress(e)}
                  onChange={(e) => this.props.editBoard(e, id)}
                  disabled={false}
                />
              </Title>

              {this.state.isFlipped ? (
                <Back
                  boardId={id}
                  story={story}
                  editBoard={this.props.editBoard}
                />
              ) : (
                <Front
                  id={id}
                  index={this.props.index}
                  content={this.props.content}
                  createContent={this.props.createContent}
                  editContent={this.props.editContent}
                  deleteContent={this.props.deleteContent}
                />
              )}

              <Footer
                username={username}
                id={id}
                title={title}
                isFlipped={this.state.isFlipped}
                handleFlip={this.handleFlip}
                deleteBoard={this.props.deleteBoard}
                shareBoard={this.shareBoard}
              />
            </Container>
          );
        }}
      </Draggable>
    );
  }
}

export default Board;

class Front extends Component {
  render() {
    const { id, content } = this.props;

    return (
      <>
        <Droppable droppableId={id}>
          {(provided) => {
            return (
              <CardsContainer
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {content
                  ? content.map((content, index) =>
                      content ? (
                        <Card
                          key={content.id}
                          content={content}
                          index={index}
                          editContent={this.props.editContent}
                          deleteContent={this.props.deleteContent}
                          boardId={id}
                        />
                      ) : (
                        ''
                      )
                    )
                  : ''}

                {provided.placeholder}
              </CardsContainer>
            );
          }}
        </Droppable>
        {content.length < 5 ? (
          <AddContentButton onClick={() => this.props.createContent(id)}>
            +
          </AddContentButton>
        ) : (
          ''
        )}
      </>
    );
  }
}

class Back extends Component {
  render() {
    return (
      <StoryContainer>
        <Story>
          <ContentEditable
            style={{
              minHeight: '5em',
              padding: '12px',
              border: '2px solid #E5E7EB',
              borderRadius: '4px',
            }}
            id="board-story"
            html={this.props.story}
            onChange={(e) => this.props.editBoard(e, this.props.boardId)}
            disabled={false}
          />
        </Story>
      </StoryContainer>
    );
  }
}

class Footer extends Component {
  render() {
    const { username, id, title, isFlipped } = this.props;
    const flipIconStyle = {
      cursor: 'pointer',
      transform: isFlipped ? 'scaleX(-1)' : '',
    };
    const url = `u/${username}/${id}`;

    return (
      <FooterContainer boardId={id}>
        <IconContext.Provider value={{ style: { cursor: 'pointer' } }}>
          <Link to={url} target="_blank" rel="noopener noreferrer">
            <FiShare />
          </Link>
        </IconContext.Provider>
        <IconContext.Provider
          value={{
            size: '2em',
            style: flipIconStyle,
            color: colors.grey500,
          }}
        >
          <BsArrowClockwise onClick={this.props.handleFlip} />
        </IconContext.Provider>
        <IconContext.Provider
          value={{ style: { cursor: 'pointer', color: colors.grey500 } }}
        >
          <IoMdTrash onClick={() => this.props.deleteBoard(id, title)} />
        </IconContext.Provider>
      </FooterContainer>
    );
  }
}
