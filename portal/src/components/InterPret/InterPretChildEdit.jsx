import React, { useState, useEffect } from "react";
import InterPretChildAdd from "./InterPretChildAdd";
import { useParams } from "react-router";
import InterpretModel from "../../models/InterpretModel";

function InterPretChildEdit() {
  const _interpretModel = new InterpretModel();

  let { id } = useParams();
  const [dataInterpretDetail, setDataInterpretDetail] = useState([]);

  useEffect(() => {
    // console.log(id)
    const _callAPI = async () => {
      // console.log(dataInterpretDetail)
      try {
        await _interpretModel.detailInterPretDetail(id).then((data) => {
          setDataInterpretDetail(data);
            // console.log(data);
        });
      } catch (error) {
        console.log(error);
        window._$g.dialogs.alert(window._$g._("Đã có lỗi xảy ra. Vùi lòng F5 thử lại"));
      }
    };
    _callAPI();
  }, []);
  return <InterPretChildAdd dataInterpretDetailEnt={dataInterpretDetail}/>;
}

export default InterPretChildEdit;
