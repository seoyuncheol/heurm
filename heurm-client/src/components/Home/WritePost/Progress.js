import React, { Component } from "react";
import styled from "styled-components";
import oc from "open-color";

const Wrapper = styled.div`
  background: ${oc.cyan[4]};
  height: 4px;
  position: relative;
  left: 0px;
  bottom: 0px;
  width: ${props => props.percentage + "%"};
  ${props => props.percentage !== 0 && `transition: all 1s ease-in-out;`}
`;

class Progress extends Component {
  state = {
    percentage: 0
  };

  timeoutId = null;

  handlePost = () => {
    const { onPost } = this.props;
    onPost();
  };

  componentWillReceiveProps(nextProps) {
    clearTimeout(this.timeoutId);

    this.setState({
      percentage: 0
    });

    if (nextProps.value === "") {
      return;
    }

    setTimeout(
      () =>
        this.setState({
          percentage: 100
        }),
      0
    );

    this.timeoutId = setTimeout(this.handlePost, 1000);
  }

  render() {
    const { percentage } = this.state;

    return <Wrapper percentage={percentage} />;
  }
}
export default Progress;
