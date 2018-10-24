import React, { Component } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import Background from './coBackground';

class App extends Component {

    // componentDidMount() {
    //     this.setState({
    //         dataPayload: "Beans"
    //     })
    //     let dataURL = "http://olivier.test/wp-json/wp/v2/posts";
    //     fetch(dataURL)
    //     .then(res => res.json())
    //     .then(res => {
    //         this.setState({
    //             dataPayload: res
    //         })
    //     })
    // }

    render() {
        return(
            <div id="page-inner">
                <h1>Boo</h1>
                <div id="content">
                    I love WordPress
                </div>
                <div>
                    <Route path="/" component={Background} />
                </div>
            </div>
        )
    }

}

render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('page')
);