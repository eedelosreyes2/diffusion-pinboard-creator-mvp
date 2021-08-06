import React, { Component } from 'react';
import Board from './Board';

export default class Boards extends Component {
  render() {
    const { data, username, deleteBoard, editBoard, editContent } = this.props;

    return (
      <>
        {data.boardOrder.map((boardId, index) => {
          const board = data.boards[boardId];

          let content = '';
          if (data.content) {
            content = board.contentIds.map(
              (contentId) => data.content[contentId]
            );
          }

          if (boardId !== 'board0') {
            return (
              <Board
                index={index}
                key={board.id}
                username={username}
                board={board}
                content={content}
                deleteBoard={deleteBoard}
                editBoard={editBoard}
                editContent={editContent}
              />
            );
          }
          return '';
        })}
      </>
    );
  }
}
