import React from 'react';
import ReactDOM from 'react-dom';
import FeedbackComponent from './feedback';
import '../../dist/style.css';

class Feedback {
    constructor(option) {
        this.container = option.container;
        this.trigger = option.trigger;
        this.send = option.send;
        this.theme = option.theme || null;
        this.license = option.license || '';
        this.proxy = option.proxy || null;
        this.title = option.title || '';
        this.placeholder = option.placeholder || '';
        this.requiredTip = option.requiredTip || '';
        this.editTip = option.editTip || '';
        this.loadingTip = option.loadingTip || '';
        this.checkboxLabel = option.checkboxLabel || '';
        this.cancelLabel = option.cancelLabel || '';
        this.confirmLabel = option.confirmLabel || '';
        this.hightlightTip = option.hightlightTip || '';
        this.hideTip = option.hideTip || '';
        this.editDoneLabel = option.editDoneLabel || '';
        if(!this.container) {
            console.error('missing container element');
            return;
        }
        ReactDOM.render(<Page
            trigger={this.trigger}
            send={this.send}
            theme={this.theme}
            license={this.license}
            proxy={this.proxy}
            title={this.title}
            placeholder={this.placeholder}
            requiredTip={this.requiredTip}
            editTip={this.editTip}
            loadingTip={this.loadingTip}
            checkboxLabel={this.checkboxLabel}
            cancelLabel={this.cancelLabel}
            confirmLabel={this.confirmLabel}
            hightlightTip= {this.hightlightTip}
            hideTip= {this.hideTip}
            editDoneLabel= {this.editDoneLabel}
        />, this.container);
    }
}

window.Feedback = Feedback;

class Page extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
        }
    }

    componentDidMount() {
        if(this.props.trigger) {
            this.props.trigger.addEventListener('click', () => {
                this.setState({
                    open: true,
                })
            })
        }
    }

    cancel() {
        this.setState({
            open: false,
        })
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.open?
                        <FeedbackComponent
                            theme={this.props.theme}
                            cancel={this.cancel.bind(this)}
                            send={this.props.send}
                            license={this.props.license}
                            proxy={this.props.proxy}
                            title={this.props.title}
                            placeholder={this.props.placeholder}
                            requiredTip={this.props.requiredTip}
                            editTip={this.props.editTip}
                            loadingTip={this.props.loadingTip}
                            checkboxLabel={this.props.checkboxLabel}
                            cancelLabel={this.props.cancelLabel}
                            confirmLabel={this.props.confirmLabel}
                            hightlightTip= {this.props.hightlightTip}
                            hideTip= {this.props.hideTip}
                            editDoneLabel= {this.props.editDoneLabel}
                        />:null
                }
            </React.Fragment>
        )
    }
}