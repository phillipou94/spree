import React, {Component} from 'react';
import { withRouter } from 'react-router';
import CSSModules from 'react-css-modules';
import styles from "./EventCarousel.css";
import {Carousel} from 'react-responsive-carousel';

class EventCarousel extends Component {
    render() {
        return (
          <div>
            <Carousel showThumbs={false}>
                <div>
                    <iframe width="160" height="90" src="https://www.youtube.com/embed/n0F6hSpxaFc" />
                </div>

                <div>
                    <iframe width="160" height="90" src="https://www.youtube.com/embed/C-y70ZOSzE0" />
                </div>

                <div>
                    <iframe width="160" height="90" src="https://www.youtube.com/embed/IyTv_SR2uUo" />
                </div>

                <div>
                    <iframe width="160" height="90" src="https://www.youtube.com/embed/3zrfGHQd4Bo" />
                </div>
            </Carousel>
          </div>
        )
    }
}

export default withRouter(CSSModules(EventCarousel, styles));
