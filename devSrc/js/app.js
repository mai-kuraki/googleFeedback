import React from 'react';
import ReactDOM from 'react-dom';
import Window from './window';

class GoogleFeedback extends React.Component {
    constructor() {
        super();
        this.state = {
            submit: false,
            windowHeight: 0,
        }
    }

    componentDidMount() {
        let windowHeight = window.innerHeight;
        this.setState({
            windowHeight: windowHeight,
        })
    }

    render() {
        let state = this.state;
        return (
            <div id="googleFeedback" style={{height: `${state.windowHeight}px`}}>
                {
                    this.state.submit?
                        <div className="feedback-submiting-icon">
                            <svg viewBox="0 0 40 40" style={{width: '40px', height: '40px', position: 'relative'}}>
                                <circle cx="20" cy="20" r="18.25" fill="none" strokeWidth="3.5"
                                        strokeMiterlimit="20"
                                        style={{stroke: 'rgb(57, 134, 255)', strokeLnecap: 'round'}}></circle>
                            </svg>
                        </div>:null
                }
                <Window/>
            </div>
        )
    }
}

ReactDOM.render(
    <GoogleFeedback></GoogleFeedback>,
    document.getElementById('main')
);