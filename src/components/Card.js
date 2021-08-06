import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ContentEditable from 'react-contenteditable';
import Popup from 'reactjs-popup';
import ImageUploader from 'react-images-upload';
import { IconContext } from 'react-icons/lib';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdInsertPhoto } from 'react-icons/md';
import styled from 'styled-components';
import { colors } from '../globals';
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
      this.props.editCard(reader.result, id);
    };
    reader.readAsDataURL(image[0]);
  };

  handleURL = (id) => {
    const url = prompt('Enter the URL of the image: ');
    if (url) {
      if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
        this.props.editCard(url, id);
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
    const url = this.setHttp(this.props.content.url);

    let imgSrc = '';
    if (metaImagebase64) {
      imgSrc = `data:image/png;base64,${metaImagebase64}`;
    } else if (customImage) {
      imgSrc = customImage;
    } else {
      imgSrc = Logo;
    }

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
