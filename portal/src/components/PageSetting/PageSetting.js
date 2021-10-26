import React, { PureComponent } from "react";
import {
    Alert,
    Col,
    Row,
    Button,
    Media,
    Nav,
    NavItem,
    NavLink,
    TabPane,
    TabContent,
    CardBody,
    CardHeader,
    Card,
} from "reactstrap";

// Assets
import "./styles.scss";

// Component(s)
import Home from "./Page/Home";
import Author from "./Page/Author";
import Publishing from "./Page/Publishing";
import Contact from "./Page/Contact";
import Introduce from "./Page/Introduce";
import SEO from "./Page/SEO";
import Login from "./Page/Login";
import Footer from "./Page/Footer";
import Decryption from "./Page/Decryption";
import SearchResults from "./Page/SearchResult";

// Model(s)
import AppConfigModel from "../../models/AppConfigModel";

/**
 * @class PageSetting
 */
export default class PageSetting extends React.Component {
    constructor(props) {
        super(props);

        // Init model(s)
        this._appConfigModel = new AppConfigModel();

        this.state = {
            activeTab: "HOME",
        };
    }

    componentDidMount() { }

    renderTab = () => {
        const { activeTab } = this.state;
        switch (activeTab) {
            case "HOME":
                return <Home />;
            case "AUTHOR":
                return <Author />;
            case "PUBLISHING":
                return <Publishing />;
            case "INTRODUCE":
                return <Introduce />;
            case "CONTACT":
                return <Contact />;
            case "LOGIN":
                return <Login />;
            case 'SEARCHRESULTS':
                return <SearchResults />
            case "FOOTER":
                return <Footer />;
            case "DECRYPTION":
                return <Decryption />;
            case "SEO":
                return <SEO />;
        }
    };

    render() {
        let { activeTab } = this.state;

        return (
            <div key={`view-page-setting`} className="animated fadeIn">
                <Row className="d-flex justify-content-center">
                    <Col xs={12} md={12}>
                        <Card>
                            <CardHeader>
                                <b>Cài đặt trang web</b>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Nav tabs>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "HOME" ? "active" : ""
                                                    }`}
                                                onClick={() => this.setState({ activeTab: "HOME" })}
                                            >
                                                Trang chủ
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "CONTACT" ? "active" : ""
                                                    }`}
                                                onClick={() =>
                                                    this.setState({ activeTab: "CONTACT" })
                                                }
                                            >
                                                Liên hệ
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "LOGIN" ? "active" : ""
                                                    }`}
                                                onClick={() =>
                                                    this.setState({ activeTab: "LOGIN" })
                                                }
                                            >
                                                Đăng nhập
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "DECRYPTION" ? "active" : ""
                                                    }`}
                                                onClick={() =>
                                                    this.setState({ activeTab: "DECRYPTION" })
                                                }
                                            >
                                                Giải mã cá nhân
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "SEARCHRESULTS" ? "active" : ""
                                                    }`}
                                                onClick={() =>
                                                    this.setState({ activeTab: "SEARCHRESULTS" })
                                                }
                                            >
                                                Kết quả tra cứu
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "FOOTER" ? "active" : ""
                                                    }`}
                                                onClick={() =>
                                                    this.setState({ activeTab: "FOOTER" })
                                                }
                                            >
                                                Footer
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={`${activeTab === "SEO" ? "active" : ""}`}
                                                onClick={() => this.setState({ activeTab: "SEO" })}
                                            >
                                                SEO website
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={activeTab} style={{ width: "100%" }}>
                                        <TabPane tabId={activeTab}>{this.renderTab()}</TabPane>
                                    </TabContent>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
