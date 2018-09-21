/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable flowtype/require-return-type */
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import cn from "classnames";





//
// ─── EXAMPLE USE ────────────────────────────────────────────────────────────────
//
/*
<Tabs
  contentClass="content-class"
  buttonClass="button-class"
  activeButtonClass="active-button-class"
  activeContentClass="active-content-class">
  <Tab title={<span className="xxx">Tab 1</span>}>
    <h5>Tab 1</h5>
    <p>Deneme content Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
  </Tab>
  <Tab title="Tab 2">
    <h5>Tab 2</h5>
    <p>Deneme content Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla tenetur est voluptates in veritatis, quisquam cumque, natus unde doloribus, maiores sint optio harum adipisci..</p>
  </Tab>
</Tabs>
*/




class TabsComponent extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      activeIndex: Number(this.props.activeIndex) || 0
    };
  }

  // componentWillMount() {}
  // componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.setState({
      activeIndex: nextProps.activeIndex || this.state.activeIndex
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {}
  // componentWillUpdate(nextProps, nextState) {}
  // componentDidUpdate(nextProps, nextState) {}
  // componentWillUnmount() {}

  handleClick(event) {
    event.preventDefault();
    const id = event.target.parentElement.id;
    const li = event.target.parentElement.nodeName === "LI" ? event.target.parentElement : event.target.parentElement.parentElement;
    const index = Array.prototype.indexOf.call(li.parentElement.children, li);
    this.setState({
      activeIndex: index
    });

  }

  render() {
    const {
      activeIndex,
      contentClass,
      buttonClass,
      activeButtonClass,
      activeContentClass,
      children
    } = this.props;
    const contentArray = _.map(children, (child) => {
      return {
        title: child.props.title,
        content: child.props.children,
        id: `${Math.random().toString(32).split(".")[1]}`
      };
    });

    return (
      <div id="tabs">

        <div role="tabpanel">

          {/* BUTTONS */}
          <ul className="nav nav-tabs" role="tablist">
            {
              _.map(contentArray, ({ title, id }, index) => {
                const isActive = this.state.activeIndex === index;

                return (
                  <li
                    role="presentation"
                    className={cn(`${buttonClass}`,
                      _.set({}, `active ${activeButtonClass}`, isActive)
                    )}
                    id={id}
                    key={id}
                    onClick={this.handleClick}>
                    <a href="">
                      {title}
                    </a>
                  </li>
                );
              })
            }
          </ul>


          <div className="tab-content">
            {/* CONTENTS */}
            {
              _.map(contentArray, ({ content, id }, index) => {
                const isActive = this.state.activeIndex === index;
                return (
                  <div
                    role="tabpanel"
                    className={cn(`tab-pane ${contentClass}`,
                      _.set({}, `active ${activeContentClass}`, isActive)
                    )}
                    id={`tab-content-${id}`}
                    key={id}>
                    {content}
                  </div>
                );
              })
            }
          </div>


        </div>
      </div>
    );
  }
}

TabsComponent.propTypes = {
  activeIndex: PropTypes.number,
  contentClass: PropTypes.string,
  buttonClass: PropTypes.string,
  activeButtonClass: PropTypes.string,
  activeContentClass: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element).isRequired
};




/* eslint-disable react/no-multi-comp*/
class TabItem extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <li>
        {this.props.children}
      </li>
    );
  }
}

TabItem.propTypes = {
  children: PropTypes.any.isRequired
};


export {
  TabsComponent as Tabs,
  TabItem as Tab
};
