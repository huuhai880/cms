import React, { Component } from "react";
import "./styles.scss";

import Account from "./Account";
import DashboardHeader from "./DashboardHeader";

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <DashboardHeader />
        {/* <Account /> */}
        {console.log(window)}
      </div>
    );
  }
}

export default Dashboard;
