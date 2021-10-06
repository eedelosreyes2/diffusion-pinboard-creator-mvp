import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import Popup from 'reactjs-popup';
import ImageUploader from 'react-images-upload';
import { IconContext } from 'react-icons/lib';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdInsertPhoto } from 'react-icons/md';
import { FiTrash } from 'react-icons/fi';
import styled from 'styled-components';
import { categories, colors } from '../globals';
import Logo from '../images/Logo_zoom_out.png';

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

const Image = styled.img`
  height: 150px;
  pointer-events: none;
  width: 100%;
`;

const InsertImage = styled.div`
  align-items: center;
  background-color: grey;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  height: 25px;
  justify-content: center;
  opacity: 50%;
  right: 10px;
  top: 30px;
  position: absolute;
  width: 25px;
`;

const InsertImageModalContainer = styled.div`
  align-items: center;
  background-color: ${colors.darkBg};
  border: 2px solid ${colors.primary};
  border-radius: 10px;
  display: flex;
  justify-content: space-evenly;
  width: 200px;
  height: 60px;
`;

const arrowStyle = { color: colors.primary };

const InsertImageButton = styled.div`
  align-items: center;
  background-color: grey;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  font-family: aleo;
  height: 70%;
  justify-content: center;
  width: 40%;
`;

const imageUploadButtonStyle = {
  background: 'none',
  fontFamily: 'aleo',
};

const Url = styled.div`
  color: ${colors.primary};
  display: flex;
  margin: 10px auto;
  text-decoration: none;
  width: 90%;
`;

const QuickThoughts = styled.div`
  display: inline-block;
  margin: 10px;
  width: 90%;
  word-wrap: break-word;
`;

const Category = styled.select`
  background-color: ${colors.darkBg};
  border: 1px solid ${colors.secondary};
  border-radius: 5px;
  bottom: 0;
  color: white;
  display: flex;
  font-size: 12px;
  left: 0;
  margin: 10px;
  outline: none;
  padding: 1px;
  position: absolute;
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
    console.log(quickThoughts);

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
              <Image id={id + `image`} src={imgSrc}></Image>
              <Popup
                trigger={
                  <InsertImage onClick={this.handleInsertImage}>
                    <MdInsertPhoto />
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
                style={{ width: `${4 * category.length + 30}pt` }}
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
                <IconContext.Provider value={{ style: { cursor: 'pointer' } }}>
                  <FiTrash
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
