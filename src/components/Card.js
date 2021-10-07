import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import Popup from 'reactjs-popup';
import ImageUploader from 'react-images-upload';
import { IconContext } from 'react-icons/lib';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdInsertPhoto } from 'react-icons/md';
import { IoMdTrash } from 'react-icons/io';
import styled from 'styled-components';
import { categories, colors } from '../globals';
import Logo from '../images/Logo_zoom_out.png';

const Container = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.15);

  // todo: the If rendering is not working here
  margin-right: ${(boardId) => (boardId === 'board0' ? '16px' : '0px')};
  margin-left: ${(boardId) => (boardId === 'board0' ? '0px' : '16px')};
  margin-bottom: ${(boardId) => (boardId === 'board0' ? '0px' : '16px')};

  color: ${colors.grey500};
  min-width: 300px;
  width: 300px;
  padding-bottom: 40px;
  position: relative;
`;

const Handle = styled.div`
  background-color: #f3f4f6;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  height: 20px;
  left: 0;
  text-align: center;
  top: 0;
  width: 100%;
`;

const Image = styled.img`
  height: 150px;
  pointer-events: none;
  width: 100%;
`;

const InsertImage = styled.div`
  align-items: center;
  background-color: ${colors.grey50};
  backdrop-filter: blur(40px);
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  height: 25px;
  justify-content: center;
  opacity: 80%;
  right: 10px;
  top: 30px;
  position: absolute;
  width: 25px;
`;

const InsertImageModalContainer = styled.div`
  align-items: center;
  background-color: ${colors.grey50};

  border: none;
  border-radius: 10px;
  display: flex;
  justify-content: space-evenly;
  width: 200px;
  height: 60px;
`;

const arrowStyle = { color: colors.grey50 };

const InsertImageButton = styled.div`
  align-items: center;
  background-color: #e5e7eb;
  border-radius: 4px;
  color: ${colors.grey500};
  cursor: pointer;
  display: flex;
  height: 70%;
  justify-content: center;
  width: 40%;
`;

const imageUploadButtonStyle = {
  background: 'none',
  color: colors.grey500,
};

const Url = styled.div`
  color: ${colors.grey900};
  font-weight: bold;
  font-size: 16px;
  line-height: 130%;
  display: flex;
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 16px;
  text-decoration: none;
  width: 90%;
`;

const QuickThoughts = styled.div`
  display: inline-block;
  margin-left: 16px;
  margin-bottom: 16px;
  width: 90%;
  word-wrap: break-word;
  color: ${colors.grey400};
  font-weight: normal;
  font-size: 16px;
  line-height: 150%;
`;

const Category = styled.select`
  background-color: ${colors.grey50};
  border: none;
  border-radius: 4px;
  bottom: 0;
  color: ${colors.grey500};
  display: flex;
  font-size: 12px;
  left: 0;
  padding: 4px 8px;
  margin: 10px;
  outline: none;
  position: absolute;
  min-width: 80px;
`;

const DeleteContainer = styled.div`
  bottom: 0;
  height: 20px;
  margin: 10px;
  position: absolute;
  right: 0;
  width: 20px;
`;

export class Card extends Component {
  constructor() {
    super();
    this.state = {
      popupIsDisabled: false,
    };
  }

  setHttp = (link) => {
    if (link) {
      if (link.search(/^http[s]?:\/\//) === -1) {
        link = 'https://' + link;
      }
    }
    return link;
  };

  handleUpload = (image, id) => {
    const preview = document.getElementById(id + `image`);
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      this.props.editContent(reader.result, id);
    };
    reader.readAsDataURL(image[0]);
  };

  handleURL = (id) => {
    const url = prompt('Enter the URL of the image: ');
    if (url) {
      if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
        this.props.editContent(url, id);
      } else {
        alert('Image not found at given URL.');
      }
    }
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
    const { boardId } = this.props;
    const url = this.setHttp(this.props.content.url);

    let imgSrc = '';
    if (metaImagebase64) {
      imgSrc = `data:image/png;base64,${metaImagebase64}`;
    } else if (customImage) {
      imgSrc = customImage;
    } else {
      imgSrc = Logo;
    }
    // console.log(quickThoughts);
    console.log(quickThoughts, boardId);

    return (
      <Draggable draggableId={id} index={this.props.index}>
        {(provided, snapshot) => {
          return (
            <Container
              {...provided.draggableProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
              boardId={boardId}
            >
              <Handle {...provided.dragHandleProps}>
                <IconContext.Provider
                  value={{
                    style: {
                      color: colors.grey500,
                    },
                  }}
                >
                  <HiOutlineDotsHorizontal />
                </IconContext.Provider>
              </Handle>
              <Image id={id + `image`} src={imgSrc}></Image>
              <Popup
                trigger={
                  <InsertImage onClick={this.handleInsertImage}>
                    <IconContext.Provider
                      value={{
                        style: {
                          color: colors.grey900,
                        },
                      }}
                    >
                      <MdInsertPhoto />
                    </IconContext.Provider>
                  </InsertImage>
                }
                position="left"
                {...{ arrowStyle }}
              >
                <InsertImageModalContainer>
                  <InsertImageButton>
                    <ImageUploader
                      id="image-uploader"
                      withIcon={false}
                      withLabel={false}
                      withPreview={false}
                      buttonText="Upload"
                      fileContainerStyle={{ background: 'none' }}
                      buttonStyles={imageUploadButtonStyle}
                      onChange={(image) => {
                        this.handleUpload(image, id);
                      }}
                      imgExtension={['.jpg', '.gif', '.png', '.gif', '.svg']}
                      maxFileSize={1048576}
                      fileSizeError=" File size is too big!"
                    ></ImageUploader>
                  </InsertImageButton>
                  <InsertImageButton onClick={() => this.handleURL(id)}>
                    URL
                  </InsertImageButton>
                </InsertImageModalContainer>
              </Popup>
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
                  onBlur={(e) => this.props.editContent(e, id)}
                  disabled={false}
                  placeholder={'...'}
                />
              </QuickThoughts>
              <Category
                id="card-category"
                onChange={(e) => this.props.editContent(e, id)}
                defaultValue={category}
                style={{ width: `${4 * category.length + 32}pt` }}
              >
                {categories.map((category) => {
                  return (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  );
                })}
              </Category>
              <DeleteContainer>
                <IconContext.Provider
                  value={{ style: { cursor: 'pointer', color: '#9CA3AF' } }}
                >
                  <IoMdTrash
                    onClick={() => this.props.deleteContent(id, boardId)}
                  />
                </IconContext.Provider>
              </DeleteContainer>
            </Container>
          );
        }}
      </Draggable>
    );
  }
}

export default Card;
