import React, { Component } from "react";
import Address, { DEFAULT_COUNTRY_ID } from "../Common/Address";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Media,
  InputGroup,
  InputGroupAddon,
  // InputGroupText,
  Table,
} from "reactstrap";
import Select from "react-select";
import { CircularProgress, Checkbox } from "@material-ui/core";

export default class AcccountAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initCountry: true,
      isLoading: true,
    };
  }
  handleChangeProvince = (selectedProvince) => {
    const { formik } = this.props;
    formik.setFieldValue("province_id", selectedProvince.value);
    formik.setFieldValue("district_id", "");
    formik.setFieldValue("ward_id", "");

    this.setState(
      {
        selectedProvince: null,
        selectedDistrict: null,
        selectedWard: null,
      },
      () => this.setState({ selectedProvince })
    );
  };

  handleChangeDistrict = (selectedDistrict) => {
    const { formik } = this.props;
    formik.setFieldValue("district_id", selectedDistrict.value);
    formik.setFieldValue("ward_id", "");
    this.setState(
      {
        selectedDistrict: null,
        selectedWard: null,
      },
      () => this.setState({ selectedDistrict })
    );
  };

  handleChangeWard = (selectedWard) => {
    const { formik } = this.props;
    formik.setFieldValue("ward_id", selectedWard.value);

    this.setState(
      {
        selectedWard: null,
      },
      () => this.setState({ selectedWard })
    );
  };
  render() {
    const { formik } = this.props;
    setTimeout(() => this.setState({ isLoading: false }), 2000);
    return (
      <div style={{ width: "100%" }}>
        <Row className="mb15">
          <Col xs={12}>
            <b className="underline">Địa chỉ</b>
          </Col>
        </Row>
        {this.state.isLoading ? (
          <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
            <CircularProgress />
          </div>
        ) : (
          <div>
            <Col>
              <Address>
                {(addrProps) => {
                  let { CountryComponent, ProvinceComponent, DistrictComponent, WardComponent } =
                    addrProps;
                  return (
                    <FormGroup>
                      <Row>
                        <Col xs={12} sm={6} className="mb-1">
                          <Label for="" className="mr-sm-2">
                            Tỉnh/ Thành phố
                          </Label>
                          <ProvinceComponent
                            className="MuiPaper-filter__custom--select"
                            id="province_id"
                            name="province_id"
                            onChange={this.handleChangeProvince}
                            mainValue={6}
                            value={formik.values.province_id}
                          />
                          {formik.errors.province_id && (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.province_id}
                            </div>
                          )}
                        </Col>
                        <Col xs={12} sm={6} className="mb-1">
                          <Label for="" className="mr-sm-2">
                            Quận/ Huyện
                          </Label>

                          <DistrictComponent
                            className="MuiPaper-filter__custom--select"
                            id="district_id"
                            name="district_id"
                            onChange={this.handleChangeDistrict}
                            mainValue={formik.values.province_id}
                            value={formik.values.district_id}
                          />
                          {formik.errors.district_id && (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.district_id}
                            </div>
                          )}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} sm={6} className="mb-1">
                          <Label for="" className="mr-sm-2">
                            Phường/ Xã
                          </Label>

                          <WardComponent
                            className="MuiPaper-filter__custom--select"
                            id="ward_id"
                            name="ward_id"
                            onChange={this.handleChangeWard}
                            mainValue={formik.values.district_id}
                            value={formik.values.ward_id}
                          />

                          {formik.errors.ward_id && (
                            <div
                              className="field-validation-error alert alert-danger fade show"
                              role="alert"
                            >
                              {formik.errors.ward_id}
                            </div>
                          )}
                        </Col>
                        <Col xs={12} sm={6} className="mb-1">
                          <Label for="" className="mr-sm-2">
                            Địa chỉ cụ thể
                          </Label>
                          <Input
                            name="address"
                            id="address"
                            type="text"
                            placeholder="Địa chỉ cụ thể"
                            // disabled={noEdit}
                            value={formik.values.address}
                            onChange={formik.handleChange}
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  );
                }}
              </Address>
            </Col>
          </div>
        )}
      </div>
    );
  }
}
