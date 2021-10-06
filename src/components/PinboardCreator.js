import React, { Component } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ReactTooltip from 'react-tooltip';
import Header from './Header';
import NewContentContainer from './NewContentContainer';
import Boards from './Boards';
import styled from 'styled-components';
import { scraperEndpoint, colors } from '../globals';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: auto;
  overflow: auto;
  width: 95%;
`;

const ScrollContainer = styled.div`
  display: flex;
`;

const BoardsContainer = styled.div`
  display: flex;
  justify-content: left;
  margin: 0 auto;
  overflow: auto;
  padding-bottom: 75px;
  width: 100%;
`;

const Button = styled.div`
  align-items: center;
  background-color: ${colors.darkGrey};
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  height: 175px;
  margin-top: 20px;
  margin-right: 10px;
  padding: 5px;
  text-align: center;
`;

export default class PinboardCreator extends Component {
  handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    // Invalid Drag
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // BOARDS
    if (type === 'board') {
      const newBoardOrder = Array.from(this.props.data.boardOrder);
      newBoardOrder.splice(source.index, 1);
      newBoardOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.props,
        data: {
          ...this.props.data,
          boardOrder: newBoardOrder,
        },
      };

      this.props.updateBoards(newState);
      return;
    }

    // CONTENT
    const start = this.props.data.boards[source.droppableId]; // Start Board
    const finish = this.props.data.boards[destination.droppableId]; // Finish Board

    // Dragging Content into Trash
    // if (destination.droppableId === 'trash') {
    //   this.deleteContent(draggableId, start, source);
    //   return;
    // }

    // If more than 5 in finish board, do not drop Content
    if (
      start !== finish &&
      finish.contentIds.length > 5 &&
      destination.droppableId !== 'board0'
    ) {
      alert('You can only have up to 5 pieces of Content in a Board!');
      return;
    }

    // Dragging Content within Board
    if (start === finish) {
      const newContentIds = Array.from(start.contentIds);
      newContentIds.splice(source.index, 1);
      newContentIds.splice(destination.index, 0, draggableId);

      const newBoard = {
        ...start,
        contentIds: newContentIds,
      };

      const newState = {
        ...this.props,
        data: {
          ...this.props.data,
          boards: {
            ...this.props.data.boards,
            [newBoard.id]: newBoard,
          },
        },
      };

      this.props.updateBoards(newState);
      return;
    }

    // Dragging Content between Boards
    const startContentIds = Array.from(start.contentIds);
    startContentIds.splice(source.index, 1);
    const newStart = {
      ...start,
      contentIds: startContentIds,
    };

    const finishContentIds = Array.from(finish.contentIds);
    finishContentIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      contentIds: finishContentIds,
    };

    const newState = {
      ...this.props,
      data: {
        ...this.props.data,
        boards: {
          ...this.props.data.boards,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      },
    };

    this.props.updateBoards(newState);
  };

  createBoard = () => {
    const title = prompt(
      'Create a new Board!\nWhat is the title of the board?'
    );
    if (!title || title == null) return;

    const id = uuidv4();
    const story = 'Click here to add a story to this board!';
    const newBoard = {
      id,
      title,
      story,
      contentIds: [0],
    };
    const newBoardOrder = Array.from(this.props.data.boardOrder);
    newBoardOrder.splice(1, 0, id);

    const newState = {
      ...this.props,
      data: {
        ...this.props.data,
        boards: {
          ...this.props.data.boards,
          [newBoard.id]: newBoard,
        },
        boardOrder: newBoardOrder,
      },
    };

    this.props.updateBoards(newState);
  };

  deleteBoard = (boardId, boardTitle) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${boardTitle} along with all of its content?`
      )
    ) {
      let i;
      const boardContent = this.props.data.boards[boardId].contentIds;
      for (i = 0; i < Object.keys(boardContent).length - 1; i++) {
        const id = boardContent[i];
        delete this.props.data.content[id];
      }

      delete this.props.data.boards[boardId];
      const newBoardOrder = Array.from(this.props.data.boardOrder).filter(
        (e) => e !== boardId
      );

      const newState = {
        ...this.props,
        data: {
          ...this.props.data,
          boardOrder: newBoardOrder,
        },
      };

      this.props.updateBoards(newState);
    }
  };

  editBoard = (e, boardId) => {
    const board = this.props.data.boards[boardId];

    if (e.currentTarget.id === 'board-title') {
      board.title = e.currentTarget.innerHTML;
    } else if (e.currentTarget.id === 'board-story') {
      board.story = e.currentTarget.innerHTML;
    }
    this.props.updateBoards(this.state);
  };

  createContent = (boardId) => {
    let url = prompt('Create a new Content Card!\nEnter the url: ');
    if (!url) return;

    if (url.search(/^http[s]?:\/\//) === -1) {
      url = 'https://' + url;
    }

    const quickThoughts = prompt('Enter Quick Thoughts: ');
    if (quickThoughts == null) return;

    // const category = prompt('Enter category: '); // this would be from a dropdownlist
    // if (category == null) return;
    const category = '';

    const id = uuidv4();
    let newCard = {
      id,
      url,
      quickThoughts,
      category,
    };

    // Fetch meta tags
    axios
      .post(scraperEndpoint, { url })
      .then((res) => {
        const { metaTitle, metaFavicon, metaImagebase64 } = res.data;
        newCard = {
          ...newCard,
          metaTitle,
          metaFavicon,
          metaImagebase64,
        };

        const content = {
          ...this.props.data.content,
          [newCard.id]: newCard,
        };
        const newState = {
          ...this.props,
          data: {
            ...this.props.data,
            content,
          },
        };
        this.props.updateBoards(newState);
      })
      .catch((err) => console.log(err));

    const content = {
      ...this.props.data.content,
      [newCard.id]: newCard,
    };

    let contentIds;
    if (boardId === 'board0') {
      contentIds = [id, ...this.props.data.boards[boardId].contentIds];
    } else {
      contentIds = [...this.props.data.boards[boardId].contentIds, id];
    }
    const board = {
      ...this.props.data.boards[boardId],
      contentIds,
    };
    const boards = {
      ...this.props.data.boards,
      [boardId]: board,
    };
    const newState = {
      ...this.props,
      data: {
        ...this.props.data,
        content,
        boards,
      },
    };
    this.props.updateBoards(newState);
  };

  deleteContent = (contentId, boardId) => {
    if (
      window.confirm(
        `Are you sure you want to delete content from ${this.props.data.content[contentId].url} ?`
      )
    ) {
      const boardContent = this.props.data.boards[boardId].contentIds;
      const index = boardContent.indexOf(contentId);
      boardContent.splice(index, 1);

      const newBoard = {
        ...this.props.data.boards[boardId],
        contentIds: boardContent,
      };

      const newBoards = {
        ...this.props.data.boards,
        newBoard,
      };

      const newState = {
        ...this.props,
        data: {
          ...this.props.data,
          boards: newBoards,
        },
      };

      delete this.props.data.content[contentId];

      this.props.updateBoards(newState);

      // delete this.props.data.content[draggableId];
      // const startContentIds = Array.from(start.contentIds);
      // startContentIds.splice(source.index, 1);

      // const newStart = {
      //   ...start,
      //   contentIds: startContentIds,
      // };

      // const newState = {
      //   ...this.props,
      //   data: {
      //     ...this.props.data,
      //     boards: {
      //       ...this.props.data.boards,
      //       [newStart.id]: newStart,
      //     },
      //   },
      // };

      // this.props.updateBoards(newState);
    }
  };

  editContent = (e, contentId) => {
    const content = this.props.data.content[contentId];

    if (e.currentTarget && e.currentTarget.id === 'card-quick-thoughts') {
      content.quickThoughts = e.currentTarget.innerText;
    } else if (e.currentTarget && e.currentTarget.id === 'card-category') {
      content.category = e.currentTarget.value;
    } else {
      content.metaImagebase64 = '';
      content.customImage = e;
    }

    const newState = {
      ...this.props,
      data: {
        ...this.props.data,
        boards: {
          ...this.props.data.boards,
        },
        content: {
          ...this.props.data.content,
          [contentId]: content,
        },
      },
    };

    this.props.updateBoards(newState);
  };

  render() {
    const { profileObj, username, data } = this.props;

    if (data) {
      return (
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable
            droppableId="boardsContainer"
            direction="horizontal"
            type="board"
          >
            {(provided) => (
              <Container className="hidden-scroll">
                <Header
                  profileObj={profileObj}
                  responseGoogleLogout={this.props.responseGoogleLogout}
                  createBoard={this.createBoard}
                  createContent={this.createContent}
                />
                <NewContentContainer
                  board0={data.boards.board0}
                  content={data.content}
                  createContent={this.createContent}
                  editContent={this.editContent}
                  deleteContent={this.deleteContent}
                ></NewContentContainer>
                <ScrollContainer>
                  <Button onClick={this.createBoard} data-tip data-for="board">
                    +
                  </Button>
                  <ReactTooltip
                    id="board"
                    place="right"
                    type="info"
                    effect="solid"
                  >
                    <span>Add new Board</span>
                  </ReactTooltip>
                  <BoardsContainer
                    className="hidden-scroll"
                    ref={provided.innerRef}
                    {...provided.innerRef}
                  >
                    <Boards
                      username={username}
                      data={data}
                      deleteBoard={this.deleteBoard}
                      editBoard={this.editBoard}
                      createContent={this.createContent}
                      editContent={this.editContent}
                      deleteContent={this.deleteContent}
                    />
                    {provided.placeholder}
                  </BoardsContainer>
                </ScrollContainer>
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
    return <div></div>;
  }
}
