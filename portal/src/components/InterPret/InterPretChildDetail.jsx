import React, { useState, useEffect } from "react";
import InterPretChildAdd from "./InterPretChildAdd";
import { useParams } from "react-router";
import InterpretModel from "../../models/InterpretModel";
import Loading from "../Common/Loading";

const _interpretModel = new InterpretModel();

function InterPretChildDetail() {
  let { id } = useParams();
  const [interpretDetail, setInterpretDetail] = useState(null);

  useEffect(() => {
    _callAPI();
  }, []);

  const _callAPI = async () => {
    try {
      let data = await _interpretModel.detailInterPretDetail(id);
      setInterpretDetail(data);
    } catch (error) {
      window._$g.dialogs.alert(
        window._$g._("Đã có lỗi xảy ra. Vui lòng F5 thử lại")
      );
    }
  };

  if (!interpretDetail) return <Loading />;

  return (
    <InterPretChildAdd noEdit={true} interpretDetailEnt={interpretDetail} />
  );
}

export default InterPretChildDetail;
