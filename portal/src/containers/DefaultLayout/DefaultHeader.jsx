import React, { Component } from 'react';
// import { Link, NavLink } from 'react-router-dom';
import { /* Badge, */UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav/*, NavItem*/ } from 'reactstrap';
import PropTypes from 'prop-types';

import { /*AppAsideToggler, */AppNavbarBrand } from '@coreui/react';
import SidebarToggler from '../../components/Common/Sidebar/es/SidebarToggler';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/logo.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    // User's auth
    const { userAuth } = window._$g;

    return (
      <React.Fragment>
        <SidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 50, height: 40, alt: 'SCC' }}
          minimized={{ src: sygnet, width: 35, height: 25, alt: 'SCC' }}
        />
        <SidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          
        </Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img className="img-avatar" alt="avatars" src={userAuth && userAuth.defaultPictureUrl()} />
              <span className="none767 mr-3">
                {userAuth ? `${userAuth.user_name} - ${userAuth._fullname()}` : ''}
              </span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={e => this.props.onChangePassword(e)}><i className="fa fa-key"></i> Thay đổi mật khẩu</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
