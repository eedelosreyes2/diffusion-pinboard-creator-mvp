import React, { Component } from 'react';
import axios from 'axios';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import PinboardCreator from './components/PinboardCreator';
import LogInComponent from './components/LogInComponent';
import ShareBoard from './components/ShareBoard';
import styled from 'styled-components';
import { DB_URL, scraperEndpoint, colors } from './globals';
import './App.css';

const Container = styled.div`
  background-color: ${colors.grey50};
  color: white;
`;

const MobileContainer = styled.div`
  color: ${colors.primary};
  display: flex;
  justify-content: center;
  margin: auto;
  max-width: 450px;
  padding-top: 50px;
  text-align: center;
`;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      profileObj: {
        email: 'elijah@diffusion.me',
        givenName: 'User',
        familyName: 'New',
        googleId: '107843568739163028446',
      },
      username: null,
      data: null,
    };
  }

  componentDidMount = () => {
    this.getCache();
    window.addEventListener('load', this.getCache);
    window.addEventListener('beforeunload', this.setCache);
    setInterval(() => {
      this.fetchNewContent();
    }, 1000);
  };

  componentWillUnmount = () => {
    this.setCache();
    window.removeEventListener('load', this.getCache);
    window.removeEventListener('beforeunload', this.setCache);
  };

  getCache = () => {
    const state = JSON.parse(localStorage.getItem('state'));
    if (state) {
      const { profileObj, username } = state;
      if (profileObj) {
        this.setState({ profileObj, username });
        setTimeout(() => {
          this.fetchBoads();
        }, 1000);
      }
    }
  };

  setCache = () => {
    localStorage.setItem('state', JSON.stringify(this.state));
    this.putBoards();
  };

  fetchBoads = async () => {
    const { profileObj } = this.state;
    const boardsURL = DB_URL + this.state.username + '/data.json';

    axios
      .get(boardsURL)
      .then((res) => {
        const { data } = res;
        if (data) {
          const name = profileObj.givenName + ' ' + profileObj.familyName;
          data.name = name;

          // Fetch meta tags
          if (data.content) {
            Object.entries(data.content).map((contentObj) => {
              let content = contentObj[1];
              if (!content.metaTitle) {
                axios
                  .post(
                    scraperEndpoint,
                    { url: content.url },
                    {
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                      },
                    }
                  )
                  .then((res) => {
                    const { metaTitle, metaFavicon, metaImagebase64 } =
                      res.data;
                    content = {
                      ...content,
                      metaTitle,
                      metaFavicon,
                      metaImagebase64,
                    };
                    data.content[content.id] = content;
                  })
                  .catch((err) => console.log(content.url, err));
              }
            });
          }

          this.setState({ data });
        } else {
          const board0 = {
            id: 'board0',
            title: 'Fresh Content',
            contentIds: [0],
          };
          const boardOrder = ['board0'];
          const initialState = {
            data: {
              content: {},
              boards: {
                [board0.id]: board0,
              },
              boardOrder,
            },
          };

          this.updateBoards(initialState);
        }
      })
      .catch((err) => console.log(err));
  };

  putBoards = async () => {
    let url = DB_URL + this.state.username + '/data.json';
    const { data } = this.state;

    if (data) {
      data.newContent = null;
      axios.put(url, data, { headers: { 'Content-Type': 'text/plain' } });
    }
  };

  fetchNewContent = async () => {
    let url = DB_URL + this.state.username + '/data/newContent.json';
    axios.get(url).then((res) => {
      const { data } = res;
      if (data) {
        Object.entries(data).map((newContent) => {
          const { url, quickThoughts, category, date } = newContent[1];
          const id = uuidv4();
          let newCard = {
            id,
            url,
            quickThoughts,
            category,
            date,
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
                isScraped: true,
              };

              const content = {
                ...this.state.data.content,
                [newCard.id]: newCard,
              };
              const newState = {
                ...this.state,
                data: {
                  ...this.state.data,
                  content,
                },
              };
              this.setState(newState);
              this.putBoards();
            })
            .catch((err) => console.log(url, err));

          const content = {
            ...this.state.data.content,
            [newCard.id]: newCard,
          };
          const board0 = {
            ...this.state.data.boards.board0,
            contentIds: [id, ...this.state.data.boards.board0.contentIds],
          };
          const boards = {
            ...this.state.data.boards,
            board0,
          };
          const newState = {
            ...this.state,
            data: {
              ...this.state.data,
              content,
              boards,
            },
          };
          this.setState(newState);
          this.putBoards();
        });
      }
    });
  };

  updateBoards = (newState) => {
    this.setState(newState, () => {
      this.putBoards();
    });
  };

  responseGoogleLogin = (response) => {
    if (response.profileObj) {
      const profileObj = response.profileObj;
      const email = profileObj.email;
      const username = email.replace(/[^a-zA-Z0-9 ]/g, '');
      this.setState({ username });
      this.setState({ profileObj });
      this.fetchBoads();
    }
  };

  responseGoogleLogout = (response) => {
    if (window.confirm('Logout?')) {
      this.setState({ profileObj: null, username: null });
    }
  };

  render() {
    const { profileObj, username, data } = this.state;

    return (
      <Router basename="/">
        <Switch>
          <Route path="/u">
            <ShareBoard />
          </Route>
          {/* {profileObj ? ( */}
          <Route path="/">
            {window.innerWidth > 768 ? 
              <Container>
                <PinboardCreator
                  profileObj={profileObj}
                  username={username}
                  data={data}
                  updateBoards={this.updateBoards}
                  responseGoogleLogout={this.responseGoogleLogout}
                />
              </Container>
            : 
            <MobileContainer><h3>Sorry, the Diffusion Board Creator is currently only available for Desktop</h3></MobileContainer>}
          </Route>
          {/* ) : (
            <LogInComponent responseGoogleLogin={this.responseGoogleLogin} />
          )} */}
        </Switch>
      </Router>
    );
  }
}
